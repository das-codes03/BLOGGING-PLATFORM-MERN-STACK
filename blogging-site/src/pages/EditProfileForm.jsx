import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import EditProfilePic from "../components/EditProfilePic";
import useNameValidator from "./hooks/useNameValidator";
import useShowMessage from "./hooks/useShowMessage";
import useUserInfo from "./hooks/useUserInfo";
import { useNavigate } from "react-router";
import axiosConfig from "../components/AxiosConfig";
// import "../app.css";
export default function EditProfileForm() {
	const { user, isLoading } = useUserInfo();
	const [editedInfo, setEditedInfo] = useState({});
	const editProfileRef = useRef();
	const displayNameRef = useRef();
	const bioRef = useRef();
	const navigate = useNavigate();

	const [msgBox, showMessage] = useShowMessage();
	function Update() {
		axiosConfig
			.patch(`/users/`, {
				bio: bioRef.current.value,
				displayName: displayNameRef.current.value,
				profilePic: editedInfo.newProfilePic,
			})
			.then((res) => {
				showMessage("Profile has been updated!", "success");
				navigate(`/user/${user.username}`);
			})
			.catch((e) => {
				showMessage(
					e.response
						? e.response.data
						: "Couldn't connect to server. Please check your internet connection and try again.",
					"error"
				);
			});
	}

	const nameValidator = useNameValidator(displayNameRef);
	function validateInput() { }
	if (isLoading) return null;
	if (user)
		return (
			<>
				{msgBox}
				{user && (
					<Box
						padding={"20px"}
						display={"flex"}
						flexDirection={"column"}
						alignItems={"center"}
						gap={"20px"}
					>
						<Typography fontFamily={"anton"} fontSize={"2em"}>
							Edit Profile
						</Typography>
						<Box maxWidth={"200px"}>
							<EditProfilePic setData={setEditedInfo} src={user.profilePic} />
						</Box>
						<Box
							display={"flex"}
							flexDirection={"column"}
							alignItems={"center"}
							gap={"20px"}
							width={"100%"}
							maxWidth={"500px"}
						>
							<TextField
								inputRef={displayNameRef}
								onChange={nameValidator}
								defaultValue={user.displayName}
								label={"Display Name"}
								fullWidth
							/>

							<TextField
								inputRef={bioRef}
								label="Bio"
								defaultValue={user.bio}
								fullWidth
								multiline
							/>
							<TextField
								value={user.username}
								label={"Username"}
								fullWidth
								disabled
							/>
							<TextField
								value={user.email}
								label={"Email"}
								fullWidth
								disabled
							/>
						</Box>
						<Box gap={"10px"} display={"flex"}>
							<Button
								color="success"
								variant="contained"
								onClick={() => {
									Update();
								}}
							>
								Update!
							</Button>
							<Button
								color="error"
								variant="outlined"
								onClick={() => {
									window.location.reload();
								}}
							>
								Reset
							</Button>
						</Box>
					</Box>
				)}
			</>
		);
	else return navigate("/login");
}
