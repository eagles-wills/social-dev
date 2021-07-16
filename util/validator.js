export const validateRegisterUser = (
	name,
	email,
	password,
	confirmPassword,
) => {
	const errors = {};

	if (name === "") errors.name = "Please Enter Your Name";
	if (email === "") {
		errors.email = "Please Enter Your Email Address";
	} else {
		const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.match(regEx)) errors.email = "Please Enter A valid Email";
	}

	if (password.length < 6) {
		errors.password = "Password Must Contain at Least 6 character";
	} else {
		if (password !== confirmPassword) {
			errors.confirmPassword =
				"Confirm password must be the same as the password";
		}
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
export const validateLoginUser = (email, password) => {
	const errors = {};

	if (email === "") {
		errors.email = "Please Enter Your Email Address";
	} else {
		const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.match(regEx)) errors.email = "Please Enter A valid Email";
	}

	if (password.length === "") {
		errors.password = "Password must not be empty";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

export const validateCreateAndUpdateProfile = (status, skills) => {
	const errors = {};

	if (skills === "") {
		errors.skills = "Please enter at least one skill";
	}
	if (status === "") {
		errors.status = "status is required";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

export const validateExperienceProfile = (title, company, from) => {
	const errors = {};

	if (title === "") {
		errors.title = "title is required";
	}
	if (company === "") {
		errors.company = "company is required";
	}
	if (from === "") {
		errors.from = "from is required";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
export const validateEducationProfile = (
	school,
	degree,
	fieldofstudy,
	from,
) => {
	const errors = {};

	if (school === "") {
		errors.school = "title is required";
	}
	if (degree === "") {
		errors.degree = "company is required";
	}
	if (fieldofstudy === "") {
		errors.fieldofstudy = "title is required";
	}

	if (from === "") {
		errors.from = "from is required";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
