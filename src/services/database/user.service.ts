import { prisma } from "../../config/prisma";

export async function getUserByEmail(email: string) {
  console.log("Fetching user by email:", email);
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function updateUserPassword(email: string, password: string) {
  console.log("Updating user password for:", email);
  return prisma.user.update({
    where: { email },
    data: { password, isPasswordReseted: true },
  });
}

export async function saveUserVerificationCode(email: string, code: string) {
  console.log("Saving user verification code for:", email, code);
  return prisma.user.update({
    where: { email },
    data: { verificationCode: code.toString() },
  });
}

export async function getUserWithCoursesByUserId(userId: string) {
  console.log("Fetching user by user id:", userId);
  return prisma.user.findUnique({
    where: {
      uuid: userId,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      lastName: true,
      courses: {
        select: {
          course: {
            select: {
              uuid: true,
              name: true,
              shortDescription: true,
              imageCMSId: true,
            },
          },
        },
      },
    },
  });
}
