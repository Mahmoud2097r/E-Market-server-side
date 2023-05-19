import {
	signup,
	login,
	logout,
	update,
	deleteUser,
	getUsersProducts,
	getProfileOwner
} from '../controllers/users';
import expressAsyncHandler from 'express-async-handler';
import { Router } from 'express';
import { storage } from '../cloudinary/';
import multer from 'multer';

const upload = multer({ storage });
const usersRouter = Router();

usersRouter.post(
	'/signup',
	upload.single('file'),
	expressAsyncHandler(signup),
);

usersRouter.post('/login', expressAsyncHandler(login));

usersRouter.post('/logout', expressAsyncHandler(logout));

usersRouter
	.route('/:user_id/')
	.put(upload.single('file'), expressAsyncHandler(update))
	.delete(expressAsyncHandler(deleteUser));

usersRouter.get(
	'/:user_id/user_products',
	expressAsyncHandler(getUsersProducts),
);

usersRouter.post('/getProfileOwner', expressAsyncHandler(getProfileOwner))

export default usersRouter;
