import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import User from '../models/user';
import cloudinary from '../cloudinary';
import ExpressError from './expressError';
import { Iproduct }  from '../models/product';
import { IReview } from '../models/review';

export const genPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return { salt, hash };
};

export const deleteImage = (filename: string) => {
	cloudinary.uploader.destroy(filename);
};

export const isUserAuthorized = async (
	user_id: string,
	productOwnerId: string,
	next: NextFunction,
) => {
	const loggedInUser = await User.findById(user_id);

	const productOwner = await User.findById(productOwnerId);
	if (!loggedInUser?.equals(productOwner!))
		return next(
			new ExpressError(
				'YOU ARE NOT AUTHORIZED TO DO THIS ACTION!',
				403,
			),
		);
};

export const calcAvgRating = (product: Iproduct) => {
	let ratingsTotal = 0
	let avgRating = 0
	if (product!.reviews!.length) {
		product!.reviews!.forEach((review: IReview) => {
			ratingsTotal += review.rating!
		})
		avgRating = Math.round((ratingsTotal / product!.reviews!.length))
	} else {
		avgRating = ratingsTotal
	}
	return avgRating
}
