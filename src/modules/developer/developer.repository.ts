import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import { developers } from "@/common/db/schema/developer.js";

export class DeveloperRepository {
  constructor(private readonly db: NeonHttpDatabase) {}

  async create(data: typeof developers.$inferInsert) {
    const [developer] = await this.db.insert(developers).values(data).returning({developerId: developers.id, email: developers.email, isActive: developers.isActive, emailVerifiedAt: developers.emailVerifiedAt});

    return developer;
  }

  async findById(id: string) {
    const [developer] = await this.db
      .select({developerId: developers.id, email: developers.email, isActive: developers.isActive, emailVerifiedAt: developers.emailVerifiedAt})
      .from(developers)
      .where(eq(developers.id, id))
      .limit(1);

    return developer ?? null;
  }

  async findByEmail(email: string) {
    const [developer] = await this.db
      .select()
      .from(developers)
      .where(eq(developers.email, email))
      .limit(1);

    return developer ?? null;
  }

  async existsByEmail(email: string) {
    const [developer] = await this.db
      .select({ id: developers.id })
      .from(developers)
      .where(eq(developers.email, email))
      .limit(1);

    return developer !== undefined;
  }
}
