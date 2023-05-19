import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const connect = await mongoose.connect(
			process.env.MONGODB_URL ?? '',
		);
	} catch (e: any | unknown) {
		process.exit(1);
	}
};
