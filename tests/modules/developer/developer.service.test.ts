    import { describe, expect, it, vi, beforeEach } from "vitest";

import { DeveloperService } from "@/modules/developer/developer.service.js";
import { ApiError } from "@/common/errors/index.js";

describe("DeveloperService", () => {
  const developerRepository = {
    existsByEmail: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
  };

  let service: DeveloperService;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new DeveloperService(
      developerRepository as any,
    );
  });

  describe("registerDeveloper()", () => {
    it("should create a developer when email does not already exist", async () => {
      developerRepository.existsByEmail.mockResolvedValue(false);

      developerRepository.create.mockResolvedValue({
        id: "developer-id",
        email: "dev@example.com",
      });

      const result = await service.registerDeveloper({
        email: "dev@example.com",
        password: "StrongPassword123!",
      });

      expect(
        developerRepository.existsByEmail,
      ).toHaveBeenCalledWith("dev@example.com");

      expect(
        developerRepository.create,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        id: "developer-id",
        email: "dev@example.com",
      });
    });

    it("should reject registration when email already exists", async () => {
      developerRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        service.registerDeveloper({
          email: "dev@example.com",
          password: "StrongPassword123!",
        }),
      ).rejects.toBeInstanceOf(ApiError);

      expect(
        developerRepository.create,
      ).not.toHaveBeenCalled();
    });
  });

  describe("getDeveloperById()", () => {
    it("should return the developer when found", async () => {
      const developer = {
        id: "developer-id",
        email: "dev@example.com",
      };

      developerRepository.findById.mockResolvedValue(
        developer,
      );

      const result =
        await service.getDeveloperById("developer-id");

      expect(
        developerRepository.findById,
      ).toHaveBeenCalledWith("developer-id");

      expect(result).toEqual(developer);
    });

    it("should throw when developer does not exist", async () => {
      developerRepository.findById.mockResolvedValue(
        undefined,
      );

      await expect(
        service.getDeveloperById("unknown-id"),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe("getDeveloperByEmail()", () => {
    it("should return the developer by email", async () => {
      const developer = {
        id: "developer-id",
        email: "dev@example.com",
      };

      developerRepository.findByEmail.mockResolvedValue(
        developer,
      );

      const result =
        await service.getDeveloperByEmail(
          "dev@example.com",
        );

      expect(
        developerRepository.findByEmail,
      ).toHaveBeenCalledWith("dev@example.com");

      expect(result).toEqual(developer);
    });
  });
});