import { UserInputError } from "apollo-server";
import gravatar from "gravatar";
import moment from "moment";
import config from "config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User.js";
import { validateRegisterUser } from "../../util/validator.js";

const generateToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email }, config.get("secret"), {
		expiresIn: "5h",
	});
};

const userResolvers = {
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

			const avatar = gravatar.profile_url(
				email,
				{ size: "200", rating: "pg", default: "retro" },
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
	},
};

export default userResolvers;
