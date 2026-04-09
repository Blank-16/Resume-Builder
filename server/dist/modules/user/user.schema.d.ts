import { Document, Model } from "mongoose";
import type { User } from "../../types/shared.js";
export interface UserDocument extends Omit<User, "_id">, Document {
    password: string;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const UserModel: Model<UserDocument>;
//# sourceMappingURL=user.schema.d.ts.map