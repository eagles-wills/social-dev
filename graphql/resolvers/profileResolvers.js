import { UserInputError } from "apollo-server";
import config from "config";
import request from "request";
import Profile from "../../model/Profile.js";
import User from "../../model/User.js";
import checkAuth from "../../util/checkAuth.js";
import requestGithubUser from "../../util/githubApi.js";
import {
	validateCreateAndUpdateProfile,
	validateEducationProfile,
	validateExperienceProfile,
} from "../../util/validator.js";

let currentUser;
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
		githubLoginURL: () =>
			`https://github.com/login/oauth/authorize?client_id=${config.get(
				"client_id",
			)}&scope=user`,
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

		addExperience: async (
			_,
			{ title, company, location, description, from, to, current },
			context,
		) => {
			const user = checkAuth(context);
			const { errors, valid } = validateExperienceProfile(
				title,
				company,
				from,
			);
			if (!valid) throw new UserInputError("Errors", { errors });
			try {
				let profile = await Profile.findOne({ user: user.id });

				if (!profile)
					throw new UserInputError("Error", {
						errors: { msg: "profile not found" },
					});
				const newExp = {
					title,
					company,
					location,
					description,
					from,
					to,
					current,
				};
				if (profile.experience.length > 1) {
					profile = await Profile.findOneAndUpdate(
						{ user: user.id },
						{ $set: { experience: [newExp] } },
					);

					console.log("add experience updated");
				}

				profile.experience.push(newExp);
				await profile.save();
				console.log("experience added");
				return profile;
			} catch (error) {
				console.log(error);
			}
		},

		deleteExp: async (_, { expId }, context) => {
			const user = checkAuth(context);
			try {
				const profile = await Profile.findOne({ user: user.id });
				if (!profile)
					throw new UserInputError("Error", {
						errors: { msg: "profile not found" },
					});
				console.log(profile.user, user.id);
				if (profile.user.toString() === user.id) {
					const removeIndex = profile.experience
						.map((item) => item._id)
						.indexOf(expId);
					console.log(removeIndex, "This is the remove index");
					profile.experience.splice(removeIndex, 1);
					await profile.save();
					return profile;
				}
				throw new UserInputError("Error", {
					errors: { msg: "user not auhtorized to delete profile" },
				});
			} catch (error) {
				console.log(error);
			}
		},
		addEducation: async (
			_,
			{ school, degree, fieldofstudy, from, to, current },
			context,
		) => {
			const user = checkAuth(context);
			const { errors, valid } = validateEducationProfile(
				school,
				degree,
				fieldofstudy,
				from,
			);
			if (!valid) throw new UserInputError("Errors", { errors });
			try {
				let profile = await Profile.findOne({ user: user.id });

				if (!profile)
					throw new UserInputError("Error", {
						errors: { msg: "profile not found" },
					});
				const newEdu = {
					school,
					degree,
					fieldofstudy,
					from,
					to,
					current,
				};
				if (profile.education.length > 1) {
					profile = await Profile.findOneAndUpdate(
						{ user: user.id },
						{ $set: { education: [newEdu] } },
					);
					await profile.save();
					console.log("add education updated");
					return profile;
				}

				profile.education.push(newEdu);
				await profile.save();
				console.log("education added");
				return profile;
			} catch (error) {
				console.log(error);
			}
		},

		deleteEdu: async (_, { eduId }, context) => {
			const user = checkAuth(context);
			try {
				const profile = await Profile.findOne({ user: user.id });
				if (!profile)
					throw new UserInputError("Error", {
						errors: { msg: "profile not found" },
					});
				console.log(profile.user, user.id);
				if (profile.user.toString() === user.id) {
					const removeIndex = profile.education
						.map((item) => item._id)
						.indexOf(eduId);
					console.log(removeIndex, "This is the remove index");
					profile.education.splice(removeIndex, 1);
					await profile.save();
					return profile;
				}
				throw new UserInputError("Error", {
					errors: { msg: "user not auhtorized to delete profile" },
				});
			} catch (error) {
				console.log(error);
			}
		},

		authorizeWithGitHub: async (_, { code }) => {
			try {
				// obtain data from github
				let githubUser = await requestGithubUser({
					client_id: config.get("client_id"),
					client_secret: config.get("client_secret"),
					code,
				});

				// package the result in a single object
				currentUser = {
					name: githubUser.name,
					githubLogin: githubUser.login,
					avatar: githubUser.avatar_url,
				};
				console.log(currentUser);
				console.log(githubUser);
				return { user: currentUser, token: githubUser.access_token };
			} catch (error) {
				console.log(error);
			}
		},
	},
};

export default profileResolvers;
