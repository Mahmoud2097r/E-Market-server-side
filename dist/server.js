"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== 'production')
    (0, dotenv_1.config)();
const { PORT } = process.env;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const shoppingCart_1 = __importDefault(require("./routes/shoppingCart"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: '*' }));
app.use((0, express_mongo_sanitize_1.default)({
    replaceWith: '_',
}));
app.use('/users/api', users_1.default);
app.use('/products', products_1.default);
app.use('/shopping-cart', shoppingCart_1.default);
app.use('/products/:product_id/reviews', reviews_1.default);
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = 'Something Went Wrong!';
    res.status(statusCode).send({
        err,
        title: `Error: ${statusCode}`,
    });
});
app.listen(PORT);
// app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
//# sourceMappingURL=server.js.map