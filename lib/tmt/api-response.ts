import { NextResponse } from "next/server";

export type ErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_VERIFICATION"
  | "VERIFICATION_MISMATCH"
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

interface SuccessResponse<T = unknown> {
  data: T;
  message: string;
}

interface ErrorResponse {
  error_code: ErrorCode;
  message: string;
}

export function successResponse<T>(
  data: T,
  message: string,
  status = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ data, message }, { status });
}

export function errorResponse(
  errorCode: ErrorCode,
  message: string,
  status: number
): NextResponse<ErrorResponse> {
  return NextResponse.json({ error_code: errorCode, message }, { status });
}

export const ApiErrors = {
  missingField: (field: string) =>
    errorResponse("MISSING_REQUIRED_FIELD", `${field} is required`, 400),
  missingFields: (fields: string[]) =>
    errorResponse(
      "MISSING_REQUIRED_FIELD",
      `${fields.join(" and ")} are required`,
      400
    ),
  invalidVerification: () =>
    errorResponse(
      "INVALID_VERIFICATION",
      "Invalid or missing verification. Please reload the page.",
      403
    ),
  verificationMismatch: () =>
    errorResponse(
      "VERIFICATION_MISMATCH",
      "Invalid verification. Please reload the page.",
      403
    ),
  notFound: (resource: string) =>
    errorResponse("NOT_FOUND", `${resource} not found`, 404),
  upstreamError: (message: string, status: number) =>
    errorResponse("UPSTREAM_ERROR", message, status),
  internalError: (message: string) =>
    errorResponse("INTERNAL_ERROR", message, 500),
};
