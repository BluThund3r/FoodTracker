import { Exercise, PrismaClient } from "@prisma/client";
import { UserNotFound } from "../exceptions/UserNotFound";
import { ExerciseNotFond } from "../exceptions/ExerciseNotFound";
import { UserExerciseNotFond } from "../exceptions/UserExerciseNotFound";
import { getUserByUsername } from "./userService";

const prisma = new PrismaClient();

export async function getAllExercises() {
  return await prisma.exercise.findMany();
}

export async function getExerciseById(id: string) {
  return await prisma.exercise.findUnique({
    where: {
      id,
    },
  });
}

export async function createExercise(data: Partial<Exercise>) {
  return await prisma.exercise.create({
    data: {
      name: data.name,
      description: data.description || "",
      caloriesPerMinute: data.caloriesPerMinute,
    },
  });
}

export async function updateExercise(id: string, data: Partial<Exercise>) {
  return await prisma.exercise.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description || "",
      caloriesPerMinute: data.caloriesPerMinute,
    },
  });
}

export async function deleteExercise(id: string) {
  return await prisma.exercise.delete({
    where: {
      id,
    },
  });
}

export async function searchExercises(
  name: string,
  limit: number = 5,
  offset: number = 0
) {
  return await prisma.exercise.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    take: limit,
    skip: offset,
    orderBy: [{ caloriesPerMinute: "desc" }, { name: "asc" }],
  });
}

export async function addExerciseToUser(
  username: string,
  exerciseName: string,
  duration: number,
  date: string
) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) throw new UserNotFound();

  const exercise = await prisma.exercise.findUnique({
    where: {
      name: exerciseName,
    },
  });

  if (!exercise) throw new ExerciseNotFond();

  return await prisma.userExercise.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      exercise: {
        connect: {
          id: exercise.id,
        },
      },
      duration,
      date,
    },
  });
}

export async function removeExerciseFromUser(
  username: string,
  exerciseName: string,
  date: string
) {
  const userExercise = await getUserExerciseByDetails(
    username,
    exerciseName,
    date
  );

  return await prisma.userExercise.delete({
    where: {
      id: userExercise.id,
    },
  });
}

export async function updateUserExercise(
  username: string,
  exerciseName: string,
  date: string,
  newDuration: number
) {
  const userExercise = await getUserExerciseByDetails(
    username,
    exerciseName,
    date
  );

  return await prisma.userExercise.update({
    where: {
      id: userExercise.id,
    },
    data: {
      duration: newDuration,
    },
  });
}

export async function deleteUserExercise(id: string) {
  return await prisma.userExercise.delete({
    where: {
      id,
    },
  });
}

function transformUserExercise(userExercise) {
  return {
    ...userExercise,
    caloriesBurned:
      userExercise.duration * userExercise.exercise.caloriesPerMinute,
  };
}

export async function getUserExerciseByDetails(
  username: string,
  exerciseName: string,
  date: string
) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) throw new UserNotFound();

  const exercise = await prisma.exercise.findUnique({
    where: {
      name: exerciseName,
    },
  });

  if (!exercise) throw new ExerciseNotFond();

  const userExercise = await prisma.userExercise.findFirst({
    where: {
      userId: user.id,
      exerciseId: exercise.id,
      date,
    },
    include: {
      exercise: true,
    },
  });

  if (!userExercise) throw new UserExerciseNotFond();
  return transformUserExercise(userExercise);
}

export async function getUserExercisesForDate(username: string, date: string) {
  const user = await getUserByUsername(username);
  if (!user) throw new UserNotFound();

  const userExercises = await prisma.userExercise.findMany({
    where: {
      userId: user.id,
      date,
    },
    include: {
      exercise: true,
    },
  });

  return {
    totalCaloriesBurned: userExercises.reduce((acc, curr) => {
      return acc + curr.duration * curr.exercise.caloriesPerMinute;
    }, 0),
    userExercises: userExercises.map(transformUserExercise),
  };
}
