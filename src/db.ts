import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const connect = await mongoose.connect(
			process.env.MONGODB_URL ?? '',
		);
		console.log(
			`MONGODB CONNECTED: ${connect.connection.host}`,
		);
	} catch (e: any | unknown) {
		console.log(e.message);
		process.exit(1);
	}
};
