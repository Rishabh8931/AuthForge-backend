import type { DeveloperRepository } from "@/modules/developer/developer.repository.js";
import { ApiError, ErrorCode } from "@/common/errors/index.js";
import { verifyPassword } from "@/common/crypto/index.js";

export class AuthService {
  constructor(private readonly developerRepository: DeveloperRepository) {}

  /**
   * Authenticates a developer using their email and password.
   *
   * The service is responsible for the authentication workflow:
   * 1. Find the developer by email.
   * 2. Verify the supplied password against the stored password hash.
   *
   * Session creation will be added once the session layer is implemented.
   */
  async signIn(email: string, password: string) {
    const developer = await this.developerRepository.findByEmail(email);

    // Do not reveal whether the email exists.
    // This prevents user/account enumeration.
    if (!developer) {
      throw ApiError.unauthorized("Invalid email or password.", ErrorCode.UNAUTHORIZED);
    }

    const passwordValid = await verifyPassword(password, developer.passwordHash);

    if (!passwordValid) {
      throw ApiError.unauthorized("Invalid email or password.", ErrorCode.UNAUTHORIZED);
    }

    /*
     * Session creation will be handled here after
     * SessionService is implemented.
     *
     * Example future flow:
     *
     * return this.sessionService.createSession(developer.id);
     */

    return developer;
  }
}
