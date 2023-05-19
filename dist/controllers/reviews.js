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
exports.deleteReview = exports.patchReview = exports.postReview = void 0;
const product_1 = __importDefault(require("../models/product"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const user_1 = __importDefault(require("../models/user"));
const review_1 = __importDefault(require("../models/review"));
const postReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id).populate('reviews').exec();
        const { body, rating } = req.body.review;
        const user = yield user_1.default.findById(req.body.user_id);
        const haveReviewed = (_a = product === null || product === void 0 ? void 0 : product.reviews) === null || _a === void 0 ? void 0 : _a.filter((review) => {
            return user === null || user === void 0 ? void 0 : user.equals(review.user);
        }).length;
        if (haveReviewed > 0)
            throw new Error('You can\'t add more than one review');
        if (body === '' &&
            rating === '' &&
            body == null &&
            rating == null)
            next(new expressError_1.default('You must provide at least a rating or a comment', 404));
        const review = yield new review_1.default();
        if (rating)
            review.rating = Number(rating);
        if (body)
            review.body = body;
        if (user)
            review.user = user;
        if (product)
            review.product = product;
        yield review.save();
        (_b = product === null || product === void 0 ? void 0 : product.reviews) === null || _b === void 0 ? void 0 : _b.push(review);
        (_c = user === null || user === void 0 ? void 0 : user.reviews) === null || _c === void 0 ? void 0 : _c.push(review);
        yield (product === null || product === void 0 ? void 0 : product.save());
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).send();
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.postReview = postReview;
const patchReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { review_id } = req.params;
        const { user_id, review } = req.body;
        const { body, rating } = review;
        const user = yield user_1.default.findById(user_id);
        const updatedReview = yield review_1.default.findById(review_id).populate('user').exec();
        if (!(user === null || user === void 0 ? void 0 : user.equals(updatedReview === null || updatedReview === void 0 ? void 0 : updatedReview.user)))
            throw new Error('Not Authorized');
        if (body)
            updatedReview.body = body;
        if (rating)
            updatedReview.rating = Number(rating);
        yield (updatedReview === null || updatedReview === void 0 ? void 0 : updatedReview.save());
        res.status(200).send();
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.patchReview = patchReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { review_id, product_id } = req.params;
        const { user_id } = req.body;
        const user = yield user_1.default.findById(user_id);
        const review = yield review_1.default.findById(review_id).populate('user').exec();
        const product = yield product_1.default.findById(product_id);
        if (!(user === null || user === void 0 ? void 0 : user.equals(review === null || review === void 0 ? void 0 : review.user)))
            throw new Error('Not Authorized');
        yield (review === null || review === void 0 ? void 0 : review.deleteOne());
        const productsReviews = yield review_1.default.find({ product: product });
        const usersReviews = yield review_1.default.find({ user: user });
        product.reviews = productsReviews;
        user.reviews = usersReviews;
        yield (product === null || product === void 0 ? void 0 : product.save());
        yield user.save();
        res.status(200).send();
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.deleteReview = deleteReview;
//# sourceMappingURL=reviews.js.map