// The single HTTP client for services.  Keeping this re-export avoids a second
// base URL or authentication implementation while preserving utils/api.js.
export { apiFetch, apiUpload, assetUrl, clearAuth } from "../utils/api";
