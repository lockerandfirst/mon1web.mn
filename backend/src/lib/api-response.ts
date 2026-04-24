import type { Response } from "express";

import { debug } from "./debug";

/**
 * Backend API-ийн хариу нь бүгд нэг хэвшилтэй:
 *
 * - Амжилттай: `{ success: true, data, meta? }`
 * - Алдаатай:  `{ success: false, error, details? }`
 *
 * Энэ helper-ийг ашиглан route-ууд 500/400 хариуны форматыг давхардуулахгүй,
 * `debug` scope-той нэгдсэн логтой байна.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendOk<T>(
  res: Response,
  data: T,
  extras: { status?: number; meta?: PaginationMeta } = {},
) {
  const status = extras.status ?? 200;
  const body: { success: true; data: T; meta?: PaginationMeta } = {
    success: true,
    data,
  };
  if (extras.meta) {
    body.meta = extras.meta;
  }
  return res.status(status).json(body);
}

export function sendFail(
  res: Response,
  args: {
    scope: string;
    status: number;
    error: string;
    details?: unknown;
    cause?: unknown;
  },
) {
  debug.warn(args.scope, args.error, {
    status: args.status,
    details: args.details,
    cause: args.cause instanceof Error ? args.cause.message : args.cause,
  });
  return res.status(args.status).json({
    success: false,
    error: args.error,
    ...(args.details === undefined ? {} : { details: args.details }),
  });
}

export function paginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / Math.max(1, limit))),
  };
}

/**
 * Zod-ийн safeParse үр дүнг 400-ээр хариулах товч helper.
 */
export function sendZodFail(
  res: Response,
  args: {
    scope: string;
    error: { flatten(): unknown };
    message?: string;
  },
) {
  return sendFail(res, {
    scope: args.scope,
    status: 400,
    error: args.message ?? "Оролт буруу байна.",
    details: args.error.flatten(),
  });
}
