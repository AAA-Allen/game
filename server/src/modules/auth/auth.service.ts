import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../../config/env";
import { users } from "../../data/mock-db";
import { AppError } from "../../utils/app-error";

const authSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export function register(input: unknown) {
  const payload = authSchema.parse(input);
  const exists = users.find((user) => user.username === payload.username);

  if (exists) {
    throw new AppError("Username already exists", 409);
  }

  const user = {
    id: `user-${users.length + 1}`.padStart(8, "0"),
    username: payload.username,
    password: payload.password,
    level: 1,
    xp: 0,
  };

  users.push(user);

  return {
    user: {
      id: user.id,
      username: user.username,
      level: user.level,
      xp: user.xp,
    },
  };
}

export function login(input: unknown) {
  const payload = authSchema.parse(input);
  const user = users.find(
    (item) =>
      item.username === payload.username && item.password === payload.password,
  );

  if (!user) {
    throw new AppError("Username or password is incorrect", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      level: user.level,
      xp: user.xp,
    },
  };
}
