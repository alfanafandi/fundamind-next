import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { signToken, type JWTPayload } from "./jwt";

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    avatar: string;
    level: number;
    xp: number;
    coin: number;
  };
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResult> {
  try {
    // Check for admin first
    if (username === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { username },
      });

      if (!admin) {
        return { success: false, error: "Admin tidak ditemukan." };
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return { success: false, error: "Password admin salah." };
      }

      const token = await signToken({
        userId: admin.id,
        username: admin.username,
        isAdmin: true,
      });

      return {
        success: true,
        token,
        user: {
          id: admin.id,
          username: admin.username,
          avatar: "Ellipse_1.png",
          level: 0,
          xp: 0,
          coin: 0,
        },
      };
    }

    // Regular user login
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "Akun tidak ditemukan." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "Password salah." };
    }

    // Grant first login achievement
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId: 1,
        },
      },
      create: {
        userId: user.id,
        achievementId: 1,
      },
      update: {},
    });

    const token = await signToken({
      userId: user.id,
      username: user.username,
    });

    // Map avatar enum to filename
    const avatarMap: Record<string, string> = {
      Ellipse_1: "Ellipse_1.png",
      Ellipse_2: "Ellipse_2.png",
      Ellipse_3: "Ellipse_3.png",
      Ellipse_4: "Ellipse_4.png",
      Ellipse_5: "Ellipse_5.png",
    };

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        avatar: avatarMap[user.avatar] || "Ellipse_1.png",
        level: user.level,
        xp: user.xp,
        coin: user.coin,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan saat login." };
  }
}

export async function registerUser(
  username: string,
  password: string
): Promise<RegisterResult> {
  try {
    // Check if username exists
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return { success: false, error: "Username sudah digunakan." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Gagal registrasi." };
  }
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      level: true,
      xp: true,
      xpNext: true,
      coin: true,
      lastChallengeDate: true,
    },
  });
}
