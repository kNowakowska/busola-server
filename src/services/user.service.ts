import { prisma } from "../config/prisma";

export async function getUserByEmail(email: string) {
  console.log("Fetching user by email:", email);
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
}

export async function updateUserPassword(email: string, password: string) {
  console.log("Updating user password for:", email);
  return prisma.users.update({
    where: { email },
    data: { password, is_password_reseted: true },
  });
}

export async function saveUserVerificationCode(email: string, code: string) {
  console.log("Saving user verification code for:", email, code);
  return prisma.users.update({
    where: { email },
    data: { verification_code: code.toString() },
  });
}
