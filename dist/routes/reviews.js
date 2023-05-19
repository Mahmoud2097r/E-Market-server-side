"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const reviews_1 = require("../controllers/reviews");
const reviewsRouter = (0, express_1.Router)({ mergeParams: true });
reviewsRouter.post('/', (0, express_async_handler_1.default)(reviews_1.postReview));
reviewsRouter.route('/:review_id')
    .patch((0, express_async_handler_1.default)(reviews_1.patchReview))
    .delete((0, express_async_handler_1.default)(reviews_1.deleteReview));
exports.default = reviewsRouter;
//# sourceMappingURL=reviews.js.map