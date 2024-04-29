import { PrismaClient, UserDetails } from "@prisma/client";
import { UserNotFound } from "../exceptions/UserNotFound";
import { UserDetailsNotAdded } from "../exceptions/UserDetailsNotAdded";
const prisma = new PrismaClient();

export function isPlan(plan: string) {
  return ["MAINTENANCE", "WEIGHT_LOSS", "WEIGHT_GAIN"].includes(plan);
}

export function isGender(gender: string) {
  return ["M", "F"].includes(gender);
}

export function isActivityLevel(activityLevel: string) {
  return [
    "SEDENTARY",
    "LIGHTLY_ACTIVE",
    "MODERATELY_ACTIVE",
    "VERY_ACTIVE",
    "SUPER_ACTIVE",
  ].includes(activityLevel);
}

export async function addUserDetails(
  username: string,
  userDetails: Partial<UserDetails>
) {
  const user = await getUserByUsername(username);
  if (!user) throw new UserNotFound();
  return await prisma.userDetails.create({
    data: {
      ...userDetails,
      userId: user.id,
    },
  });
}

export async function updateUserDetails(
  username: string,
  userDetails: Partial<UserDetails>
) {
  const user = await getUserByUsername(username);
  if (!user) throw new UserNotFound();
  return await prisma.userDetails.update({
    where: {
      userId: user.id,
    },
    data: {
      ...userDetails,
    },
  });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
}

export async function getUserDetailsByUsername(username: string) {
  const user = await getUserByUsername(username);
  if (!user) throw new UserNotFound();
  const details = await prisma.userDetails.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!details) throw new UserDetailsNotAdded();
  return details;
}
