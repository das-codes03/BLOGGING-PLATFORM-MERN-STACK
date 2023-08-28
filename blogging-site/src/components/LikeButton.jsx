import {
	Favorite,
	FavoriteBorderOutlined,
	FavoriteOutlined,
	HeartBroken,
	LogoDev,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import useUserInfo from "../pages/hooks/useUserInfo";
import LoginDialog from "./LoginDialog";

export default function LikeButton({
	isLiked,
	onSuccess,
	likeCount,
	likeURL,
	unlikeURL,
}) {
	useEffect(() => {
		setIsLiked(isLiked);
		setLikeCount(likeCount);
	}, [isLiked, likeCount]);
	const [likeState, setIsLiked] = useState(false);
	const [likeCountState, setLikeCount] = useState(0);
	const [loginPrompt, setLoginPrompt] = useState(false);
	const { user } = useUserInfo();
	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			<IconButton
				onClick={() => {
					if (!user) return setLoginPrompt(true);
					axios.post(likeState ? unlikeURL : likeURL).then(() => {
						setIsLiked((l) => {
							onSuccess && onSuccess();
							setLikeCount((c) => {
								return l ? c - 1 : c + 1;
							});
							return !l;
						});
					});
				}}
			>
				{likeState ? (
					<FavoriteOutlined sx={{ color: "red" }} />
				) : (
					<FavoriteBorderOutlined />
				)}
			</IconButton>
			{likeCountState && <Typography>{`${likeCountState}`}</Typography>}
			<LoginDialog open={loginPrompt} onClose={() => setLoginPrompt(false)} />
		</div>
	);
}
