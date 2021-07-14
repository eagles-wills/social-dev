import { UserInputError } from "apollo-server";
import Profile from "../../model/Profile.js";
import User from "../../model/User.js";
import checkAuth from "../../util/checkAuth.js";
import { validateCreateAndUpdateProfile } from "../../util/validator.js";

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

		getAllProfiles: async (_, __) => {
			try {
				const profiles = await Profile.find().populate("user", [
					"name",
					"avatar",
				]);
				return profiles;
			} catch (error) {
				console.log(err);
				throw new Error(err);
			}
		},
		getProfileByUserId: async (_, { userId }) => {
			try {
				const profile = await Profile.findById(userId).populate("user", [
					"name",
					"avatar",
				]);
				if (!profile)
					throw new UserInputError("Error", {
						errors: { msg: "profile for this user not found" },
					});
				return profile;
			} catch (error) {
				console.log(error);
			}
		},
	},

	Mutation: {
		createAndUpdateProfile: async (
			_,
			{
				profileInput: {
					company,
					website,
					location,
					bio,
					githubusername,
					status,
					skills,
					youtube,
					facebook,
					twitter,
					github,
					whatsapp,
				},
			},
			context,
		) => {
			const { errors, valid } = validateCreateAndUpdateProfile(
				status,
				skills,
			);
			if (!valid) throw new UserInputError("Errors", { errors });
			const user = checkAuth(context);
			const profileFields = {};
			profileFields.user = user.id;
			if (company) profileFields.company = company;
			if (website) profileFields.website = website;
			if (location) profileFields.location = location;
			if (bio) profileFields.bio = bio;
			if (githubusername) profileFields.githubusername = githubusername;
			if (status) profileFields.status = status;
			if (skills) {
				profileFields.skills = skills
					.split(",")
					.map((skill) => skill.trim());
				console.log(profileFields.skills);
			}
			profileFields.social = {};
			if (youtube) profileFields.social.youtube = youtube;
			if (whatsapp) profileFields.social.whatsapp = whatsapp;
			if (facebook) profileFields.social.facebook = facebook;
			if (twitter) profileFields.social.twitter = twitter;
			if (github) profileFields.social.github = github;

			try {
				let profile = await Profile.findOne({ user: user.id });

				// update profile
				if (profile) {
					profile = await Profile.findOneAndUpdate(
						{ user: user.id },
						{ $set: profileFields },
						{ new: true },
					);

					return profile;
				}

				profile = new Profile(profileFields);
				await profile.save();
				return profile;
			} catch (error) {
				console.log(error);
				throw new Error("Error", { error });
			}
		},

		deleteUser: async (_, __, context) => {
			const user = checkAuth(context);
			try {
				// remove the user profile
				await Profile.findOneAndRemove({ user: user.id });
				// remove the user
				await User.findOneAndRemove({ _id: user.id });
			} catch (error) {
				console.log(error);
			}
		},
	},
};

export default profileResolvers;
