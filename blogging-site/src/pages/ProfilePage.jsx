import { Box, Button, Divider, Typography, useMediaQuery } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";

import EditProfilePic from "../components/EditProfilePic";
import ProfilePicture from "../components/ProfilePicture";
import useUserInfo from "./hooks/useUserInfo";
import BlogSearchSection from "./BlogsSearchSection";
import { useTheme } from "@emotion/react";
import axiosConfig from "../components/AxiosConfig";

export default function ProfilePage() {
	const { username } = useParams();
	const [userInfo, setUserInfo] = useState();
	const { user } = useUserInfo();
	const nav = useNavigate();
	useEffect(() => {
		axiosConfig
			.get(`/users/${username}`)
			.then((res) => {
				setUserInfo(res.data);
			})
			.catch(() => { });
	}, []);
	useEffect(() => { }, [user]);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	return (
		<>
			{userInfo && (
				<Box
					alignSelf={"center"}
					maxWidth={"1200px"}
					display={"grid"}
					gridTemplateColumns={isSmallScreen ? "1fr" : "1fr 3fr"}
				>
					<Box
						position={isSmallScreen ? "" : "sticky"}
						top={"100px"}
						height={"0"}
						padding={"2em"}
						display={"flex"}
						flexDirection={"column"}
					>
						<Box width={"50%"} alignSelf={"center"}>
							{userInfo.profilePic && (
								<ProfilePicture src={userInfo.profilePic} />
							)}
						</Box>

						<Box display={"flex"} flexDirection={"column"}>
							<Typography
								fontWeight={"bold"}
								fontFamily={"Barlow Condensed"}
								fontSize={"2em"}
							>
								{userInfo.displayName}
							</Typography>
							<Typography
								color={"textSecondary"}
								fontFamily={"Barlow Condensed"}
								fontSize={"1em"}
							>
								@{userInfo.username}
							</Typography>
							<Typography
								marginTop={"20px"}
								fontSize={"0.75em"}
								color={"textSecondary"}
								fontFamily={"Roboto"}
								fontWeight={"bold"}
								style={{ whiteSpace: "pre-line" }}
							>
								{userInfo.bio}
							</Typography>
							<div style={{ display: "flex", alignItems: "center" }}>
								{userInfo.username == (user || {}).username ? (
									<Button
										color="info"
										size="small"
										variant="outlined"
										onClick={() => {
											nav("/editprofile");
										}}
										sx={{ marginTop: "20px" }}
									>
										Edit Profile
									</Button>
								) : null}
							</div>
						</Box>
					</Box>
					<Box display={"flex"} flexDirection={"column"}>
						<Typography
							marginTop={"10px"}
							marginBottom={"10px"}
							fontSize={"20px"}
							fontWeight={"bold"}
							fontFamily={"Barlow Condensed"}
							textAlign={"center"}
						>
							Blogs by {userInfo.displayName}
						</Typography>
						<Divider />
						<Box marginTop={"10px"} padding={"10px"}>
							<BlogSearchSection userId={userInfo.userId} />
						</Box>
					</Box>
				</Box>
			)}
		</>
	);
}
