// @ts-nocheck
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_KEY,
	CLOUDINARY_SECRET,
} = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_KEY,
	api_secret: CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'E-Market',
		allowedFormat: async (req, file) => [
			'png',
			'jpeg',
			'jpg',
		],
	},
});

export default cloudinary;
