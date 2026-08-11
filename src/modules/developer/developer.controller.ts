import type { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/response.js";
import { developerService } from "./developer.composition.js";

interface DeveloperParams {
  id: string;
}

export class DeveloperController {
  /**
   * Registers a new developer.
   *
   * Business logic is delegated to DeveloperService.
   * The controller is responsible only for HTTP concerns.
   */
  static async register(req: Request, res: Response) {
    const developer = await developerService.registerDeveloper(req.body);

    return ApiResponse.created(res, { ...developer });
  }

  /**
   * Retrieves a developer by ID.
   */
  static async getById(req: Request<DeveloperParams>, res: Response) {
    const developer = await developerService.getDeveloperById(req.params.id);

    return ApiResponse.ok(res, { ...developer });
  }

  /**
   * Retrieves a developer by email.
   *
   * This endpoint should be protected or restricted
   * depending on the final API design.
   */
  static async getByEmail(req: Request, res: Response) {
    const developer = await developerService.getDeveloperByEmail(req.query.email as string);

    return ApiResponse.ok(res, { ...developer });
  }
}
