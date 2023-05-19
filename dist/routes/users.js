"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_1 = require("express");
const cloudinary_1 = require("../cloudinary/");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const usersRouter = (0, express_1.Router)();
usersRouter.post('/signup', upload.single('file'), (0, express_async_handler_1.default)(users_1.signup));
usersRouter.post('/login', (0, express_async_handler_1.default)(users_1.login));
usersRouter.post('/logout', (0, express_async_handler_1.default)(users_1.logout));
usersRouter
    .route('/:user_id/')
    .put(upload.single('file'), (0, express_async_handler_1.default)(users_1.update))
    .delete((0, express_async_handler_1.default)(users_1.deleteUser));
usersRouter.get('/:user_id/user_products', (0, express_async_handler_1.default)(users_1.getUsersProducts));
usersRouter.post('/getProfileOwner', (0, express_async_handler_1.default)(users_1.getProfileOwner));
exports.default = usersRouter;
//# sourceMappingURL=users.js.map