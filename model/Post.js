import mongoose from "mongoose";
const { model, Schema } = mongoose;

const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	text: String,
	name: String,
	avatar: String,
	likes: [
		{
			name: String,
			createdAt: String,
		},
	],

	comments: [
		{
			name: String,
			text: String,
			avatar: String,
			createdAt: String,
		},
	],
	createdAt: String,
});

const Post = model("post", PostSchema);
export default Post;
