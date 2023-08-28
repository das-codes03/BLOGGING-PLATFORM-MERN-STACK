import {
	ArrowUpwardTwoTone,
	Cancel,
	Delete,
	DeleteOutline,
	Reply,
	Send,
	ThumbDown,
	ThumbDownAltOutlined,
	ThumbUpAlt,
	ThumbUpAltOutlined,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	Input,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import LikeButton from "./LikeButton";
import { useEffect, useRef, useState } from "react";

export default function CommentBox({ data, onDelete, sendComment }) {
	console.log(data);
	const [replyInputOpen, setReplyInput] = useState(false);
	const [replies, setReplies] = useState([]);
	const [repliesOpen, setRepliesOpen] = useState(false);
	const contentRef = useRef();

	useEffect(() => {
		if (!repliesOpen) {
			setReplies([]);
			return;
		}

		axios
			.get(
				`http://localhost:3000/api/blogs/${data.blogId}/comments/${data.commentId}/replies`
			)
			.then((res) => {
				setReplies((reps) => {
					return res.data;
				});
			});
	}, [repliesOpen]);
	const replycards = replies.map((r) => {
		console.log(r);
		return (
			<CommentBox
				data={r}
				onDelete={() => {}}
				key={r.commentId}
				sendComment={sendComment}
			/>
		);
	});
	return (
		<Box marginLeft={data.repliedToId ? "50px" : 0}>
			<Card sx={{ margin: "10px", padding: "10px" }}>
				<CardContent>
					<Box
						display={"flex"}
						alignItems={"center"}
						gap={"10px"}
						marginBottom={"10px"}
					>
						<Avatar
							src={data.profilePic}
							sx={{ height: "1.5em", width: "1.5em" }}
						></Avatar>
						<a href={`../user/${data.username}`}>
							<Box display={"flex"} gap={"10px"}>
								<Typography color={"secondary"}>{data.displayName}</Typography>
								<Typography> @{data.username}</Typography>
							</Box>
						</a>
					</Box>
					<Typography>{data.content}</Typography>
				</CardContent>
				<CardActions>
					<LikeButton
						isLiked={data.hasLiked}
						likeCount={data.likeCount}
						likeURL={`http://localhost:3000/api/blogs/${data.blogId}/comments/${data.commentId}/like`}
						unlikeURL={`http://localhost:3000/api/blogs/${data.blogId}/comments/${data.commentId}/unlike`}
					/>

					{(JSON.parse(localStorage.getItem("auth")) || {}).userId ===
					data.userId ? (
						<IconButton onClick={onDelete}>
							<DeleteOutline />
						</IconButton>
					) : null}
					<IconButton
						onClick={() => {
							setReplyInput((r) => !r);
						}}
					>
						{!replyInputOpen ? <Reply /> : <Cancel />}
					</IconButton>
					{!data.repliedToId && (
						<Button
							onClick={() => {
								setRepliesOpen((c) => !c);
							}}
						>
							{data.replyCount} Replies
						</Button>
					)}
				</CardActions>
			</Card>
			{replyInputOpen && (
				<Box>
					<Typography>Replying to {"User"}'s comment</Typography>
					<Box display={"flex"} alignItems={"end"}>
						<TextField
							inputRef={contentRef}
							fullWidth
							placeholder="Reply"
							multiline
						></TextField>
						<IconButton
							onClick={() =>
								sendComment(data.commentId, contentRef.current.value)
							}
						>
							<Send />
						</IconButton>
					</Box>
				</Box>
			)}
			{replycards}
		</Box>
	);
}
