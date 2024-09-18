import {
	AspectRatio,
	ThumbUp,
	ThumbUpAlt,
	ThumbUpOutlined,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	ClickAwayListener,
	Icon,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import LikeButton from "./LikeButton";
import { useNavigate } from "react-router";

export default function BlogCard({ data, cardRef }) {
	const navigate = useNavigate();
	return (
		<Paper
			ref={cardRef}
			bgcolor={"paper"}
			sx={{
				padding: "10px",
			}}
		>
			<Box sx={{ padding: "0" }}>
				<Box display={"flex"} flexDirection={"column"}>
					<Box display={"flex"} alignItems={"center"}>
						<Avatar
							sx={{ margin: "10px", height: "1.00em", width: "1.00em" }}
							src={data.profilePic}
						/>
						<Typography
							onClick={() => {
								navigate(`/user/${data.username}`);
							}}
							sx={{ cursor: "pointer" }}
							fontWeight={"bold"}
							fontFamily={"Barlow Condensed"}
							fontSize={"1.00em"}
							color={"textSecondary"}
						>
							{data.displayName || "anonymous"}
						</Typography>
					</Box>

					<Box display="flex" flexDirection="column">
						<Typography
							marginRight={"15px"}
							marginLeft={"15px"}
							fontSize={"30px"}
							color={"textPrimary"}
							fontWeight={"bold"}
							fontFamily={"Roboto condensed"}
							sx={{ hyphens: "auto" }}
						>
							<a
								href={`/blogs/${data.blogId}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								{data.title}
							</a>
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box>
				<Box paddingLeft={"30px"} display={"flex"} alignItems={"center"}>
					<Typography
						paddingRight={"20px"}
						fontWeight={"bold"}
						fontSize={"0.75em"}
					>
						{new Date(data.createdAt).toLocaleString("en-GB", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</Typography>
					<LikeButton
						isLiked={data.hasLiked}
						likeCount={data.likeCount}
						likeURL={`/blogs/${data.blogId}/like`}
						unlikeURL={`/blogs/${data.blogId}/unlike`}
					/>
				</Box>
			</Box>
		</Paper>
	);
}
