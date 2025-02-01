import { Model } from "mongoose";

export function randomInt(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export async function getRandomK<T>(
  model: Model<T>,
  k: number,
  filter: Record<string, any> = {}
): Promise<T[]> {
  const results = await model.aggregate([
    { $match: filter },
    { $sample: { size: k } },
  ]);

  return results;
}
