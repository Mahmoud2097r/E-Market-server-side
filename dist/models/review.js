"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});
const Review = (0, mongoose_1.model)('Review', ReviewSchema);
exports.default = Review;
//# sourceMappingURL=review.js.map