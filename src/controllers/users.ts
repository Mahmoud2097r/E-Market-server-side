import { Response, Request, NextFunction } from 'express';
import User from '../models/user';
import { genPassword, deleteImage } from '../middlewares';
import bcrypt from 'bcrypt';
import ExpressError from '../middlewares/expressError';

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, email, password } = req.body;
		const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g

		if (username.search(usernameRegrex) !== -1) {
			next(new ExpressError('Invalid username', 404))
		}

		if (!emailRegex.test(email)) {
			next(new ExpressError('Invalid email', 404))
		}

		if (
			username == null ||
			username === '' ||
			email == null ||
			email === '' ||
			password == null ||
			password === ''
		) {
			next(new ExpressError('Please fill all required fields', 404))
		}

		if (req.file) {
			const { filename, path } = req.file;
			req.body.image = { filename, path };
		}

		const user = await new User({
			email,
			username,
			password: await genPassword(password),
			image: req.body.image,
		});

		await user.save();

		res.status(200).send({
			user: {
				username: user.username,
				email: user.email,
				_id: user._id,
				image: user.image?.path,
			}
		});
	} catch (e: unknown | any) {
		deleteImage(req.body.image?.filename);
		if (e.message.includes('duplicate'))
			e.message = 'This email/username already Registered';
		next(new ExpressError(e.message, 400));
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, password } = req.body;

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g

		if (username.search(usernameRegrex) !== -1) {
			next(new ExpressError('Invalid username', 404))
		}

		if (
			username == null ||
			username === '' ||
			password == null ||
			password === ''
		)
			next(
				new ExpressError(
					'Please fill all required fields',
					400,
				),
			);

		const user = await User.find({ username }).populate({
			path: 'products',
		});


		if (user == null) throw new Error();

		if (!bcrypt.compareSync(password, user[0].password.hash))
			throw new Error();

		res.send({
			user: {
				username: user[0].username,
				email: user[0].email,
				_id: user[0]._id,
				image: user[0].image?.path,
			},
		});
	} catch (e: unknown | any) {
		next(
			new ExpressError(
				'incorrect username or password',
				400,
			),
		);
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.body;
		const idRegrex = /[.&*+?^${}()|[\]\\]/g

		if (id.search(idRegrex) !== -1) {
			next(new ExpressError('Invalid credentials', 404))
		}

		if (id == null || id === '')
			next(new ExpressError('Something went wrong!', 400));

		res.status(200).send('logged out successfully');
	} catch (e: unknown | any) {
		console.log(e.message);
		next(new ExpressError(e.message, 400));
	}
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id } = req.params;
		const user = await User.findById(user_id);
		if (req.file) {
			const { filename, path } = req.file;
			req.body.image = { filename, path };
		}
		const {
			username,
			email,
			currentPassword,
			newPassword,
			confirmNewPassword,
			image,
		} = req.body;

		const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g

		if (username.search(usernameRegrex) !== -1) {
			next(new ExpressError('Invalid username', 404))
		}

		if (!emailRegex.test(email)) {
			next(new ExpressError('Invalid email', 404))
		}

		if (currentPassword == null || currentPassword === '') {
			await deleteImage(image.filename);
			next(new ExpressError('Invalid credentials ', 404));
		}
		if (
			!bcrypt.compareSync(
				currentPassword,
				user!.password.hash ?? '',
			)
		) {
			await deleteImage(image.filename);
			next(new ExpressError('Invalid credentials ', 404));
		}

		if (
			newPassword != null ||
			newPassword !== '' ||
			confirmNewPassword != null ||
			confirmNewPassword !== ''
		) {
			if (newPassword !== confirmNewPassword) {
				await deleteImage(image.filename);

				next(
					new ExpressError(
						'Passwords did not matched',
						401,
					),
				);
			}
		}

		if (username) user!.username = username;
		if (email) user!.email = email;
		if (newPassword)
			user!.password = await genPassword(newPassword);
		if (image) {
			if (user?.image?.filename)
				await deleteImage(user!.image!.filename);
			user!.image = image;
		}

		await user!.save();

		res.send({
			user: {
				username: user!.username,
				email: user!.email,
				_id: user!._id,
				image: user!.image!.path,
			},
		});
	} catch (e: any) {
		if (e.message.includes('duplicate'))
			e.message = 'This email/username already Registered';
		next(new ExpressError(e.message, 400));
	}
};

export const getUsersProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id } = req.params;

		const user = await User.findById(user_id).populate({
			path: 'products',
		});

		res.send(user?.products);
	} catch (e: any) {
		console.log(e.message);
		next(new ExpressError('Something went wrong!', 400));
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { password } = req.body;
		const { user_id } = req.params;
		if (
			user_id == null ||
			user_id === '' ||
			password == null ||
			password === ''
		)
			next(
				new ExpressError('please fill all fields', 403),
			);

		const user = await User.findById(user_id);

		if (!bcrypt.compareSync(password, user!.password.hash))
			next(
				new ExpressError(
					'Something went wrong try again!',
					403,
				),
			);

		deleteImage(user?.image?.filename as string);

		await user?.deleteOne();
		res.status(200).send();
	} catch (e: any) {
		console.log(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const getProfileOwner = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { profile_id } = req.body

		const profile_idRegrex = /[.&*+?^${}()|[\]\\]/g

		if (profile_id.search(profile_idRegrex) !== -1) {
			next(new ExpressError('Invalid credentials', 404))
		}


		const profileOwner = await User.findById(profile_id)

		res.status(200).send(profileOwner)
	} catch (e: any) {
		console.log(e.message)
		next(new ExpressError(e.message, 404))
	}
}