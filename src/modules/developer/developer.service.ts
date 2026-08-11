import type { DeveloperRepository } from "./developer.repository.js";
import { ApiError, ErrorCode } from "@/common/errors/index.js";
import { hashPassword, verifyPassword } from "@/common/crypto/index.js";
import { type CreateDeveloperInput } from "./developer.dto.js";

export class DeveloperService {
  constructor(private readonly developerRepository: DeveloperRepository) {}

  /**
   * Registers a new developer.
   * The service owns the business rule that an email
   * must be unique. The repository only handles persistence.
   */
  async registerDeveloper(data: CreateDeveloperInput) {
    // Check the business constraint before creating the record.
    const alreadyExists = await this.developerRepository.existsByEmail(data.email);

    if (alreadyExists) {
      throw ApiError.conflict(
        "Developer with this email already exists",
        ErrorCode.CLIENT_ALREADY_EXISTS,
      );
    }

    const { password, ...rest } = data;

    // hash the password before storing it in the database
    const passwordHash = await hashPassword(password);

    //
    // Repository is responsible only for persisting the developer.
    return this.developerRepository.create({ ...rest, passwordHash });
  }

  /**
   * Retrieves a developer by their ID.
   */
  async getDeveloperById(id: string) {
    const developer = await this.developerRepository.findById(id);

    if (!developer) {
      throw ApiError.notFound("Developer not found", ErrorCode.CLIENT_NOT_FOUND);
    }

    return developer;
  }

  /**
   * Retrieves a developer by email.
   *
   * This method can later be used by authentication
   * workflows such as developer sign-in.
   */
  async getDeveloperByEmail(email: string) {
    return this.developerRepository.findByEmail(email);
  }
}
