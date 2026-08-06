import helmet from "helmet";

import { env } from "@/common/config/env.js";

/**
 * Helmet secures Express applications by setting
 * various HTTP security headers.
 *
 * Docs:
 * https://helmetjs.github.io/
 */
export const security = helmet({
  /**
   * Content Security Policy (CSP)
   *
   * OAuth/OIDC servers generally don't serve HTML pages
   * (except consent/login pages which we'll configure later).
   *
   * We'll enable CSP later with proper directives.
   */
  contentSecurityPolicy: false,

  /**
   * Cross-Origin Resource Policy
   *
   * Disable for now.
   * We'll configure it after CORS strategy is finalized.
   */
  crossOriginResourcePolicy: false,

  /**
   * Hide Express technology.
   *
   * Removes:
   * X-Powered-By: Express
   */
  hidePoweredBy: true,

  /**
   * Prevent MIME type sniffing.
   */
  noSniff: true,

  /**
   * Prevent clickjacking.
   */
  frameguard: {
    action: "deny",
  },

  /**
   * Enable HSTS only in production.
   *
   * Forces browsers to always use HTTPS.
   */
  hsts:
    env.NODE_ENV === "production"
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,

  /**
   * Restrict browser features.
   */
  permittedCrossDomainPolicies: false,

  /**
   * Prevent DNS Prefetching.
   */
  dnsPrefetchControl: {
    allow: false,
  },

  /**
   * Prevent old IE from executing downloads.
   */
  ieNoOpen: true,

  /**
   * Restrict referrer information.
   */
  referrerPolicy: {
    policy: "no-referrer",
  },

  /**
   * Disable X-XSS-Protection header.
   *
   * Modern browsers ignore it.
   */
  xssFilter: false,
});
