import { eq } from "drizzle-orm";
import { db } from "@/common/db/index.js";
import { developers, type Developer, type NewDeveloper } from "@/common/db/schema/index.js";

export class DeveloperRepository {
  async findById(id: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.id, id)).limit(1);

    return developer;
  }

  async findByEmail(email: string): Promise<Developer | undefined> {
    const [developer] = await db.select({developerId : developers.id}).from(developers).where(eq(developers.email, email)).limit(1);

    return developer;
  }

  async create(data: NewDeveloper): Promise<Developer> {
    const [newDeveloper] = await db.insert(developers).values(data).returning();

    return newDeveloper;
  }

  async update(id: string, data: Partial<NewDeveloper>): Promise<Developer | undefined> {
    const [updatedDeveloper] = await db
      .update(developers)
      .set(data)
      .where(eq(developers.id, id))
      .returning();

    return updatedDeveloper;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(developers)
      .where(eq(developers.id, id))
      .returning({ id: developers.id });

    return result.length > 0;
  }
}

export const developerRepository = new DeveloperRepository();
