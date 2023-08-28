import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Input,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useRef } from "react";

import { useNavigate } from "react-router-dom";
import useShowMessage from "./hooks/useShowMessage";

export default function LoginPage() {
	const nav = useNavigate();
	const [msgBox, showMessage] = useShowMessage();
	function login(username, pwd) {
		axios
			.post(
				"http://localhost:3000/api/auth/login",
				{
					username: username,
					password: pwd,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				if (res.data) {
					localStorage.setItem(
						"auth",
						JSON.stringify({ token: res.data.token, userId: res.data.userId })
					);
					return nav("/");
				}
			})
			.catch((err) => {
				showMessage(
					err.response
						? err.response.data
						: "Couldn't connect to server. Please check your internet connection and try again!",
					"error"
				);
				console.log(err);
			});
	}
	const userRef = useRef(null);
	const pwdRef = useRef(null);
	return (
		<section>
			{msgBox}
			<Box
				display={"flex"}
				alignItems={"center"}
				justifyContent={"center"}
				height={"100vh"}
			>
				<Card sx={{ maxWidth: "500px", width: "100%" }}>
					<form
						style={{ padding: "20px" }}
						method="POST"
						onSubmit={(e) => {
							e.preventDefault();
							return login(userRef.current.value, pwdRef.current.value);
						}}
					>
						<CardContent>
							<Typography
								fontSize={"30px"}
								marginBottom={"10px"}
								textAlign={"center"}
							>
								Login
							</Typography>
							<Box display={"flex"} flexDirection={"column"} gap={"1em"}>
								<Input
									id="username"
									name="username"
									placeholder="Username or email ID"
									inputRef={userRef}
									autoComplete="username"
								></Input>
								<Input
									id="password"
									name="password"
									placeholder="password"
									type="password"
									autoComplete="current-password"
									inputRef={pwdRef}
								></Input>
							</Box>
						</CardContent>
						<CardActions>
							<Box
								width={"100%"}
								display={"flex"}
								justifyContent={"space-between"}
							>
								<Box
									display={"flex"}
									gap={"20px"}
									justifyContent={"flex-start"}
								>
									<Button color="success" type="submit" id="submit">
										Login
									</Button>
									<Button type="reset" id="reset">
										Reset
									</Button>
								</Box>
								<Box display={"flex"}>
									<Button
										type="button"
										onClick={() => {
											nav("/register");
										}}
									>
										I am new here!
									</Button>
								</Box>
							</Box>
						</CardActions>
					</form>
				</Card>
			</Box>
		</section>
	);
}
