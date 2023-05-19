"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const products_1 = require("../controllers/products");
const cloudinary_1 = require("../cloudinary/");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const productsRouter = (0, express_1.Router)();
productsRouter
    .route('/')
    .get((0, express_async_handler_1.default)(products_1.getProducts))
    .post(upload.array('files'), (0, express_async_handler_1.default)(products_1.postProduct));
productsRouter
    .route('/:product_id')
    .get((0, express_async_handler_1.default)(products_1.showProduct))
    .put(upload.array('files'), (0, express_async_handler_1.default)(products_1.editProduct))
    .delete((0, express_async_handler_1.default)(products_1.deleteProduct));
exports.default = productsRouter;
//# sourceMappingURL=products.js.map