
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import axiosConfig from "../components/AxiosConfig";

export default function ActivateUserPage() {
	const [query] = useSearchParams();

	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const token = query.get("token");
	//now activate the account
	useEffect(() => {
		axiosConfig
			.post(`/auth/activate`, { token: `${token}` })
			.then((res) => {
				setIsLoading(false);
				//get the token and set it local storage
				localStorage.setItem(
					"auth",
					JSON.stringify({ token: res.data.token, userId: res.data.userId })
				);
				return navigate("/editprofile");
			})
			.catch((e) => {
				console.log(e);
				setIsLoading(false);
			});
	}, []);

	return <></>;
}
