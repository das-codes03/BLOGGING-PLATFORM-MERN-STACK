import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import EditProfilePic from "../components/EditProfilePic";
import ProfilePicture from "../components/ProfilePicture";
import useUserInfo from "./hooks/useUserInfo";
import BlogSearchSection from "./BlogsSearchSection";

export default function ProfilePage() {
	const { username } = useParams();
	const [userInfo, setUserInfo] = useState();
	const { user } = useUserInfo();
	const nav = useNavigate();
	useEffect(() => {
		axios
			.get(`http://localhost:3000/api/users/${username}`)
			.then((res) => {
				setUserInfo(res.data);
			})
			.catch(() => {});
	}, []);
	useEffect(() => {}, [user]);
	return (
		<>
			{userInfo && (
				<section style={{ height: "100%" }}>
					<Box display={"flex"} height={"100%"}>
						<Box
							position={"sticky"}
							top={"0"}
							bottom={"50%"}
							padding={"2em"}
							display={"flex"}
							width={"30%"}
							flexDirection={"column"}
							height={"100%"}
						>
							{userInfo.profilePic && (
								<ProfilePicture src={userInfo.profilePic} />
							)}

							<Box height={"100%"} display={"flex"} flexDirection={"column"}>
								<Typography fontSize={"2em"}>{userInfo.displayName}</Typography>
								<Typography fontSize={"0.75em"} color={"secondary"}>
									{userInfo.bio}
								</Typography>
								<div style={{ display: "flex", alignItems: "center" }}>
									{userInfo.username == (user || {}).username ? (
										<Button
											onClick={() => {
												nav("/editprofile");
											}}
										>
											Edit Profile
										</Button>
									) : null}
								</div>
							</Box>
						</Box>
						<Box
							overflow={"auto"}
							display={"flex"}
							flexDirection={"column"}
							width={"70%"}
						>
							<BlogSearchSection userId={userInfo.userId} />
						</Box>
					</Box>
				</section>
			)}
		</>
	);
}
