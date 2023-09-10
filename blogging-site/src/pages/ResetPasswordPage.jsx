import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useShowMessage from "./hooks/useShowMessage";
import PasswordValidator from "password-validator";

export default function ResetPasswordPage() {
	const [query] = useSearchParams();
	const token = query.get("token");
	const [msgbox, showMessage] = useShowMessage();
	const navigate = useNavigate();
	function submit(password, token) {
		axios
			.post(`http://localhost:3000/api/auth/resetpassword`, {
				token: token,
				password: password,
			})
			.then(() => {
				navigate("/login");
			})
			.catch((e) => {
				showMessage("Something went wrong", "error");
			});
	}

	const pwdRef = useRef();
	const confPwdRef = useRef();
	function validatePwd() {
		const pwd = pwdRef.current.value;
		const confPwd = confPwdRef.current.value;

		if (pwd != confPwd) {
			confPwdRef.current.focus();
			showMessage("Password fields do not match.", "error");
			return;
		}

		var schema = new PasswordValidator();
		// Add properties to it
		schema
			.min(8) // Minimum length 8
			.max(100)
			.not()
			.spaces();

		if (!schema.validate(pwd)) {
			showMessage(
				"Password must have atleast 8 characters and no spaces",
				"error"
			);
			pwdRef.current.focus();
			return false;
		}

		return true;
	}

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
				<Typography fontSize={"2em"}>Reset password</Typography>
				<Typography fontSize={"1.25em"}>Please enter new password</Typography>
				<TextField
					inputRef={pwdRef}
					sx={{ maxWidth: "700px", width: "100%" }}
					label="New password"
					type="password"
				/>
				<TextField
					inputRef={confPwdRef}
					sx={{ maxWidth: "700px", width: "100%" }}
					label="Confirm new password"
					type="password"
				/>
				<Button
					color="success"
					onClick={() => {
						if (!validatePwd()) return;
						submit(pwdRef.current.value, token);
					}}
				>
					Reset password
				</Button>
			</Box>
		</>
	);
}
