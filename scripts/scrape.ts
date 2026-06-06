// @ts-nocheck
const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function scrapePlacements() {
  console.log('Connecting to database...');
  
  // Get 5 colleges to test scraping
  const colleges = await prisma.college.findMany({
    take: 5,
    orderBy: { nirfRank: 'asc' }, // Let's try top ranked colleges first
    include: { placements: true }
  });

  console.log(`Found ${colleges.length} colleges to scrape.`);

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false }); // Set to false to see what it's doing
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (const college of colleges) {
    console.log(`\n---------------------------------`);
    console.log(`Scraping data for: ${college.name}`);
    
    try {
      // 1. Search Bing for the college's placement page on Collegedunia
      const searchQuery = encodeURIComponent(`${college.name} placements collegedunia`);
      await page.goto(`https://www.bing.com/search?q=${searchQuery}`);
      
      // Wait for results
      await page.waitForSelector('h2 a', { timeout: 10000 });
      
      // Find the first Collegedunia link
      const links = await page.$$eval('h2 a', anchors => anchors.map(a => a.href));
      const collegeduniaLink = links.find(link => link.includes('collegedunia.com') && link.includes('placement'));

      if (!collegeduniaLink) {
        console.log(`❌ No Collegedunia placement link found on Bing for ${college.name}. Skipping.`);
        continue;
      }

      console.log(`🔍 Found link: ${collegeduniaLink}`);
      
      // 2. Navigate to Collegedunia
      await page.goto(collegeduniaLink, { waitUntil: 'domcontentloaded' });
      await delay(3000); // Wait for React to render

      // 3. Extract the placement data (This is highly dependent on their HTML structure)
      // We will look for elements containing the text "Highest Package" and "Average Package"
      const pageText = await page.evaluate(() => document.body.innerText);
      
      // Simple Regex to find patterns like "Highest Package: 150 LPA" or "Average Package INR 15 LPA"
      const highestMatch = pageText.match(/Highest Package.*?(?:INR|Rs\.?)?\s*([\d\.]+)\s*(?:LPA|Lakhs?)/i);
      const averageMatch = pageText.match(/Average Package.*?(?:INR|Rs\.?)?\s*([\d\.]+)\s*(?:LPA|Lakhs?)/i);

      let highestPackage = null;
      let averagePackage = null;

      if (highestMatch && highestMatch[1]) {
        highestPackage = parseFloat(highestMatch[1]);
        console.log(`✅ Found Highest Package: ${highestPackage} LPA`);
      } else {
        console.log(`⚠️ Could not parse Highest Package from page text.`);
      }

      if (averageMatch && averageMatch[1]) {
        averagePackage = parseFloat(averageMatch[1]);
        console.log(`✅ Found Average Package: ${averagePackage} LPA`);
      } else {
        console.log(`⚠️ Could not parse Average Package from page text.`);
      }

      // 4. Update the database if we found data
      if (highestPackage || averagePackage) {
        await prisma.placement.update({
          where: { collegeId: college.id },
          data: {
            highestPackage: highestPackage || college.placements?.highestPackage,
            avgPackage: averagePackage || college.placements?.avgPackage,
          }
        });
        console.log(`💾 Successfully saved real placement data for ${college.name}!`);
      }

      // Wait between scrapes to avoid getting IP banned
      const waitTime = Math.floor(Math.random() * 4000) + 3000;
      console.log(`Sleeping for ${waitTime}ms to prevent bans...`);
      await delay(waitTime);

    } catch (err) {
      console.error(`❌ Error scraping ${college.name}:`, err.message);
    }
  }

  console.log('\nClosing browser...');
  await browser.close();
  await prisma.$disconnect();
  console.log('Scraping session finished!');
}

scrapePlacements();
