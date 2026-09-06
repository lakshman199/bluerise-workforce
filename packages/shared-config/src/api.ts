export const API_GLOBAL_PREFIX = 'api';

export const API_VERSION = '1';

/** `/api/v1` — the single place this string is assembled. */
export const API_BASE_PATH = `/${API_GLOBAL_PREFIX}/v${API_VERSION}`;

export const OPENAPI_PATH = `${API_GLOBAL_PREFIX}/docs`;

export const REQUEST_ID_HEADER = 'x-request-id';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

/** Requests larger than this are rejected before a body parser allocates for them. */
export const MAX_REQUEST_BODY_BYTES = 1_048_576;
