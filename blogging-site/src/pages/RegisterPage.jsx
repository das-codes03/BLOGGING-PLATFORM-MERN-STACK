import {
	Box,
	Button,
	Container,
	Input,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";

import { useRef, useState } from "react";
import validator from "validator";
import useShowMessage from "./hooks/useShowMessage";
import PasswordValidator from "password-validator";
import useNameValidator from "./hooks/useNameValidator";
export default function RegisterPage() {
	const nameRef = useRef();
	const emailRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const [nameValidity, setNameValidity] = useState(true);
	const [usernameValidity, setUsernameValidity] = useState(true);
	const [passwordValidity, setPwdValidity] = useState(true);
	const [emailValidity, setEmailValidity] = useState(true);
	const [msgBox, showMessage] = useShowMessage();

	function validateInput() {
		let correctness = true;
		emailRef.current.value = emailRef.current.value.trim();
		nameRef.current.value = nameRef.current.value.trim();
		usernameRef.current.value = usernameRef.current.value.trim();

		if (nameRef.current.value.length === 0) {
			setNameValidity(false);
			showMessage("Name cannot be blank.", "error");
			nameRef.current.focus();
			correctness = false;
			return false;
		} else {
			setNameValidity(true);
		}

		if (!validator.isEmail(emailRef.current.value)) {
			setEmailValidity(false);
			emailRef.current.focus();
			correctness = false;
			showMessage(
				"Uh-oh! Your email doesn't look valid. Please check and re-enter.",
				"error"
			);
			return false;
		} else {
			setEmailValidity(true);
		}
		if (usernameRef.current.value.length === 0) {
			setUsernameValidity(false);
			showMessage("Oops! Username cannot be blank", "error");
			correctness = false;
			return false;
		} else if (!validator.isAlphanumeric(usernameRef.current.value)) {
			setUsernameValidity(false);
			showMessage(
				"Oops! Username must contain only alphabets and numbers!",
				"error"
			);
			correctness = false;
			return false;
		} else {
			setUsernameValidity(true);
		}
		var schema = new PasswordValidator();
		// Add properties to it
		schema
			.min(8) // Minimum length 8
			.max(100)
			.not()
			.spaces();

		if (!schema.validate(passwordRef.current.value)) {
			setPwdValidity(false);
			correctness = false;
			showMessage(
				"Password must have atleast 8 characters and no spaces",
				"error"
			);
			passwordRef.current.focus();
			return false;
		} else {
			setPwdValidity(true);
		}

		const checkpwdEqual =
			passwordRef.current.value === confirmPasswordRef.current.value;
		if (!checkpwdEqual) {
			showMessage(
				"Oops! Your passwords don't match. Please check and try again.",
				"error"
			);
			setPwdValidity(false);
			correctness = false;
			confirmPasswordRef.current.focus();
			return false;
		} else {
			setPwdValidity(true);
		}

		return correctness;
	}

	function submitRegistration() {
		const data = {
			username: usernameRef.current.value,
			password: passwordRef.current.value,
			email: emailRef.current.value,
			name: nameRef.current.value,
		};
		axios
			.post(`http://localhost:3000/api/auth/register`, data)
			.then((res) => {
				//now go to verification page
				showMessage(
					"Verification link has been sent to your mail. It will remain valid for 24 hours.",
					"success"
				);
			})
			.catch((e) => {
				showMessage(
					e.response
						? e.response.data
						: "Oops! Couldn't connect to the server. Please check your network connection and try again.",
					"error"
				);
			});
	}
	const nameValidate = useNameValidator(nameRef);
	// const [isMob, setIsMob] = useState(false);
	return (
		<>
			<Container>
				<Typography textAlign={"center"} fontSize={"2em"}>
					Register
				</Typography>
				<Box display={"flex"} flexDirection={"column"} gap={"10px"}>
					<TextField
						onChange={nameValidate}
						inputRef={nameRef}
						label="Name"
						color={nameValidity ? "" : "error"}
					/>
					<TextField
						inputRef={emailRef}
						label="Email"
						color={emailValidity ? "" : "error"}
					/>
					<TextField
						inputRef={usernameRef}
						label="Choose username"
						color={usernameValidity ? "" : "error"}
					/>
					<TextField
						inputRef={passwordRef}
						color={passwordValidity ? "" : "error"}
						label="Password"
						type="password"
					/>
					<TextField
						inputRef={confirmPasswordRef}
						color={passwordValidity ? "" : "error"}
						label="Confirm password"
						type="password"
					/>
				</Box>
				<Button
					onClick={() => {
						const result = validateInput();
						if (result) {
							submitRegistration();
						}
					}}
				>
					Send Activation Link
				</Button>
				{msgBox}
			</Container>
		</>
	);
}
