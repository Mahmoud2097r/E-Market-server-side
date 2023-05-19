import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getProducts,
	postProduct,
	showProduct,
	editProduct,
	deleteProduct,
} from '../controllers/products';
import { storage } from '../cloudinary/';
import multer from 'multer';

const upload = multer({ storage });

const productsRouter = Router();

productsRouter
	.route('/')
	.get(expressAsyncHandler(getProducts))
	.post(
		upload.array('files'),
		expressAsyncHandler(postProduct),
	);

productsRouter
	.route('/:product_id')
	.get(expressAsyncHandler(showProduct))
	.put(upload.array('files'), expressAsyncHandler(editProduct))
	.delete(expressAsyncHandler(deleteProduct));

export default productsRouter;
