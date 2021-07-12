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

	if (password.length > 6) {
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
