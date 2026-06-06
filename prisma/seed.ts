const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hardcodedColleges = [
  // Top 10 IITs
  { name: 'Indian Institute of Technology Madras', state: 'Tamil Nadu', city: 'Chennai', nirfRank: 1, type: 'Government', rating: 4.8, isEng: true, pAvg: 21.48, pHigh: 198.0, pRate: 95, pRec: ['Google', 'Microsoft', 'Apple'], cName: 'B.Tech Computer Science', cFees: 800000 },
  { name: 'Indian Institute of Technology Delhi', state: 'Delhi', city: 'New Delhi', nirfRank: 2, type: 'Government', rating: 4.7, isEng: true, pAvg: 21.9, pHigh: 200.0, pRate: 96, pRec: ['Jane Street', 'Optiver', 'Google'], cName: 'B.Tech Computer Science', cFees: 850000 },
  { name: 'Indian Institute of Technology Bombay', state: 'Maharashtra', city: 'Mumbai', nirfRank: 3, type: 'Government', rating: 4.9, isEng: true, pAvg: 21.82, pHigh: 367.0, pRate: 98, pRec: ['Uber', 'Rubrik', 'Microsoft'], cName: 'B.Tech Computer Science', cFees: 850000 },
  { name: 'Indian Institute of Technology Kanpur', state: 'Uttar Pradesh', city: 'Kanpur', nirfRank: 4, type: 'Government', rating: 4.6, isEng: true, pAvg: 22.07, pHigh: 190.0, pRate: 94, pRec: ['Tower Research', 'Google', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 820000 },
  { name: 'Indian Institute of Technology Roorkee', state: 'Uttarakhand', city: 'Roorkee', nirfRank: 5, type: 'Government', rating: 4.5, isEng: true, pAvg: 18.34, pHigh: 130.0, pRate: 93, pRec: ['Microsoft', 'Sprinklr', 'Goldman Sachs'], cName: 'B.Tech Computer Science', cFees: 800000 },
  { name: 'Indian Institute of Technology Kharagpur', state: 'West Bengal', city: 'Kharagpur', nirfRank: 6, type: 'Government', rating: 4.6, isEng: true, pAvg: 19.5, pHigh: 240.0, pRate: 94, pRec: ['Apple', 'Google', 'AlphaGrep'], cName: 'B.Tech Computer Science', cFees: 810000 },
  { name: 'Indian Institute of Technology Guwahati', state: 'Assam', city: 'Guwahati', nirfRank: 7, type: 'Government', rating: 4.5, isEng: true, pAvg: 21.5, pHigh: 120.0, pRate: 92, pRec: ['Google', 'Microsoft', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 800000 },
  { name: 'Indian Institute of Technology Hyderabad', state: 'Telangana', city: 'Hyderabad', nirfRank: 8, type: 'Government', rating: 4.6, isEng: true, pAvg: 20.07, pHigh: 63.7, pRate: 90, pRec: ['TSMC', 'Microsoft', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 830000 },
  { name: 'Indian Institute of Technology BHU', state: 'Uttar Pradesh', city: 'Varanasi', nirfRank: 15, type: 'Government', rating: 4.4, isEng: true, pAvg: 18.96, pHigh: 115.0, pRate: 88, pRec: ['Google', 'Rakuten', 'Microsoft'], cName: 'B.Tech Computer Science', cFees: 800000 },
  { name: 'Indian Institute of Technology Indore', state: 'Madhya Pradesh', city: 'Indore', nirfRank: 14, type: 'Government', rating: 4.3, isEng: true, pAvg: 23.5, pHigh: 60.0, pRate: 89, pRec: ['Amazon', 'Samsung', 'Walmart'], cName: 'B.Tech Computer Science', cFees: 800000 },
  
  // Top 5 NITs
  { name: 'National Institute of Technology Tiruchirappalli', state: 'Tamil Nadu', city: 'Tiruchirappalli', nirfRank: 9, type: 'Government', rating: 4.5, isEng: true, pAvg: 12.0, pHigh: 52.89, pRate: 90, pRec: ['Google', 'Morgan Stanley', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 600000 },
  { name: 'National Institute of Technology Surathkal', state: 'Karnataka', city: 'Surathkal', nirfRank: 12, type: 'Government', rating: 4.4, isEng: true, pAvg: 13.0, pHigh: 54.0, pRate: 89, pRec: ['Microsoft', 'Uber', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 600000 },
  { name: 'National Institute of Technology Rourkela', state: 'Odisha', city: 'Rourkela', nirfRank: 16, type: 'Government', rating: 4.3, isEng: true, pAvg: 11.15, pHigh: 46.08, pRate: 85, pRec: ['Amazon', 'Tata Steel', 'Bajaj'], cName: 'B.Tech Computer Science', cFees: 600000 },
  { name: 'National Institute of Technology Warangal', state: 'Telangana', city: 'Warangal', nirfRank: 21, type: 'Government', rating: 4.4, isEng: true, pAvg: 17.29, pHigh: 88.0, pRate: 88, pRec: ['Microsoft', 'Amazon', 'TCS'], cName: 'B.Tech Computer Science', cFees: 600000 },
  { name: 'National Institute of Technology Calicut', state: 'Kerala', city: 'Kozhikode', nirfRank: 23, type: 'Government', rating: 4.2, isEng: true, pAvg: 11.5, pHigh: 47.0, pRate: 84, pRec: ['Amazon', 'Oracle', 'Cisco'], cName: 'B.Tech Computer Science', cFees: 600000 },

  // Top 5 IIMs
  { name: 'Indian Institute of Management Ahmedabad', state: 'Gujarat', city: 'Ahmedabad', nirfRank: 1, type: 'Government', rating: 4.9, isMBA: true, pAvg: 32.79, pHigh: 115.0, pRate: 100, pRec: ['McKinsey', 'BCG', 'Bain & Co.'], cName: 'MBA', cFees: 2500000 },
  { name: 'Indian Institute of Management Bangalore', state: 'Karnataka', city: 'Bangalore', nirfRank: 2, type: 'Government', rating: 4.8, isMBA: true, pAvg: 33.82, pHigh: 80.0, pRate: 100, pRec: ['Goldman Sachs', 'BCG', 'Accenture'], cName: 'MBA', cFees: 2450000 },
  { name: 'Indian Institute of Management Kozhikode', state: 'Kerala', city: 'Kozhikode', nirfRank: 3, type: 'Government', rating: 4.7, isMBA: true, pAvg: 29.23, pHigh: 67.02, pRate: 100, pRec: ['Deloitte', 'Aditya Birla Group', 'Amazon'], cName: 'MBA', cFees: 2050000 },
  { name: 'Indian Institute of Management Calcutta', state: 'West Bengal', city: 'Kolkata', nirfRank: 4, type: 'Government', rating: 4.8, isMBA: true, pAvg: 34.2, pHigh: 120.0, pRate: 100, pRec: ['BCG', 'McKinsey', 'Keystone'], cName: 'MBA', cFees: 2500000 },
  { name: 'Indian Institute of Management Lucknow', state: 'Uttar Pradesh', city: 'Lucknow', nirfRank: 6, type: 'Government', rating: 4.6, isMBA: true, pAvg: 32.2, pHigh: 65.0, pRate: 100, pRec: ['Accenture', 'Amazon', 'BCG'], cName: 'MBA', cFees: 2000000 },

  // Top 5 Medical
  { name: 'All India Institute of Medical Sciences Delhi', state: 'Delhi', city: 'New Delhi', nirfRank: 1, type: 'Government', rating: 4.9, isMed: true, pAvg: 12.0, pHigh: 24.0, pRate: 98, pRec: ['AIIMS', 'Max Healthcare', 'Apollo Hospitals'], cName: 'MBBS', cFees: 6000 },
  { name: 'PGIMER Chandigarh', state: 'Chandigarh', city: 'Chandigarh', nirfRank: 2, type: 'Government', rating: 4.8, isMed: true, pAvg: 14.0, pHigh: 22.0, pRate: 99, pRec: ['PGIMER', 'Fortis', 'Medanta'], cName: 'MBBS', cFees: 8000 },
  { name: 'Christian Medical College', state: 'Tamil Nadu', city: 'Vellore', nirfRank: 3, type: 'Private', rating: 4.7, isMed: true, pAvg: 8.5, pHigh: 15.0, pRate: 95, pRec: ['CMC', 'Apollo Hospitals', 'Manipal Hospitals'], cName: 'MBBS', cFees: 150000 },
  { name: 'NIMHANS Bangalore', state: 'Karnataka', city: 'Bangalore', nirfRank: 4, type: 'Government', rating: 4.8, isMed: true, pAvg: 15.0, pHigh: 25.0, pRate: 96, pRec: ['NIMHANS', 'Apollo', 'Fortis'], cName: 'MBBS', cFees: 10000 },
  { name: 'JIPMER Puducherry', state: 'Puducherry', city: 'Puducherry', nirfRank: 5, type: 'Government', rating: 4.6, isMed: true, pAvg: 12.0, pHigh: 20.0, pRate: 95, pRec: ['JIPMER', 'Apollo Hospitals', 'Max Healthcare'], cName: 'MBBS', cFees: 12000 },

  // Top 5 Private Engineering
  { name: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani', nirfRank: 25, type: 'Private', rating: 4.8, isEng: true, pAvg: 30.37, pHigh: 60.75, pRate: 95, pRec: ['Google', 'Microsoft', 'Amazon'], cName: 'B.Tech Computer Science', cFees: 2500000 },
  { name: 'Vellore Institute of Technology', state: 'Tamil Nadu', city: 'Vellore', nirfRank: 11, type: 'Private', rating: 4.3, isEng: true, pAvg: 9.23, pHigh: 102.0, pRate: 90, pRec: ['TCS', 'Cognizant', 'Wipro'], cName: 'B.Tech Computer Science', cFees: 1900000 },
  { name: 'Thapar Institute of Engineering & Technology', state: 'Punjab', city: 'Patiala', nirfRank: 20, type: 'Private', rating: 4.2, isEng: true, pAvg: 10.97, pHigh: 40.0, pRate: 85, pRec: ['Amazon', 'JP Morgan', 'TCS'], cName: 'B.Tech Computer Science', cFees: 1800000 },
  { name: 'Manipal Institute of Technology', state: 'Karnataka', city: 'Manipal', nirfRank: 61, type: 'Private', rating: 4.1, isEng: true, pAvg: 12.59, pHigh: 54.75, pRate: 92, pRec: ['Microsoft', 'Amazon', 'Cisco'], cName: 'B.Tech Computer Science', cFees: 1800000 },
  { name: 'SRM Institute of Science and Technology', state: 'Tamil Nadu', city: 'Chennai', nirfRank: 28, type: 'Private', rating: 4.0, isEng: true, pAvg: 7.58, pHigh: 57.0, pRate: 90, pRec: ['TCS', 'Wipro', 'Cognizant'], cName: 'B.Tech Computer Science', cFees: 1500000 },
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data
  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.cutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create Test User
  const user = await prisma.user.create({
    data: {
      id: 'test-user-id-123',
      email: 'test@example.com',
      name: 'Test Student',
    }
  });

  // Seed Top 30 Hardcoded Colleges with PERFECT Data
  console.log('Seeding top 30 hardcoded colleges...');
  for (const hc of hardcodedColleges) {
    let slug = hc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (slug.endsWith('-')) slug = slug.slice(0, -1);
    
    const college = await prisma.college.create({
      data: {
        name: hc.name,
        slug,
        state: hc.state,
        city: hc.city,
        nirfRank: hc.nirfRank,
        type: hc.type,
        rating: hc.rating,
        totalReviews: Math.floor(Math.random() * 500) + 150,
      }
    });

    // Courses
    await prisma.course.create({
      data: { collegeId: college.id, name: hc.cName, duration: hc.isMBA ? '2 years' : (hc.isMed ? '5.5 years' : '4 years'), totalFees: hc.cFees, seats: 120 }
    });

    // Placements
    await prisma.placement.create({
      data: {
        collegeId: college.id,
        avgPackage: hc.pAvg,
        highestPackage: hc.pHigh,
        placementRate: hc.pRate,
        topRecruiters: JSON.stringify(hc.pRec),
      }
    });

    // Comprehensive Cutoffs for Hardcoded Colleges
    if (hc.isEng) {
      let exams = ['JEE_MAIN', 'JEE_ADV'];
      
      // Fix exams for private colleges
      if (hc.name.includes('BITS')) exams = ['BITSAT'];
      if (hc.name.includes('Vellore')) exams = ['VITEEE'];
      if (hc.name.includes('Manipal')) exams = ['MET'];
      if (hc.name.includes('SRM')) exams = ['SRMJEEE'];

      const categories = ['GENERAL', 'OBC', 'SC', 'ST'];
      for (const exam of exams) {
        if (exam === 'JEE_ADV' && !hc.name.includes('IIT')) continue; // Only IITs take JEE ADV
        for (const cat of categories) {
          let multiplier = 1;
          if (cat === 'OBC') multiplier = 1.5;
          if (cat === 'SC') multiplier = 3;
          if (cat === 'ST') multiplier = 5;
          
          let baseRank = hc.nirfRank * 20 * multiplier;
          if (exam === 'JEE_ADV') baseRank = hc.nirfRank * 10 * multiplier;
          
          await prisma.cutoff.create({
            data: { collegeId: college.id, exam, category: cat, course: hc.cName, openRank: Math.floor(baseRank), closeRank: Math.floor(baseRank + 500 * multiplier), year: 2023 }
          });
        }
      }
    } else if (hc.isMed) {
      const categories = ['GENERAL', 'OBC', 'SC', 'ST'];
      for (const cat of categories) {
        let multiplier = 1;
        if (cat === 'OBC') multiplier = 1.2;
        if (cat === 'SC') multiplier = 2.5;
        if (cat === 'ST') multiplier = 4;
        let baseRank = hc.nirfRank * 100 * multiplier;
        await prisma.cutoff.create({
          data: { collegeId: college.id, exam: 'NEET', category: cat, course: hc.cName, openRank: Math.floor(baseRank), closeRank: Math.floor(baseRank + 1000 * multiplier), year: 2023 }
        });
      }
    } else if (hc.isMBA) {
       const categories = ['GENERAL', 'OBC', 'SC', 'ST'];
      for (const cat of categories) {
        // Mock rank for CAT (percentile converted to rank roughly)
        let baseRank = hc.nirfRank * 10;
        await prisma.cutoff.create({
          data: { collegeId: college.id, exam: 'CAT', category: cat, course: hc.cName, openRank: Math.floor(baseRank), closeRank: Math.floor(baseRank + 50), year: 2023 }
        });
      }
    }
  }

  // Fallback AICTE data for pages 4+
  console.log('Fetching live AICTE dataset from GitHub for remaining colleges...');
  let fetchedColleges = [];

  const toTitleCase = (str) => {
    return str.split(' ').map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  try {
    const res = await fetch('https://raw.githubusercontent.com/anburocky3/indian-colleges-data/main/data/institutions.json');
    const data = await res.json();
    console.log(`Fetched ${data.length} colleges. We will seed the first 170 for performance.`);
    
    // Skip colleges that are already hardcoded (rough name matching)
    const hardcodedNames = hardcodedColleges.map(c => c.name.toLowerCase());
    
    const filteredData = data.filter(c => {
      if (!c.institute_name) return false;
      const isAlreadyAdded = hardcodedNames.some(hn => hn.includes(c.institute_name.toLowerCase()) || c.institute_name.toLowerCase().includes(hn));
      return !isAlreadyAdded;
    });

    fetchedColleges = filteredData.slice(0, 170).map((c, i) => ({
      name: toTitleCase(c.institute_name),
      state: toTitleCase(c.district || 'Unknown'),
      city: toTitleCase(c.district || 'Unknown'),
      nirfRank: 100 + i, // Mock rank
      type: c.institution_type === 'Government' ? 'Government' : 'Private',
      rating: +(Math.random() * (4.5 - 3.0) + 3.0).toFixed(1),
    }));
  } catch (err) {
    console.error('Failed to fetch dataset:', err);
  }

  for (const collegeData of fetchedColleges) {
    let slug = collegeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (slug.endsWith('-')) slug = slug.slice(0, -1);
    slug = `${slug}-${Math.floor(Math.random() * 10000)}`;

    const isMedical = collegeData.name.toLowerCase().includes('medical');
    const isMBA = collegeData.name.toLowerCase().includes('management');
    const isEng = !isMedical && !isMBA;

    const college = await prisma.college.create({
      data: {
        name: collegeData.name,
        slug,
        state: collegeData.state,
        city: collegeData.city,
        nirfRank: collegeData.nirfRank,
        type: collegeData.type,
        rating: collegeData.rating,
        totalReviews: Math.floor(Math.random() * 50) + 5,
      }
    });

    if (isEng) {
      await prisma.course.createMany({
        data: [
          { collegeId: college.id, name: 'B.Tech Computer Science', duration: '4 years', totalFees: collegeData.type === 'Government' ? 800000 : 1500000, seats: 120 }
        ]
      });
    } else if (isMedical) {
      await prisma.course.createMany({
        data: [
          { collegeId: college.id, name: 'MBBS', duration: '5.5 years', totalFees: collegeData.type === 'Government' ? 100000 : 5000000, seats: 100 }
        ]
      });
    } else if (isMBA) {
      await prisma.course.createMany({
        data: [
          { collegeId: college.id, name: 'MBA', duration: '2 years', totalFees: collegeData.type === 'Government' ? 1000000 : 2000000, seats: 200 }
        ]
      });
    }

    let avgPackage = 4.0;
    let highestPackage = 12.0;
    let placementRate = 75.0;
    let recruiters = ['TCS', 'Infosys', 'Wipro'];

    // For these remaining colleges (mocked), give realistic lower tier numbers
    if (collegeData.nirfRank <= 150) {
      avgPackage = +(Math.random() * (7 - 4) + 4).toFixed(1);
      highestPackage = +(Math.random() * (20 - 10) + 10).toFixed(1);
      placementRate = +(Math.random() * (85 - 75) + 75).toFixed(1);
      recruiters = ['Oracle', 'Cognizant', 'Accenture', 'TCS'];
    } else {
      avgPackage = +(Math.random() * (4 - 2.5) + 2.5).toFixed(1);
      highestPackage = +(Math.random() * (10 - 5) + 5).toFixed(1);
      placementRate = +(Math.random() * (75 - 50) + 50).toFixed(1);
      recruiters = ['TCS Ninja', 'Local Startups', 'Tech Mahindra'];
    }

    if (isMedical) {
      avgPackage = +(Math.random() * (10 - 6) + 6).toFixed(1);
      highestPackage = +(Math.random() * (20 - 12) + 12).toFixed(1);
      recruiters = ['Apollo Hospitals', 'Max Healthcare', 'Fortis'];
    } else if (isMBA) {
      avgPackage = +(Math.random() * (10 - 6) + 6).toFixed(1);
      highestPackage = +(Math.random() * (20 - 10) + 10).toFixed(1);
      recruiters = ['Deloitte', 'HDFC Bank', 'ICICI Bank'];
    }

    await prisma.placement.create({
      data: {
        collegeId: college.id,
        avgPackage,
        highestPackage,
        placementRate,
        topRecruiters: JSON.stringify(recruiters),
      }
    });

    // Generate comprehensive mock cutoffs for fetched colleges
    const categories = ['GENERAL', 'OBC', 'SC', 'ST'];
    let examName = 'JEE_MAIN';
    if (isMedical) examName = 'NEET';
    if (isMBA) examName = 'CAT';

    for (const cat of categories) {
      let multiplier = 1;
      if (cat === 'OBC') multiplier = 1.5;
      if (cat === 'SC') multiplier = 3;
      if (cat === 'ST') multiplier = 5;

      // Base rank scales heavily by NIRF rank to ensure a wide distribution of cutoffs
      let baseRank = (collegeData.nirfRank * 250) * multiplier;
      let spread = 5000 * multiplier;
      
      if (isMedical) {
        baseRank = (collegeData.nirfRank * 150) * multiplier;
        spread = 2000 * multiplier;
      }
      if (isMBA) {
        baseRank = (collegeData.nirfRank * 50) * multiplier;
        spread = 500 * multiplier;
      }

      await prisma.cutoff.create({
        data: { 
          collegeId: college.id, 
          exam: examName, 
          category: cat, 
          course: isEng ? 'B.Tech Computer Science' : (isMedical ? 'MBBS' : 'MBA'), 
          openRank: Math.floor(baseRank), 
          closeRank: Math.floor(baseRank + spread), 
          year: 2023 
        }
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
