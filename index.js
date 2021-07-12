import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
	type Query {
		greeting: String
	}
`;

const resolvers = {
	Query: {
		greeting: () => "hello from the other side",
	},
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => console.log(`server runing on ${url}`));
