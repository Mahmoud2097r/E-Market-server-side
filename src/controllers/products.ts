import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import User from '../models/user';
import ExpressError from '../middlewares/expressError';
import {
	deleteImage,
	isUserAuthorized,
	calcAvgRating,
} from '../middlewares';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find();

		res.send(products);
	} catch (e: any) {
		next(new ExpressError('Something went wrong!', 400));
	}
};

interface IFile {
	filename: string;
	path: string;
}

export const postProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.files) {
			const files = req.files as IFile[];
			req.body.images = [];
			for (let file of files) {
				req.body.images.push({
					filename: file.filename,
					path: file.path,
				});
			}
		}
		const {
			user_id,
			name,
			price,
			stock,
			description,
			images,
		} = req.body;

		const filterLettersRegrex =
			/[A-Za-z.!/@#%&*`~+?^${}()|[\]\\]/g;

		if (
			price.search(filterLettersRegrex) !== -1 ||
			stock.search(filterLettersRegrex) !== -1
		) {
			throw new Error('stock/price must be a number');
		}

		if (user_id == null || user_id === '')
			next(
				new ExpressError('You are not authorized!', 403),
			);
		if (
			name == null ||
			name === '' ||
			price == null ||
			price === '' ||
			description == null ||
			description === ''
		)
			next(new ExpressError('Fields are missing', 4000));

		const user = await User.findById(user_id);
		const newProduct = await new Product();

		user!.products!.push(newProduct);

		await user!.save();

		if (user) newProduct.user = user;
		newProduct.name = name;
		newProduct.price = price;
		newProduct.description = description;
		if (images.length > 0) newProduct.images = images;
		if (stock) newProduct.stock = stock;

		await newProduct.save();

		res.send(newProduct);
	} catch (e: any) {
		for (let file of req.files as IFile[]) {
			deleteImage(file.filename);
		}
		next(new ExpressError(e.message, 400));
	}
};

export const showProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(
			product_id,
		).populate({
			path: 'reviews',
			options: { sort: { _id: -1 } },
			populate: {
				path: 'user',
				model: 'User',
			},
		});
		product!.avgRating = calcAvgRating(product!);

		await product?.save();
		res.send(product);
	} catch (e: any) {
		next(new ExpressError('404 - Page Not Found', 404));
	}
};

export const editProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id, name, price, stock, description } =
			req.body;
		const { product_id } = req.params;

		const filterLettersRegrex =
			/[A-Za-z.!/@#%&*`~+?^${}()|[\]\\]/g;

		if (
			price.search(filterLettersRegrex) !== -1 ||
			stock.search(filterLettersRegrex) !== -1
		) {
			next(
				new ExpressError(
					'stock/price must be a number',
					404,
				),
			);
		}

		const product = await Product.findById(product_id);

		if (req.files) {
			const files = req.files as IFile[];
			req.body.images = [];
			for (let file of files) {
				req.body.images.push({
					filename: file.filename,
					path: file.path,
				});
			}
			for (let image of product?.images as IFile[]) {
				deleteImage(image.filename);
			}
		}

		isUserAuthorized(
			user_id,
			product?.user._id as string,
			next,
		);

		if (name) product!.name = name;
		if (price) product!.price = price;
		if (stock) product!.stock = stock;
		if (description) product!.description = description;
		if (req.body.images && req.body.images.length > 0)
			product!.images = req.body.images;

		await product?.save();

		res.send(product);
	} catch (e: any) {
		for (let image of req.body.images) {
			deleteImage(image.filename);
		}
		next(new ExpressError(e.message, 400));
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id, userId } = req.body;
		if (
			id == null ||
			id === '' ||
			userId == null ||
			userId === ''
		)
			next(new ExpressError('cannot find product', 404));

		const product = await Product.findById(id);
		const productOwner = await User.findById(
			product?.user._id,
		);

		isUserAuthorized(
			userId,
			product?.user._id as string,
			next,
		);

		for (let image of product?.images as IFile[]) {
			await deleteImage(image.filename);
		}

		await product?.deleteOne();

		const products = await Product.find({
			user: productOwner,
		});

		productOwner!.products = products;

		await productOwner?.save();

		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError('Something went wrong!', 400));
	}
};
