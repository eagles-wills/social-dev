import Profile from "../../model/Profile.js";
import checkAuth from "../../util/checkAuth.js";

const profileResolvers = {
	Query: {
		getCurrentUserProfile: async (_, __, context) => {
			const user = checkAuth(context);
			const userProfile = await Profile.findOne({ user: user.id }).populate(
				"user",
				["name", "avatar"],
			);
			if (!userProfile) throw new Error("no profile for this user");
			return userProfile;
		},
	},
};

export default profileResolvers;
