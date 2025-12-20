import { prisma } from "../../config/prisma";

export async function getUserByEmail(email: string) {
  console.log("Fetching user by email:", email);
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(id: string) {
  console.log("Fetching user by id:", id);
  return prisma.user.findUnique({
    where: {
      uuid: id,
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
              lessons: {
                select: {
                  users: {
                    select: {
                      isCompleted: true,
                    },
                    where: {
                      userId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function upsertUser(email: string, initialPassword: string) {
  console.log("Upserting user for:", email, "with initial password:", initialPassword);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, initialPassword },
  });
}

export async function assignCourseToUser(userId: string, courseId: string) {
  console.log("Assigning course to user:", userId, " with course id:", courseId);
  return prisma.userToCourse.create({
    data: { userId, courseId },
  });
}
