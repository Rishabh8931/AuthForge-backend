import { pgEnum } from "drizzle-orm/pg-core";

export const clientTypeEnum = pgEnum("client_type", ["public", "confidential"]);

export const clientGrantTypeEnum = pgEnum("client_grant_type", [
  "authorization_code",
  "refresh_token",
]);
