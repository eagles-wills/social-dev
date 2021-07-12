import { gql } from "apollo-server";

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		token: String!
		createdAt: String!
		avatar: String!
	}
	type Query {
		greeting: String
	}

	type Mutation {
		registerUser(
			name: String!
			email: String
			password: String!
			confirmPassword: String
		): User!
	}
`;

export default typeDefs;
