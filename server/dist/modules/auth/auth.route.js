"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/register", auth_controller_js_1.register);
router.post("/login", auth_controller_js_1.login);
router.get("/me", authenticate_js_1.authenticate, auth_controller_js_1.getMe);
//# sourceMappingURL=auth.route.js.map