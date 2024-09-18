import {
	Delete,
	DeleteOutline,
	Edit,
	Report,
	Send,
	Share,
	ThumbUpAltOutlined,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Input,
	Paper,
	TextField,
	TextareaAutosize,
	Typography,
} from "@mui/material";
import CommentBox from "../components/CommentBox";
import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router";
import LikeButton from "../components/LikeButton";
import EditProfilePic from "../components/EditProfilePic";
import ProfilePicture from "../components/ProfilePicture";
import AboutAuthorCard from "../components/AboutAuthorCard";
import useUserInfo from "./hooks/useUserInfo";
import LoginDialog from "../components/LoginDialog";
import useShowMessage from "./hooks/useShowMessage";
import axiosConfig from "../components/AxiosConfig";

function ViewPort({ data }) {
	return (
		<Box
			maxWidth={"100vw"}
			sx={{ padding: "1em", margin: "1em", userSelect: "none" }}
			display={"flex"}
			alignItems={"center"}
			flexDirection={"column"}
		>
			<Box
				marginTop={"20px"}
				marginBottom={"10px"}
				borderBottom="solid"
				borderColor={"divider"}
			>
				<Typography
					fontSize={"3rem"}
					fontWeight={"bold"}
					color={"textPrimary"}
					fontFamily={"Barlow Condensed"}
					sx={{ hyphens: "auto" }}
				>
					{data.title}
				</Typography>
			</Box>
			<Typography
				marginBottom={"5px"}
				fontWeight={"bold"}
				color={"textSecondary"}
			>
				{new Date(data.createdAt).toLocaleString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric",
				})}
			</Typography>
			<Typography
				fontFamily={"Anton"}
				marginBottom={"0px"}
				color={"textSecondary"}
			>
				{data.displayName}
			</Typography>
			<Typography
				color={"textSecondary"}
				fontFamily={"Roboto"}
				marginBottom={"20px"}
				fontSize={"0.75em"}
			>
				@{data.username}
			</Typography>
			<Box maxWidth={"1000px"} alignItems={"center"}>
				{(data.content || []).map((e, i) => {
					return (
						<Box key={i} marginBottom={"30px"}>
							<Typography
								color={"textPrimary"}
								fontWeight={"bold"}
								fontSize={"1.5em"}
								marginBottom={"10px"}
								fontFamily={"Barlow condensed"}
							>
								{e.subtitle}
							</Typography>
							<Typography
								style={{
									whiteSpace: "pre-line",
									wordWrap: "break-word",
									hyphens: "initial",
								}}
								textAlign={"justify"}
								fontSize={"21px"}
								marginBottom={"20px"}
								fontFamily={"Roboto"}
								fontWeight={"bold"}
							>
								{e.body}
							</Typography>
							<Typography textAlign={"center"} color={"textSecondary"}>
								* * *
							</Typography>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}

export default function ViewBlogPage() {
	const [response, setContent] = useState({});
	const [comments, setComments] = useState([]);
	const [isLiked, setIsLiked] = useState(false);
	const navigate = useNavigate();
	const { blogId } = useParams();
	const commentRef = useRef(null);
	const [messageBox, showMessage] = useShowMessage();
	const [isOwner, setIsOwner] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [loginDialog, setLoginDialog] = useState(false);
	const deleteConfirmRef = useRef();
	const { user } = useUserInfo();

	function deleteBlog(id) {
		axiosConfig.delete(`/blogs/${id}`).then(() => {
			navigate("/");
		});
	}

	useEffect(() => {
		axiosConfig
			.get(`/blogs/${blogId}`)
			.then((e) => {
				setContent((d) => {
					return { ...e.data };
				});
				setIsLiked(e.data.hasLiked);
			})
			.catch(() => {
				navigate("/error/blognotfound");
			});

		axiosConfig
			.get(`/blogs/${blogId}/comments`)
			.then((e) => {
				setComments(() => {
					return e.data;
				});
			})
			.catch(() => { });
	}, []);
	useEffect(() => {
		if (!response || !user) return;
		if (response.username == (user || {}).username) {
			setIsOwner(true);
		}
	}, [user, response]);
	const commentCards = [];
	comments.forEach((c) => {
		commentCards.push(
			<CommentBox
				data={{ ...c, blogId: blogId }}
				onDelete={() => {
					deleteComment(c.commentId);
				}}
				sendComment={sendComment}
				key={c.commentId}
			/>
		);
	});
	function sendComment(replyTo, content) {
		if (!user) return setLoginDialog(true);
		axiosConfig
			.post(
				`/blogs/${blogId}/comments/${replyTo || ""}`,
				{
					content: content,
				}
			)
			.then((res) => {
				commentRef.current.value = "";
				console.log(res.data);
				axiosConfig
					.get(`/blogs/${blogId}/comments/${res.data}`)
					.then((res2) => {
						if (res2.data.repliedToId) return;
						setComments((c) => {
							return [res2.data, ...c];
						});
					});
				showMessage("Comment posted successfully!", "success");
			})
			.catch((e) => {
				showMessage("Couldn't post comment", "error");
			});
	}
	function deleteComment(id) {
		axiosConfig
			.delete(`/blogs/${blogId}/comments/${id}`)
			.then(() => {
				setComments((c) => {
					return c.filter((e) => {
						return e.commentId != id;
					});
				});
			})
			.catch(() => { });
	}
	return (
		<>
			<LoginDialog open={loginDialog} onClose={() => setLoginDialog(false)} />
			<Box
				maxWidth={"100vw"}
				display={"flex"}
				flexDirection={"column"}
				alignItems={"center"}
			>
				<ViewPort data={response}></ViewPort>
				<Box display="flex" alignItems="center" gap="30px">
					<LikeButton
						isLiked={isLiked}
						likeCount={response.likeCount}
						likeURL={`/blogs/${blogId}/like`}
						unlikeURL={`/blogs/${blogId}/unlike`}
						onClick={() => {
							axiosConfig
								.post(
									`/blogs/${blogId}/${response.hasLiked ? "unlike" : "like"
									}`
								)
								.then(() => {
									setContent((c) => {
										return {
											...c,
											hasLiked: !response.hasLiked,
											likeCount: c.likeCount + (c.hasLiked ? -1 : 1),
										};
									});
								});
						}}
					/>

					{isOwner && (
						<>
							<IconButton onClick={() => setDeleteDialog(true)}>
								<DeleteOutline />
							</IconButton>
							<IconButton
								onClick={() => {
									navigate("edit");
								}}
							>
								<Edit />
							</IconButton>
						</>
					)}
				</Box>
				<AboutAuthorCard
					bio={response.bio}
					username={response.username}
					profilePic={response.profilePic}
					displayName={response.displayName}
				/>

				<Box width={"100%"} maxWidth={"700px"}>
					<div style={{ display: "flex" }}>
						<TextField
							placeholder="Add a comment"
							inputRef={commentRef}
							sx={{ width: "100%", margin: "10px" }}
							multiline
						/>
						<IconButton
							onClick={() => {
								sendComment(null, commentRef.current.value);
							}}
						>
							<Send />
						</IconButton>
					</div>
				</Box>
				<Typography fontFamily={"anton"}>Comments</Typography>
				<Box
					maxWidth={"1000px"}
					width={"100%"}
					display={"flex"}
					flexDirection={"column"}
				>
					{commentCards.length ? (
						commentCards
					) : (
						<Typography alignSelf={"center"}>
							Be the first one to comment!
						</Typography>
					)}
				</Box>
				<Dialog open={deleteDialog}>
					<DialogTitle color={"error"}>
						Caution: Unpublishing Ahead!
					</DialogTitle>
					<DialogContent>
						<Typography>
							With a click, your blog post can join the ranks of vanished
							civilizations. Are you the enigmatic magician behind this
							disappearance, or could the pages of your creation still find a
							home in the library of the internet?
						</Typography>
						<Typography color={"error"}>
							Note: you cannot UNDO this action
						</Typography>
						<Input
							inputRef={deleteConfirmRef}
							placeholder={`Type 'delete' to confirm`}
						/>
						<Button
							color="warning"
							onClick={() => {
								if (deleteConfirmRef.current.value != "delete") {
									deleteConfirmRef.current.focus();
									return;
								}
								//now handle delete
								deleteBlog(response.blogId);
							}}
						>
							Delete
						</Button>
						<Button
							onClick={() => {
								setDeleteDialog(false);
							}}
						>
							Cancel
						</Button>
					</DialogContent>
				</Dialog>
				{messageBox}
			</Box>
		</>
	);
}
