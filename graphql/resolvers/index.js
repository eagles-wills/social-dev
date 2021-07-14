import postResolvers from "./postResolvers.js";
import profileResolvers from "./profileResolvers.js";
import userResolvers from "./userResolvers.js";

const resolvers = {
	Query: {
		...postResolvers.Query,
		...profileResolvers.Query,
	},

	Mutation: {
		...userResolvers.Mutation,
		...profileResolvers.Mutation,
	},
};

export default resolvers;
