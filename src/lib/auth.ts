import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { sqlite } from "@/lib/db/client";
import { env } from "@/lib/env";

// Better Auth uses the shared better-sqlite3 connection and manages its own
// tables (user/session/account/verification) via `@better-auth/cli migrate`.
export const auth = betterAuth({
  database: sqlite,
  secret: env.auth.secret,
  baseURL: env.auth.url,
  // The product is an offline LAN appliance reached from many devices/IPs, so
  // trust the request's own origin plus any explicitly configured extras. This
  // intentionally relaxes CSRF origin checks for the box; tighten for cloud.
  trustedOrigins: (request) => {
    const origin = request?.headers.get("origin");
    return [...env.auth.extraTrustedOrigins, ...(origin ? [origin] : [])];
  },
  emailAndPassword: {
    enabled: true,
    // Hackathon: no email server in the box, so don't require verification.
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      // Role drives which surface a user sees: admin | profesor | alumno.
      role: {
        type: "string",
        required: false,
        defaultValue: "alumno",
        input: true,
      },
    },
  },
  // Must be last: lets server actions set auth cookies in Next.js.
  plugins: [nextCookies()],
});
