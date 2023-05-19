import ShoppingCart from '../models/shoppingCart';
import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import CartItem, { ICartItem } from '../models/cartItem';

export const postShoppingCart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id, shoppingCart_id } = req.body;
		if (product_id == null || product_id === '')
			throw new Error();
		const product = await Product.findById(product_id);

		const newCartItem = await new CartItem();
		newCartItem.item_id = product!._id;
		newCartItem.name = product!.name;
		newCartItem.price = Number(product!.price);
		newCartItem.image = product!.images![0].path;
		await newCartItem.save();

		if (shoppingCart_id === '' || shoppingCart_id == null) {
			const shoppingCart =
				await new ShoppingCart().populate({
					path: 'products',
				});

			shoppingCart.cartItems.push(newCartItem);
			shoppingCart!.total! += newCartItem!.price;
			await shoppingCart?.save();
			res.status(200).send(shoppingCart);
			return;
		}

		const shoppingCart = await ShoppingCart.findById(
			shoppingCart_id,
		).populate({
			path: 'cartItems',
		});

		shoppingCart!.cartItems.push(newCartItem);

		shoppingCart!.total! += newCartItem!.price;

		await shoppingCart?.save();

		res.status(200).send(shoppingCart);
	} catch (e: any) {
		if (e.statusCode === 400)
			next(new ExpressError('404 Page Not Found', 404));

		next(
			new ExpressError(
				'Sorry, Something went wrong try again later!',
				404,
			),
		);
	}
};

export const updateShoppingCart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { item_id } = req.body;
		const { shoppingCart_id } = req.params;

		if (item_id == null || item_id === '') throw new Error();

		const cartItem = await CartItem.findById(item_id);
		const shoppingCart = await ShoppingCart.findById(
			shoppingCart_id,
		).populate({
			path: 'cartItems',
		});

		shoppingCart!.cartItems = shoppingCart!.cartItems.filter(
			(item) => {
				return !cartItem?.equals(item as any) && item;
			},
		);

		await cartItem?.deleteOne();
		shoppingCart!.total! -= cartItem!.price;

		await shoppingCart?.save();

		res.status(200).send(shoppingCart);
	} catch (e: any) {
		if (e.statusCode === 400)
			next(new ExpressError('404 Page Not Found', 404));

		next(
			new ExpressError(
				'Sorry, Something went wrong try again later!',
				404,
			),
		);
	}
};
