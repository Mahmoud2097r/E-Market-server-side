"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShoppingCart = exports.postShoppingCart = void 0;
const shoppingCart_1 = __importDefault(require("../models/shoppingCart"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const product_1 = __importDefault(require("../models/product"));
const cartItem_1 = __importDefault(require("../models/cartItem"));
const postShoppingCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id, shoppingCart_id } = req.body;
        if (product_id == null || product_id === '')
            throw new Error();
        const product = yield product_1.default.findById(product_id);
        const newCartItem = yield new cartItem_1.default();
        newCartItem.item_id = product._id;
        newCartItem.name = product.name;
        newCartItem.price = Number(product.price);
        newCartItem.image = product.images[0].path;
        yield newCartItem.save();
        if (shoppingCart_id === '' || shoppingCart_id == null) {
            const shoppingCart = yield new shoppingCart_1.default().populate({
                path: 'products',
            });
            shoppingCart.cartItems.push(newCartItem);
            shoppingCart.total += newCartItem.price;
            yield (shoppingCart === null || shoppingCart === void 0 ? void 0 : shoppingCart.save());
            res.status(200).send(shoppingCart);
            return;
        }
        const shoppingCart = yield shoppingCart_1.default.findById(shoppingCart_id).populate({
            path: 'cartItems',
        });
        shoppingCart.cartItems.push(newCartItem);
        shoppingCart.total += newCartItem.price;
        yield (shoppingCart === null || shoppingCart === void 0 ? void 0 : shoppingCart.save());
        res.status(200).send(shoppingCart);
    }
    catch (e) {
        if (e.statusCode === 400)
            next(new expressError_1.default('404 Page Not Found', 404));
        next(new expressError_1.default('Sorry, Something went wrong try again later!', 404));
    }
});
exports.postShoppingCart = postShoppingCart;
const updateShoppingCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = req.body;
        const { shoppingCart_id } = req.params;
        if (item_id == null || item_id === '')
            throw new Error();
        const cartItem = yield cartItem_1.default.findById(item_id);
        const shoppingCart = yield shoppingCart_1.default.findById(shoppingCart_id).populate({
            path: 'cartItems',
        });
        shoppingCart.cartItems = shoppingCart.cartItems.filter((item) => {
            return !(cartItem === null || cartItem === void 0 ? void 0 : cartItem.equals(item)) && item;
        });
        yield (cartItem === null || cartItem === void 0 ? void 0 : cartItem.deleteOne());
        shoppingCart.total -= cartItem.price;
        yield (shoppingCart === null || shoppingCart === void 0 ? void 0 : shoppingCart.save());
        res.status(200).send(shoppingCart);
    }
    catch (e) {
        if (e.statusCode === 400)
            next(new expressError_1.default('404 Page Not Found', 404));
        next(new expressError_1.default('Sorry, Something went wrong try again later!', 404));
    }
});
exports.updateShoppingCart = updateShoppingCart;
//# sourceMappingURL=shoppingCarts.js.map