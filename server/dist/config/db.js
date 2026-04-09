"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
async function connectDB() {
    try {
        const conn = await mongoose_1.default.connect(env_js_1.env.mongodbUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map