import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import config from "config";

const checkAuth = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, config.get("secret"));
				return user;
			} catch (error) {
				throw new AuthenticationError("invalid/Expired Token");
			}
		}
		throw new AnthenticationError("No token, user not authorized");
	}
	throw new AuthenticationError("No Authentication Header Found");
};

export default checkAuth;
