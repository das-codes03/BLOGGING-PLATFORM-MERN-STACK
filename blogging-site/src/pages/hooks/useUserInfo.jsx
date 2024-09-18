
import { useEffect, useState } from "react";
import axiosConfig from "../../components/AxiosConfig";

export default function useUserInfo() {
	const [isLoading, setIsLoading] = useState(true);

	const [user, setUser] = useState();

	// if (searchAgain) {
	// 	setIsLoading(true);
	// }
	// Add a common header to every request
	const token = localStorage.getItem("auth");
	axiosConfig.interceptors.request.use((config) => {
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
		axiosConfig
			.get(`/users/me`)
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
