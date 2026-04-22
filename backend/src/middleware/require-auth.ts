import { verifyToken } from "@clerk/backend";
import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env";

export type AuthContext = {
  clerkUserId: string;
  email: string | null;
  fullName: string | null;
};

function readBearerToken(req: Request) {
  const value = req.headers.authorization;
  if (!value?.startsWith("Bearer ")) {
    return null;
  }
  return value.slice("Bearer ".length).trim();
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = readBearerToken(req);
  console.log("[requireAuth] incoming", {
    path: req.originalUrl,
    hasAuthHeader: Boolean(req.headers.authorization),
    hasBearerToken: Boolean(token),
  });
  if (!token) {
    console.log("[requireAuth] rejected: missing bearer token");
    return res.status(401).json({
      success: false,
      error: "Нэвтрээгүй хэрэглэгч байна.",
    });
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    const clerkUserId = payload.sub;
    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        error: "Хэрэглэгчийн мэдээлэл дутуу байна.",
      });
    }

    const auth: AuthContext = {
      clerkUserId,
      email:
        typeof payload.email === "string"
          ? payload.email
          : payload.email === null
            ? null
            : null,
      fullName:
        typeof payload.name === "string"
          ? payload.name
          : payload.name === null
            ? null
            : null,
    };

    res.locals.auth = auth;
    console.log("[requireAuth] success", {
      path: req.originalUrl,
      clerkUserId: auth.clerkUserId,
      email: auth.email,
    });
    return next();
  } catch (error) {
    console.log("[requireAuth] rejected: invalid token", {
      path: req.originalUrl,
      error: error instanceof Error ? error.message : "unknown",
    });
    return res.status(401).json({
      success: false,
      error: "Токен хүчингүй байна.",
    });
  }
}
