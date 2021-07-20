import { UserInputError } from "apollo-server";
import moment from "moment";
import Post from "../../model/Post.js";
import checkAuth from "../../util/checkAuth.js";
import { validatePost } from "../../util/validator.js";

const postResolvers = {
	Query: {
		getAllPost: async (_, __, context) => {
			const user = checkAuth(context);
			if (user) {
				try {
					const post = await Post.find().sort({ createdAt: -1 });
					return post;
				} catch (error) {
					console.log(error);
				}
			}
		},
		getPostByUserId: async (_, { userId }, context) => {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(userId);
				if (!post)
					throw new UserInputError("Error", { error: "post not found" });

				return post;
			} catch (error) {
				console.log(error);
			}
		},
	},
	Mutation: {
		addPost: async (_, { text }, context) => {
			const { errors, valid } = validatePost(text);
			if (!valid) throw new UserInputError("Error", { errors });
			const user = checkAuth(context);
			console.log(user);
			try {
				const post = new Post({
					name: user.name,
					text,
					avatar: user.avatar,
					createdAt: moment(new Date().toISOString()).toDate(),
				});
				await post.save();
				return post;
			} catch (error) {
				console.log(error);
			}
		},

		deletePost: async (_, { userId }, context) => {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(userId);

				if (!post)
					throw new UserInputError("Error", { error: "post not found" });
				if (post.name === user.name) {
					await post.remove();
					return "Post deleted";
				}
				throw new UserInputError("Error", { error: "User not authorized" });
			} catch (error) {
				console.log(error);
			}
		},

		addLike: async (_, { userId }, context) => {
			const user = checkAuth(context);
			try {
				const post = await Post.findById(userId);
				if (post) {
					if (post.likes.length < 1) {
						// post is yet to be likedby the user
						post.likes.push({
							name: user.name,
							createdAt: moment(new Date().toISOString()).toDate(),
						});
						console.log("like added");
					} else {
						// post is liked by the user unlike the post
						post.likes = post.likes.filter(
							(like) => like.name !== user.name,
						);
						console.log("unlike ");
					}
					await post.save();
					return post;
				}
				throw new UserInputError("Error", { error: "post not found" });
			} catch (error) {
				console.log(error);
			}
		},

		addComment: async (_, { text }, context) => {
			const { errors, valid } = validatePost(text);
			if (!valid) throw new UserInputError("Error", { errors });
			const user = checkAuth(context);
			try {
				const post = await Post.findOne({ name: user.name });
				if (post) {
					if (post.name === user.name) {
						post.comments.unshift({
							name: user.name,
							avatar: user.avatar,
							text,
							createdAt: moment(new Date().toISOString()).toDate(),
						});
						await post.save();
						return post;
					}
				}
				throw new UserInputError("Error", { error: "post not found" });
			} catch (error) {
				console.log(error);
			}
		},

		deleteComment: async (_, { postId, commentId }, context) => {
			const user = checkAuth(context);
			try {
				const post = await Post.findById(postId);
				if (post) {
					if (post.name === user.name) {
						const comment_id = post.comments.findIndex(
							(comment) => comment.id === commentId,
						);
						post.comments.splice(comment_id, 1);
						await post.save();
						return post;
					}
					throw new UserInputError("Error", {
						error: "user not authorized",
					});
				}
				throw new UserInputError("Error", { error: "post not found" });
			} catch (error) {
				console.log(error);
			}
		},
	},
};

export default postResolvers;
