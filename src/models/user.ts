import { model, Schema } from 'mongoose';
import Product, { Iproduct } from './product';
import Review, { IReview } from './review';

interface Image {
	filename: string;
	path: string;
}

const ImageSchema = new Schema<Image>({
	filename: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
});

export interface IUser {
	_id: string;
	username: string;
	email: string;
	password: {
		hash: string;
		salt: string;
	};
	image?: {
		filename: string;
		path: string;
	};
	products?: Iproduct[];
	reviews?: IReview[];
}

const UserSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		hash: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
	},

	image: ImageSchema,
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

UserSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Product.deleteMany({
			_id: {
				$in: this.products,
			},
		});
		await Review.deleteMany({
			_id: {
				$in: this.reviews,
			},
		});
	},
);

const User = model<IUser>('User', UserSchema);

export default User;
