import axios from "axios";
import { useEffect, useState } from "react";

export default function useUserInfo() {
	const [isLoading, setIsLoading] = useState(true);

	const [user, setUser] = useState();

	// if (searchAgain) {
	// 	setIsLoading(true);
	// }
	// Add a common header to every request
	const token = localStorage.getItem("auth");
	axios.interceptors.request.use((config) => {
		config.headers["authorization"] = token;
		return config;
	});
	useEffect(() => {
		if (!isLoading) return;
		if (!token) {
			setIsLoading(false);
			setUser(false);
			return;
		}
		axios
			.get(`http://localhost:3000/api/users/me`)
			.then((u) => {
				setUser(() => {
					setIsLoading(false);
					return u.data;
				});
			})
			.catch(() => {
				setUser(false);
				setIsLoading(false);
			});
	}, [isLoading]);

	return { user, isLoading };
}
