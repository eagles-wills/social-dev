import fetch from "cross-fetch";
const requestGithubToken = (credentials) =>
	fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(credentials),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.log(error);
			throw new Error(JSON.stringify(error));
		});

const requestGithubUserAccount = (token) => {
	console.log(token);
	fetch(`https://api.github.com/user?access_token=${token}`)
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
};

const requestGithubUser = async (credentials) => {
	const { access_token } = await requestGithubToken(credentials);
	const githubUser = await requestGithubUserAccount(access_token);
	console.log(access_token, "from util");
	console.log(githubUser, "from the githubUser");
	return { ...githubUser, access_token };
};

export default requestGithubUser;
