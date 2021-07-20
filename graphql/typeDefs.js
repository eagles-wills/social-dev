import { gql } from "apollo-server";

const typeDefs = gql`
	input ProfileInput {
		company: String
		location: String
		website: String
		status: String!
		skills: String!
		bio: String
		githubusername: String
		youtube: String
		whatsapp: String
		twitter: String
		facebook: String
		github: String
	}
	type User {
		id: ID!
		name: String!
		email: String!
		token: String!
		createdAt: String!
		avatar: String!
	}

	type GithubUser {
		githubLogin: String
		name: String
		avatar: String
	}

	type AuthPayload {
		user: GithubUser!
		token: String
	}

	type Experience {
		id: ID!
		title: String!
		company: String!
		location: String
		from: String!
		to: String
		current: Boolean
		description: String
		createdAt: String
	}

	type Education {
		id: ID
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
		company: String
		location: String
		website: String
		status: String!
		skills: [String!]!
		bio: String
		githubusername: String
		experience: [Experience]!
		education: [Education]!
		social: Social
	}
	type Likes {
		id: ID!
		name: String!
		createdAt: String
	}
	type Comments {
		id: ID!
		name: String!
		text: String!
		avatar: String!
		createdAt: String
	}
	type Post {
		id: ID!
		name: String!
		avatar: String
		text: String!
		likes: [Likes]!
		comments: [Comments]!
		createdAt: String
	}
	type Query {
		getCurrentUserProfile: Profile!
		getAllProfiles: [Profile]!
		getProfileByUserId(userId: ID!): Profile!
		githubLoginURL: String!
		getAllPost: [Post]!
		getPostByUserId(userId: ID!): Post!
	}

	type Mutation {
		registerUser(
			name: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!

		loginUser(email: String!, password: String!): User!
		createAndUpdateProfile(profileInput: ProfileInput): Profile!
		deleteUser: String!
		addExperience(
			title: String!
			company: String!
			from: String!
			to: String
			description: String
			location: String
			current: Boolean
		): Profile!

		deleteExp(expId: ID!): Profile!
		addEducation(
			school: String!
			degree: String!
			from: String!
			to: String
			fieldofstudy: String
			current: Boolean
			eduId: ID!
		): Profile!

		deleteEdu(eduId: ID!): Profile!
		authorizeWithGitHub(code: String!): AuthPayload!
		addPost(text: String): Post!
		deletePost(userId: ID!): String!
		addLike(userId: ID!): Post!
		addComment(text: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
	}
`;

export default typeDefs;
