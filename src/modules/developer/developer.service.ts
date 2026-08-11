import type { DeveloperRepository } from "./developer.repository.js";


export class DeveloperService {
  constructor(
    private readonly developerRepository: DeveloperRepository,
  ) {}

  /**
   * Registers a new developer.
   * The service owns the business rule that an email
   * must be unique. The repository only handles persistence.
   */
  async registerDeveloper(data: {
    email: string;
    passwordHash: string;
    name?: string;
  }) {
    // Check the business constraint before creating the record.
    const alreadyExists =
      await this.developerRepository.existsByEmail(data.email);

    if (alreadyExists) {
      throw new Error("Developer with this email already exists");
    }

    // Repository is responsible only for persisting the developer.
    return this.developerRepository.create(data);
  }

  /**
   * Retrieves a developer by their ID.
   */
  async getDeveloperById(id: string) {
    const developer =
      await this.developerRepository.findById(id);

    if (!developer) {
      throw new Error("Developer not found");
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