import axios from "axios";
import { useEffect, useState } from "react";

export default function useUserInfo() {
	const [isLoading, setIsLoading] = useState(true);

	const [user, setUser] = useState();

	useEffect(() => {
		if (!isLoading) return;
		const auth = JSON.parse(localStorage.getItem("auth"));
		if (auth)
			axios
				.get(`http://localhost:3000/api/users/id/${auth.userId}`)
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
		else {
			setIsLoading(false);
		}
	}, [isLoading]);

	return { user, isLoading };
}
