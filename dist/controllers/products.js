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
exports.deleteProduct = exports.editProduct = exports.showProduct = exports.postProduct = exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const middlewares_1 = require("../middlewares");
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find();
        res.send(products);
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default('Something went wrong!', 400));
    }
});
exports.getProducts = getProducts;
const postProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            const files = req.files;
            req.body.images = [];
            for (let file of files) {
                req.body.images.push({
                    filename: file.filename,
                    path: file.path,
                });
            }
        }
        const { user_id, name, price, stock, description, images, } = req.body;
        const filterLettersRegrex = /[A-Za-z.!/@#%&*`~+?^${}()|[\]\\]/g;
        if (price.search(filterLettersRegrex) !== -1 || stock.search(filterLettersRegrex) !== -1) {
            throw new Error('stock/price must be a number');
        }
        if (user_id == null || user_id === '')
            next(new expressError_1.default('You are not authorized!', 403));
        if (name == null ||
            name === '' ||
            price == null ||
            price === '' ||
            description == null ||
            description === '')
            next(new expressError_1.default('Fields are missing', 4000));
        const user = yield user_1.default.findById(user_id);
        const newProduct = yield new product_1.default();
        user.products.push(newProduct);
        yield user.save();
        if (user)
            newProduct.user = user;
        newProduct.name = name;
        newProduct.price = price;
        newProduct.description = description;
        if (images.length > 0)
            newProduct.images = images;
        if (stock)
            newProduct.stock = stock;
        yield newProduct.save();
        res.send(newProduct);
    }
    catch (e) {
        for (let file of req.files) {
            (0, middlewares_1.deleteImage)(file.filename);
        }
        console.log(e.message);
        next(new expressError_1.default(e.message, 400));
    }
});
exports.postProduct = postProduct;
const showProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id).populate({
            path: 'reviews',
            options: { sort: { _id: -1 } },
            populate: {
                path: 'user',
                model: 'User'
            }
        });
        product.avgRating = (0, middlewares_1.calcAvgRating)(product);
        yield (product === null || product === void 0 ? void 0 : product.save());
        res.send(product);
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default('404 - Page Not Found', 404));
    }
});
exports.showProduct = showProduct;
const editProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, name, price, stock, description } = req.body;
        const { product_id } = req.params;
        const filterLettersRegrex = /[A-Za-z.!/@#%&*`~+?^${}()|[\]\\]/g;
        if (price.search(filterLettersRegrex) !== -1 || stock.search(filterLettersRegrex) !== -1) {
            next(new expressError_1.default('stock/price must be a number', 404));
        }
        const product = yield product_1.default.findById(product_id);
        if (req.files) {
            const files = req.files;
            req.body.images = [];
            for (let file of files) {
                req.body.images.push({
                    filename: file.filename,
                    path: file.path,
                });
            }
            for (let image of product === null || product === void 0 ? void 0 : product.images) {
                (0, middlewares_1.deleteImage)(image.filename);
            }
        }
        (0, middlewares_1.isUserAuthorized)(user_id, product === null || product === void 0 ? void 0 : product.user._id, next);
        if (name)
            product.name = name;
        if (price)
            product.price = price;
        if (stock)
            product.stock = stock;
        if (description)
            product.description = description;
        if (req.body.images && req.body.images.length > 0)
            product.images = req.body.images;
        yield (product === null || product === void 0 ? void 0 : product.save());
        res.send(product);
    }
    catch (e) {
        console.log(e.message);
        for (let image of req.body.images) {
            (0, middlewares_1.deleteImage)(image.filename);
        }
        next(new expressError_1.default(e.message, 400));
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.body;
        if (id == null ||
            id === '' ||
            userId == null ||
            userId === '')
            next(new expressError_1.default('cannot find product', 404));
        const product = yield product_1.default.findById(id);
        const productOwner = yield user_1.default.findById(product === null || product === void 0 ? void 0 : product.user._id);
        (0, middlewares_1.isUserAuthorized)(userId, product === null || product === void 0 ? void 0 : product.user._id, next);
        for (let image of product === null || product === void 0 ? void 0 : product.images) {
            yield (0, middlewares_1.deleteImage)(image.filename);
        }
        yield (product === null || product === void 0 ? void 0 : product.deleteOne());
        const products = yield product_1.default.find({
            user: productOwner,
        });
        productOwner.products = products;
        yield (productOwner === null || productOwner === void 0 ? void 0 : productOwner.save());
        res.status(200).send();
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default('Something went wrong!', 400));
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products.js.map