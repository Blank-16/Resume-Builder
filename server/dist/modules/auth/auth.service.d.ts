import type { RegisterInput, LoginInput } from "./auth.validation.js";
import type { User, AuthPayload } from "../../types/shared.js";
export declare class AuthService {
    register(input: RegisterInput): Promise<AuthPayload>;
    login(input: LoginInput): Promise<AuthPayload>;
    getProfile(userId: string): Promise<User | null>;
}
//# sourceMappingURL=auth.service.d.ts.map