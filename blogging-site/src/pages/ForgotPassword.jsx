import { Box, Button, TextField, Typography } from "@mui/material";

import { useRef, useState } from "react";
import { useNavigate } from "react-router";
// import isEmail from "validator/lib/isemail";
import useShowMessage from "./hooks/useShowMessage";
import axiosConfig from "../components/AxiosConfig";
// import isEmail from "validator/lib/isemail";

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [msgbox, showMessage] = useShowMessage();
	const [isValidEmail, setIsValid] = useState(true);
	function getLink(email) {
		axiosConfig
			.post(`/auth/getresetpasswordlink`, {
				email,
			})
			.then((res) => {
				showMessage(
					"Password reset link has been mailed to your email. The is valid for 10 minutes",
					"success"
				);
			})
			.catch((e) => {
				e.response
					? showMessage(e.response.data, "error")
					: showMessage("Something went wrong", "error");
			});
	}
	const emailRef = useRef();
	return (
		<>
			{msgbox}
			<Box
				display={"flex"}
				flexDirection={"column"}
				alignItems={"center"}
				height={"50vh"}
				justifyContent={"center"}
				gap={"10px"}
				padding={"20px"}
			>
				<Typography fontSize={"2em"}>
					Forgotten your password? No problem. We'll help you reset it.
				</Typography>
				<Typography fontSize={"1.25em"}>
					Please enter the email address associated with your account
				</Typography>
				<TextField
					color={isValidEmail ? "" : "error"}
					inputRef={emailRef}
					type="email"
					sx={{ maxWidth: "700px", width: "100%" }}
					label="Email address"
				/>
				<Button
					onClick={() => {
						const email = emailRef.current.value;
						// if (!isEmail(email)) {
						// 	emailRef.current.focus();
						// 	showMessage("Please enter a valid email!", "error");
						// 	setIsValid(false);
						// 	return;
						// }
						setIsValid(true);
						getLink(emailRef.current.value);
					}}
					color="success"
				>
					Send reset link
				</Button>
			</Box>
		</>
	);
}
