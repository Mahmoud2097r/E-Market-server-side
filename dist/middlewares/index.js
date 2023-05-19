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
exports.calcAvgRating = exports.isUserAuthorized = exports.deleteImage = exports.genPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const cloudinary_1 = __importDefault(require("../cloudinary"));
const expressError_1 = __importDefault(require("./expressError"));
const genPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(password, salt);
    return { salt, hash };
});
exports.genPassword = genPassword;
const deleteImage = (filename) => {
    cloudinary_1.default.uploader.destroy(filename);
};
exports.deleteImage = deleteImage;
const isUserAuthorized = (user_id, productOwnerId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = yield user_1.default.findById(user_id);
    const productOwner = yield user_1.default.findById(productOwnerId);
    if (!(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.equals(productOwner)))
        return next(new expressError_1.default('YOU ARE NOT AUTHORIZED TO DO THIS ACTION!', 403));
});
exports.isUserAuthorized = isUserAuthorized;
const calcAvgRating = (product) => {
    let ratingsTotal = 0;
    let avgRating = 0;
    if (product.reviews.length) {
        product.reviews.forEach((review) => {
            ratingsTotal += review.rating;
        });
        avgRating = Math.round((ratingsTotal / product.reviews.length));
    }
    else {
        avgRating = ratingsTotal;
    }
    return avgRating;
};
exports.calcAvgRating = calcAvgRating;
//# sourceMappingURL=index.js.map