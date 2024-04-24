import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "./jwtService.js";
import { PasswordsDoNotMatch } from "../exceptions/PasswordsDoNotMatch.js";
import { UserNotFound } from "../exceptions/UserNotFound.js";
import { PasswordIncorrect } from "../exceptions/PasswordIncorrect.js";
import { UsernameNotValid } from "../exceptions/UsernameNotValid.js";
import { UserAlreadyExists } from "../exceptions/UserAlreadyExists.js";
import { PasswordNotValid } from "../exceptions/PasswordNotValid.js";

const prisma = new PrismaClient();
const saltRounds = 10;

export async function registerUser(
  username: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    throw new PasswordsDoNotMatch();
  }

  validatePassword(password);
  validateUsername(username);
  await checkUserExists(username);

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: {
      username: username,
      passwordHash: hashedPassword,
    },
  });

  return user;
}

export async function loginUser(username: string, password: string) {
  const user = await authenticateUser(username, password);
  const token = generateToken({
    username: user.username,
    isAdmin: user.isAdmin,
  });
  return token;
}

async function authenticateUser(username: string, password: string) {
  validateUsername(username);
  validatePassword(password);

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new UserNotFound();
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new PasswordIncorrect();
  }

  return user;
}

function validateUsername(username: string) {
  const usernameRegex = /^[a-zA-Z][0-9A-Za-z]+$/;
  if (username.length < 4 || username.length > 20) {
    throw new UsernameNotValid(
      "Username must be between 4 and 20 characters long"
    );
  }
  if (!usernameRegex.test(username)) {
    throw new UsernameNotValid(
      "Username must start with a letter and can only contain letters, numbers and underscores"
    );
  }
}

async function checkUserExists(username: string) {
  const userByUsername = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (userByUsername) {
    throw new UserAlreadyExists();
  }
}

function validatePassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]{8,}$/;
  if (password.length < 8) {
    throw new PasswordNotValid("Password must be at least 8 characters long");
  }
  if (!passwordRegex.test(password)) {
    throw new PasswordNotValid(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    );
  }
}
