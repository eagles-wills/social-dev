import { UserInputError } from "apollo-server";
import gravatar from "gravatar";
import moment from "moment";
import config from "config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User.js";
import checkAuth from "../../util/checkAuth.js";
import {
	validateRegisterUser,
	validateLoginUser,
} from "../../util/validator.js";

const generateToken = (user) => {
	return jwt.sign(
		{ id: user.id, email: user.email, name: user.name, avatar: user.avatar },
		config.get("secret"),
		{
			expiresIn: "5h",
		},
	);
};

const userResolvers = {
	Query: {
		getAuthUser: async (_, __, context) => {
			const { id } = checkAuth(context);
			console.log(id);
			try {
				const user = await User.findOne({ _id: id });
				const token = generateToken(user);
				return {
					...user._doc,
					id: user._id,
					token,
				};
			} catch (error) {
				console.log(error);
				throw new Error("Error", { error: "user not found" });
			}
		},
	},
	Mutation: {
		registerUser: async (_, { name, email, password, confirmPassword }) => {
			// validate user
			const { errors, valid } = validateRegisterUser(
				name,
				email,
				password,
				confirmPassword,
			);
			if (!valid) throw new UserInputError("Errors", { errors });

			const userData = await User.findOne({ email });
			if (userData)
				throw new UserInputError("Email is already taken", {
					errors: { email: "Email is already taken" },
				});

			const avatar = gravatar.url(
				email,
				{ size: "200", rating: "pg", default: "mm" },
				true,
			);
			const newUser = new User({
				name,
				email,
				password: await bcrypt.hash(password, 10),
				avatar,
				createdAt: moment(new Date().toISOString()).toDate(),
			});
			const user = await newUser.save();
			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token,
			};
		},

		loginUser: async (_, { email, password }) => {
			// validate user
			const { errors, valid } = validateLoginUser(email, password);
			if (!valid) throw new UserInputError("Errors", { errors });
			const user = await User.findOne({ email });
			if (!user)
				throw new UserInputError("Wrong credentials", {
					errors: { username: "username/password mismatch" },
				});
			const match = await bcrypt.compare(password, user.password);
			if (!match)
				throw new UserInputError("Wrong credentials", {
					errors: { password: "username/password mismatch" },
				});

			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
	},
};

export default userResolvers;
