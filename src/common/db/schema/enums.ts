import { pgEnum } from "drizzle-orm/pg-core";

export const clientTypeEnum = pgEnum("client_type", ["public", "confidential"]);
