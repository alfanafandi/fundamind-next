import prisma from "./prisma";

/**
 * XP thresholds per level
 * Level 1 -> 100 XP to next level
 * Level 2 -> 200 XP to next level
 * etc.
 */
export function getXpForNextLevel(level: number): number {
  return level * 100;
}

/**
 * Calculate rewards based on score percentage
 */
export function calculateRewards(
  baseXp: number,
  baseCoin: number,
  correctAnswers: number,
  totalQuestions: number,
  isReplay: boolean = false
): { xp: number; coin: number } {
  const percentage = correctAnswers / Math.max(1, totalQuestions);
  const minXp = 20;

  let xp = Math.max(minXp, Math.round(baseXp * percentage));
  let coin = Math.floor(baseCoin * percentage);

  // Replay mode gives 50% rewards
  if (isReplay) {
    xp = Math.floor(xp * 0.5);
    coin = Math.floor(coin * 0.5);
  }

  return { xp, coin };
}

/**
 * Add XP to user and handle level ups
 */
export async function addXpToUser(
  userId: number,
  xpAmount: number
): Promise<{
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  levelsGained: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, xpNext: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let xp = user.xp + xpAmount;
  let level = user.level;
  let xpNext = user.xpNext;
  const originalLevel = level;

  // Check for level ups
  while (xp >= xpNext) {
    xp -= xpNext;
    level++;
    xpNext = getXpForNextLevel(level);
  }

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: { xp, level, xpNext },
  });

  return {
    newXp: xp,
    newLevel: level,
    leveledUp: level > originalLevel,
    levelsGained: level - originalLevel,
  };
}

/**
 * Add coins to user
 */
export async function addCoinsToUser(
  userId: number,
  coinAmount: number
): Promise<number> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { coin: { increment: coinAmount } },
    select: { coin: true },
  });

  return user.coin;
}

/**
 * Get user rank based on XP
 */
export function getRankFromLevel(level: number): string {
  if (level >= 50) return "Grandmaster";
  if (level >= 40) return "Master";
  if (level >= 30) return "Diamond";
  if (level >= 20) return "Platinum";
  if (level >= 15) return "Gold";
  if (level >= 10) return "Silver";
  if (level >= 5) return "Bronze";
  return "Novice";
}

/**
 * Get rank color for UI
 */
export function getRankColor(level: number): string {
  if (level >= 50) return "#ff4444";
  if (level >= 40) return "#9c27b0";
  if (level >= 30) return "#00bcd4";
  if (level >= 20) return "#4caf50";
  if (level >= 15) return "#ffc107";
  if (level >= 10) return "#9e9e9e";
  if (level >= 5) return "#cd7f32";
  return "#607d8b";
}
