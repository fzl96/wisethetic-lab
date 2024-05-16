/**
 * List of public routes
 * These routes will be accessible to all users
 * @type {string[]}
 */
export const publicRoutes = ["/", "/products", "/auth/new-verification"];

/**
 * List of admin routes
 * These routes will redirect non-admin users to the home page
 * @type {string[]}
 */
export const adminRoutes = ["/dashboard"];

/**
 * List of auth routes
 * These routes will redirect logged in users to the home page
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/reset-password",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const apiUploadthingPrefix = "/api/uploadthing";

export const apiTestPrefix = "/api/test";

export const apiPaymentNotificationPrefix = "/api/payment-notification";
/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
