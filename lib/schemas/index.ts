import * as z from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(10, "Review must be at least 10 characters long").max(1000),
});

export const predictorSchema = z.object({
  exam: z.enum(["JEE_MAIN", "JEE_ADV", "NEET", "CAT", "GATE"]),
  rank: z.coerce.number().min(1, "Rank must be a positive number"),
  category: z.enum(["GENERAL", "OBC", "SC", "ST"]),
});

export const collegeSearchSchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  course: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  page: z.coerce.number().optional().default(1),
});
