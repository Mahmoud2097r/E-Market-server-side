import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') config();
const { PORT } = process.env;

import express, {
	Response,
	Request,
	NextFunction,
} from 'express';
import { connectDB } from './db';
import cors from 'cors';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import reviewsRouter from './routes/reviews';
import shoppingCartRouter from './routes/shoppingCart';
import mongoSanitize from 'express-mongo-sanitize';

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use(
	mongoSanitize({
		replaceWith: '_',
	}),
);

app.use('/users/api', usersRouter);
app.use('/products', productsRouter);
app.use('/shopping-cart', shoppingCartRouter);
app.use('/products/:product_id/reviews', reviewsRouter);

app.use(
	(
		err: any,
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const { statusCode = 500 } = err;
		if (!err.message) err.message = 'Something Went Wrong!';
		res.status(statusCode).send({
			err,
			title: `Error: ${statusCode}`,
		});
	},
);

app.listen(PORT);
// app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
