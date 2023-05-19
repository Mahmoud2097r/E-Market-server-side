import { model, Schema } from 'mongoose';
import { IUser } from './user';
import { Iproduct } from './product';

export interface IReview {
	body?: string;
	rating?: number;
	user: IUser;
	product: Iproduct;
	isEditing?: boolean
}

const ReviewSchema = new Schema<IReview>({
	body: {
		type: String,
	},
	rating: {
		type: Number,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	isEditing: {
		type: Boolean,
		default: false
	}
});

const Review = model<IReview>('Review', ReviewSchema);

export default Review;
