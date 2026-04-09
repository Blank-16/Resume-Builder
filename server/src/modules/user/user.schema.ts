import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import type { User } from "../../types/shared.js";

export interface UserDocument extends Omit<User, "_id">, Document {
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

// Mongoose 9: PreSaveMiddlewareFunction takes (opts: SaveOptions) — no next parameter.
// Use async and return void; Mongoose awaits the returned promise automatically.
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string);
};

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema,
);
