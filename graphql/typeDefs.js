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

	type Experience {
		title: String
		company: String
		loction: String
		from: String
		to: String
		current: Boolean
		description: String
		createdAt: String
	}

	type Education {
		school: String
		degree: String
		fieldofstudy: String
		from: String
		to: String
		current: Boolean
		createdAt: String
	}

	type Social {
		youtube: String
		whatsapp: String
		twitter: String
		facebook: String
		github: String
	}

	type Profile {
		id: ID!
		company: String!
		location: String!
		website: String!
		status: String!
		skills: [String]!
		bio: String!
		githubusername: String!
		experience: [Experience]!
		education: [Education]!
		social: Social
	}
	type Query {
		getCurrentUserProfile: Profile!
	}

	type Mutation {
		registerUser(
			name: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!

		loginUser(email: String!, password: String!): User!
	}
`;

export default typeDefs;
