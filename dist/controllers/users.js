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
exports.getProfileOwner = exports.deleteUser = exports.getUsersProducts = exports.update = exports.logout = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const middlewares_1 = require("../middlewares");
const bcrypt_1 = __importDefault(require("bcrypt"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username, email, password } = req.body;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            next(new expressError_1.default('Invalid username', 404));
        }
        if (!emailRegex.test(email)) {
            next(new expressError_1.default('Invalid email', 404));
        }
        if (username == null ||
            username === '' ||
            email == null ||
            email === '' ||
            password == null ||
            password === '') {
            next(new expressError_1.default('Please fill all required fields', 404));
        }
        if (req.file) {
            const { filename, path } = req.file;
            req.body.image = { filename, path };
        }
        const user = yield new user_1.default({
            email,
            username,
            password: yield (0, middlewares_1.genPassword)(password),
            image: req.body.image,
        });
        yield user.save();
        res.status(200).send({
            user: {
                username: user.username,
                email: user.email,
                _id: user._id,
                image: (_a = user.image) === null || _a === void 0 ? void 0 : _a.path,
            }
        });
    }
    catch (e) {
        (0, middlewares_1.deleteImage)((_b = req.body.image) === null || _b === void 0 ? void 0 : _b.filename);
        if (e.message.includes('duplicate'))
            e.message = 'This email/username already Registered';
        next(new expressError_1.default(e.message, 400));
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { username, password } = req.body;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            next(new expressError_1.default('Invalid username', 404));
        }
        if (username == null ||
            username === '' ||
            password == null ||
            password === '')
            next(new expressError_1.default('Please fill all required fields', 400));
        const user = yield user_1.default.find({ username }).populate({
            path: 'products',
        });
        if (user == null)
            throw new Error();
        if (!bcrypt_1.default.compareSync(password, user[0].password.hash))
            throw new Error();
        res.send({
            user: {
                username: user[0].username,
                email: user[0].email,
                _id: user[0]._id,
                image: (_c = user[0].image) === null || _c === void 0 ? void 0 : _c.path,
            },
        });
    }
    catch (e) {
        next(new expressError_1.default('incorrect username or password', 400));
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const idRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (id.search(idRegrex) !== -1) {
            next(new expressError_1.default('Invalid credentials', 404));
        }
        if (id == null || id === '')
            next(new expressError_1.default('Something went wrong!', 400));
        res.status(200).send('logged out successfully');
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 400));
    }
});
exports.logout = logout;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const { user_id } = req.params;
        const user = yield user_1.default.findById(user_id);
        if (req.file) {
            const { filename, path } = req.file;
            req.body.image = { filename, path };
        }
        const { username, email, currentPassword, newPassword, confirmNewPassword, image, } = req.body;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            next(new expressError_1.default('Invalid username', 404));
        }
        if (!emailRegex.test(email)) {
            next(new expressError_1.default('Invalid email', 404));
        }
        if (currentPassword == null || currentPassword === '') {
            yield (0, middlewares_1.deleteImage)(image.filename);
            next(new expressError_1.default('Invalid credentials ', 404));
        }
        if (!bcrypt_1.default.compareSync(currentPassword, (_d = user.password.hash) !== null && _d !== void 0 ? _d : '')) {
            yield (0, middlewares_1.deleteImage)(image.filename);
            next(new expressError_1.default('Invalid credentials ', 404));
        }
        if (newPassword != null ||
            newPassword !== '' ||
            confirmNewPassword != null ||
            confirmNewPassword !== '') {
            if (newPassword !== confirmNewPassword) {
                yield (0, middlewares_1.deleteImage)(image.filename);
                next(new expressError_1.default('Passwords did not matched', 401));
            }
        }
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (newPassword)
            user.password = yield (0, middlewares_1.genPassword)(newPassword);
        if (image) {
            if ((_e = user === null || user === void 0 ? void 0 : user.image) === null || _e === void 0 ? void 0 : _e.filename)
                yield (0, middlewares_1.deleteImage)(user.image.filename);
            user.image = image;
        }
        yield user.save();
        res.send({
            user: {
                username: user.username,
                email: user.email,
                _id: user._id,
                image: user.image.path,
            },
        });
    }
    catch (e) {
        if (e.message.includes('duplicate'))
            e.message = 'This email/username already Registered';
        next(new expressError_1.default(e.message, 400));
    }
});
exports.update = update;
const getUsersProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const user = yield user_1.default.findById(user_id).populate({
            path: 'products',
        });
        res.send(user === null || user === void 0 ? void 0 : user.products);
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default('Something went wrong!', 400));
    }
});
exports.getUsersProducts = getUsersProducts;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { password } = req.body;
        const { user_id } = req.params;
        if (user_id == null ||
            user_id === '' ||
            password == null ||
            password === '')
            next(new expressError_1.default('please fill all fields', 403));
        const user = yield user_1.default.findById(user_id);
        if (!bcrypt_1.default.compareSync(password, user.password.hash))
            next(new expressError_1.default('Something went wrong try again!', 403));
        (0, middlewares_1.deleteImage)((_f = user === null || user === void 0 ? void 0 : user.image) === null || _f === void 0 ? void 0 : _f.filename);
        yield (user === null || user === void 0 ? void 0 : user.deleteOne());
        res.status(200).send();
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.deleteUser = deleteUser;
const getProfileOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id } = req.body;
        const profile_idRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (profile_id.search(profile_idRegrex) !== -1) {
            next(new expressError_1.default('Invalid credentials', 404));
        }
        const profileOwner = yield user_1.default.findById(profile_id);
        res.status(200).send(profileOwner);
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.getProfileOwner = getProfileOwner;
//# sourceMappingURL=users.js.map