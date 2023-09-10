import { Box, Button, Paper, Typography } from "@mui/material";
import ProfilePicture from "./ProfilePicture";
import { useNavigate } from "react-router";
import "../app.css";
export default function AboutAuthorCard({
	displayName,
	bio,
	profilePic,
	username,
}) {
	const nav = useNavigate();
	return (
		<Box maxWidth="600px" width="100%">
			<Paper
				onClick={() => {
					nav(`/user/${username}`);
				}}
				sx={{
					margin: "20px",
					padding: "30px",

					cursor: "pointer",
				}}
			>
				<Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
					<Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
						<Typography marginBottom={"10px"}>About the author</Typography>
						<Box>
							<ProfilePicture maxHeight={"100px"} src={profilePic} />
						</Box>
						<Typography
							fontWeight={"bold"}
							color={"textPrimary"}
							fontSize={"20px"}
							fontFamily={"Barlow Condensed"}
						>
							{displayName}
						</Typography>
						<Typography color={"textSecondary"}>@{username}</Typography>
						<Typography
							fontSize={"15px"}
							fontFamily={"Roboto"}
							fontWeight={"bold"}
							marginTop={"20px"}
						>
							{bio}
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}
