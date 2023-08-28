import { Box, Button, Input, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import EditProfilePic from "../components/EditProfilePic";
import useNameValidator from "./hooks/useNameValidator";
import useShowMessage from "./hooks/useShowMessage";

export default function EditProfileForm() {
	const [sensitiveInfo, setUserInfo] = useState();
	const editProfileRef = useRef();
	const displayNameRef = useRef();
	const bioRef = useRef();

	useEffect(() => {
		axios
			.get(`http://localhost:3000/api/users/me/getInfo`)
			.then((res) => {
				console.log(res.data);
				setUserInfo(res.data);
			})
			.catch(() => {});
	}, []);
	const [msgBox, showMessage] = useShowMessage();
	function Update() {
		axios
			.patch(`http://localhost:3000/api/users/id/${sensitiveInfo.userId}`, {
				bio: bioRef.current.value,
				displayName: displayNameRef.current.value,
				profilePic: sensitiveInfo.newProfilePic,
			})
			.then((res) => {
				showMessage("Profile has been updated!", "success");
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
	function validateInput() {}
	return (
		<>
			{msgBox}
			{sensitiveInfo && (
				<Box
					padding={"20px"}
					display={"flex"}
					flexDirection={"column"}
					alignItems={"center"}
					gap={"20px"}
				>
					<Typography fontSize={"2em"}>Edit Profile</Typography>
					<Box maxWidth={"200px"}>
						<EditProfilePic
							setData={setUserInfo}
							src={sensitiveInfo.profilePic}
						/>
						{sensitiveInfo.imageData && (
							<Button
								onClick={() => {
									setUserInfo((i) => {
										return { ...i, profilePic: null, imageData: null };
									});
								}}
							>
								Remove profile picture
							</Button>
						)}
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
							defaultValue={sensitiveInfo.displayName}
							label={"Display Name"}
							fullWidth
						/>

						<TextField
							inputRef={bioRef}
							label="Bio"
							defaultValue={sensitiveInfo.bio}
							fullWidth
							multiline
						/>
						<TextField
							value={sensitiveInfo.username}
							label={"Username"}
							fullWidth
							disabled
						/>
						<TextField
							value={sensitiveInfo.email}
							label={"Email"}
							fullWidth
							disabled
						/>
					</Box>
					<Box>
						<Button
							onClick={() => {
								Update();
							}}
						>
							Update!
						</Button>
						<Button
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
}
