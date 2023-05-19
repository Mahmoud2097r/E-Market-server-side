"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CartItemSchema = new mongoose_1.Schema({
    image: String,
    name: String,
    price: Number,
    item_id: String
});
const CartItem = (0, mongoose_1.model)('CartItem', CartItemSchema);
exports.default = CartItem;
//# sourceMappingURL=cartItem.js.map