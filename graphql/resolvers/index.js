import postResolvers from "./postResolvers.js";
import userResolvers from "./userResolvers.js";

const resolvers = {
	Query: {
		...postResolvers.Query,
	},

	Mutation: {
		...userResolvers.Mutation,
	},
};

export default resolvers;
