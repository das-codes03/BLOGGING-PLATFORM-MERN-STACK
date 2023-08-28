import { Box, Button, Paper, Typography } from "@mui/material";
import ProfilePicture from "./ProfilePicture";
import { useNavigate } from "react-router";

export default function AboutAuthorCard({
	displayName,
	bio,
	profilePic,
	username,
}) {
	const nav = useNavigate();
	return (
		<Paper
			sx={{
				margin: "20px",
				maxWidth: "1000px",
				padding: "30px",
				borderRadius: "30px",
			}}
		>
			<Typography
				color={"secondary"}
				marginBottom={"10px"}
				textAlign={"center"}
			>
				About the author
			</Typography>

			<Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
				<Box>
					<ProfilePicture maxHeight={"100px"} src={profilePic} />
				</Box>
				<Box>
					<Typography color={"primary"} fontSize={"20px"}>
						{displayName}
					</Typography>
					<Typography color={"grey"}>@{username}</Typography>
					<Typography fontSize={"15px"}>{bio}</Typography>
					<Button
						onClick={() => {
							nav(`/user/${username}`);
						}}
					>
						View Profile
					</Button>
				</Box>
			</Box>
		</Paper>
	);
}
