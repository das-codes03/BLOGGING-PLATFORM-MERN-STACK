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
	CardContent,
	ClickAwayListener,
	Icon,
	IconButton,
	Typography,
} from "@mui/material";
import LikeButton from "./LikeButton";

export default function BlogCard({ data, cardRef }) {
	return (
		<div ref={cardRef}>
			<Card style={{ margin: "0.5em" }}>
				<CardContent>
					<Box display={"flex"} gap={"1em"}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5em",
								flexDirection: "column",
							}}
						>
							<Avatar src={data.profilePic}>A</Avatar>
							<LikeButton
								isLiked={data.hasLiked}
								likeCount={data.likeCount}
								likeURL={`http://localhost:3000/api/blogs/${data.blogId}/like`}
								unlikeURL={`http://localhost:3000/api/blogs/${data.blogId}/unlike`}
							/>
						</div>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<Typography fontSize={"1.5em"} color={"primary"}>
								<a
									href={`/blogs/${data.blogId}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									{data.title}
								</a>
							</Typography>

							<Typography fontSize={"0.75em"} color={"secondary"}>
								Posted by {data.displayName || "anonymous"} on {data.date}
							</Typography>
							<Typography>
								{data.description && data.description.slice(0, 200)}...
							</Typography>
						</div>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}
