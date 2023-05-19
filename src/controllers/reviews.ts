import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import ExpressError from '../middlewares/expressError';
import User from '../models/user';
import Review, { IReview } from '../models/review';

export const postReview = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(product_id)
			.populate('reviews')
			.exec();
		const { body, rating } = req.body.review;
		const user = await User.findById(req.body.user_id);
		const haveReviewed = product?.reviews?.filter(
			(review: IReview) => {
				return user?.equals(review.user as any);
			},
		).length;

		if (haveReviewed! > 0)
			throw new Error(
				"You can't add more than one review",
			);

		if (
			body === '' &&
			rating === '' &&
			body == null &&
			rating == null
		)
			next(
				new ExpressError(
					'You must provide at least a rating or a comment',
					404,
				),
			);

		const review = await new Review();

		if (rating) review.rating = Number(rating);
		if (body) review.body = body;
		if (user) review.user = user;
		if (product) review.product = product;

		await review.save();

		product?.reviews?.push(review);
		user?.reviews?.push(review);

		await product?.save();
		await user?.save();

		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const patchReview = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { review_id } = req.params;
		const { user_id, review } = req.body;
		const { body, rating } = review;

		const user = await User.findById(user_id);
		const updatedReview = await Review.findById(review_id)
			.populate('user')
			.exec();

		if (!user?.equals(updatedReview?.user as any))
			throw new Error('Not Authorized');

		if (body) updatedReview!.body = body;
		if (rating) updatedReview!.rating = Number(rating);

		await updatedReview?.save();

		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const deleteReview = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { review_id, product_id } = req.params;
		const { user_id } = req.body;

		const user = await User.findById(user_id);
		const review = await Review.findById(review_id)
			.populate('user')
			.exec();
		const product = await Product.findById(product_id);

		if (!user?.equals(review?.user as any))
			throw new Error('Not Authorized');

		await review?.deleteOne();

		const productsReviews = await Review.find({
			product: product,
		});
		const usersReviews = await Review.find({ user: user });

		product!.reviews = productsReviews;
		user.reviews = usersReviews;

		await product?.save();
		await user.save();

		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
