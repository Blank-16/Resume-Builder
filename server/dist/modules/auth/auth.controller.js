"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
const auth_service_js_1 = require("./auth.service.js");
const auth_validation_js_1 = require("./auth.validation.js");
const authService = new auth_service_js_1.AuthService();
async function register(req, res) {
    const parsed = auth_validation_js_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    try {
        const payload = await authService.register(parsed.data);
        res
            .status(201)
            .json({ message: "Account created", data: payload });
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}
async function login(req, res) {
    const parsed = auth_validation_js_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    try {
        const payload = await authService.login(parsed.data);
        res.json({ message: "Login successful", data: payload });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
}
async function getMe(req, res) {
    const userId = req.userId;
    const user = await authService.getProfile(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ message: "Profile fetched", data: user });
}
//# sourceMappingURL=auth.controller.js.map