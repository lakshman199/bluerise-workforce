/**
 * The response envelope every BlueRise endpoint uses.
 *
 * Wrapping even a single resource costs one level of nesting and buys the ability to add
 * `meta` to any response later without breaking existing clients.
 */
export interface ApiResponse<TData> {
  data: TData;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedApiResponse<TItem> {
  data: TItem[];
  meta: PaginationMeta;
}

/**
 * The single error shape emitted by every layer of the API.
 *
 * `message` is always an array so a client can render it without checking its type first.
 */
export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string[];
  requestId: string;
  timestamp: string;
  path: string;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ApiErrorResponse>;
  return (
    typeof candidate.statusCode === 'number' &&
    typeof candidate.error === 'string' &&
    Array.isArray(candidate.message) &&
    typeof candidate.requestId === 'string'
  );
}
