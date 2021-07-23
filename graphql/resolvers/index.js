import postResolvers from "./postResolvers.js";
import profileResolvers from "./profileResolvers.js";
import userResolvers from "./userResolvers.js";

const resolvers = {
	Query: {
		...postResolvers.Query,
		...profileResolvers.Query,
		...userResolvers.Query,
	},

	Mutation: {
		...userResolvers.Mutation,
		...profileResolvers.Mutation,
		...postResolvers.Mutation,
	},
};

export default resolvers;
