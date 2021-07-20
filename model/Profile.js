import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	company: String,
	location: String,
	website: String,
	status: String,
	skills: { type: [String], required: [true, "please enter one skill"] },
	bio: String,
	githubusername: String,
	experience: [
		{
			title: String,
			company: String,
			location: String,
			from: String,
			to: String,
			current: Boolean,
			description: String,
			createdAt: String,
		},
	],
	education: [
		{
			school: String,
			degree: String,
			fieldofstudy: String,
			from: String,
			to: String,
			current: Boolean,
			createdAt: String,
		},
	],

	social: {
		youtube: String,
		whatsapp: String,
		twitter: String,
		facebook: String,
		github: String,
	},

	createdAt: String,
});

const Profile = model("profile", ProfileSchema);
export default Profile;
