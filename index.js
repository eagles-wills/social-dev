import { ApolloServer } from "apollo-server";
import colors from "colors";
import mongoose from "mongoose";
import config from "config";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
	.connect(config.get("mongoDBLocal"), {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		server
			.listen()
			.then(({ url }) => console.log(`server runing on ${url}`.blue.bold));
	})
	.then(() =>
		console.log(
			`MongoDB: Connected on ${mongoose.connection.host}`.magenta.bold,
		),
	)
	.catch((err) => console.log(err));
