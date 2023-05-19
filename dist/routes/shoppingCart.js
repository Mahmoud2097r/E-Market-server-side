"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const shoppingCarts_1 = require("../controllers/shoppingCarts");
const shoppingCartRouter = (0, express_1.Router)();
shoppingCartRouter.post('/', (0, express_async_handler_1.default)(shoppingCarts_1.postShoppingCart));
shoppingCartRouter.patch('/:shoppingCart_id', (0, express_async_handler_1.default)(shoppingCarts_1.updateShoppingCart));
exports.default = shoppingCartRouter;
//# sourceMappingURL=shoppingCart.js.map