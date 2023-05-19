import { model, Schema } from 'mongoose';
import { IUser } from './user';
import Review, { IReview } from './review';

export interface Image {
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

export interface Iproduct {
	_id: string;
	name: string;
	price: string;
	stock: string;
	description: string;
	images?: Image[];
	user: IUser;
	reviews?: IReview[];
	avgRating: number
}

const ProductSchema = new Schema<Iproduct>({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	stock: {
		type: String,
		default: '1',
	},
	description: {
		type: String,
		required: true,
	},
	images: [ImageSchema],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	avgRating: {
		type: Number,
		default: 0
	}
});

ProductSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Review.deleteMany({
			_id: {
				$in: this.reviews,
			},
		});
	},
);




const Product = model<Iproduct>('Product', ProductSchema);

export default Product;
