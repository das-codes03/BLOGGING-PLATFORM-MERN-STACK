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
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import LikeButton from "../components/LikeButton";
import EditProfilePic from "../components/EditProfilePic";
import ProfilePicture from "../components/ProfilePicture";
import AboutAuthorCard from "../components/AboutAuthorCard";
import useUserInfo from "./hooks/useUserInfo";
import LoginDialog from "../components/LoginDialog";
import useShowMessage from "./hooks/useShowMessage";

function ViewPort({ data }) {
	console.log(data);

	return (
		<Box
			sx={{ padding: "1em", margin: "1em" }}
			display={"flex"}
			alignItems={"center"}
			flexDirection={"column"}
		>
			<Box marginTop={"20px"} borderBottom="solid" borderColor={"divider"}>
				<Typography fontSize={"2rem"} color={"primary"}>
					{data.title}
				</Typography>
			</Box>
			<Typography marginBottom={"40px"}>
				Posted on {"2nd March 2023"}
			</Typography>
			<Box maxWidth={"1000px"} alignItems={"center"}>
				{(data.content || []).map((e, i) => {
					return (
						<Box key={i} marginBottom={"10px"}>
							<Typography color={"secondary"} fontStyle={"oblique"}>
								{e.subtitle}
							</Typography>
							<Typography textAlign={"justify"} fontSize={"18px"}>
								{e.body}
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
		axios.delete(`http://localhost:3000/api/blogs/${id}`).then(() => {
			console.log("deleted");
			navigate("/");
		});
	}

	useEffect(() => {
		axios
			.get(`http://localhost:3000/api/blogs/${blogId}`)
			.then((e) => {
				setContent((d) => {
					return { ...e.data };
				});
				setIsLiked(e.data.hasLiked);
			})
			.catch(() => {
				navigate("/error/blognotfound");
			});

		axios
			.get(`http://localhost:3000/api/blogs/${blogId}/comments`)
			.then((e) => {
				setComments(() => {
					return e.data;
				});
			})
			.catch(() => {});
	}, []);
	useEffect(() => {
		if (!response || !user) return;
		if (response.username == (user || {}).username) {
			setIsOwner(true);
		}
	}, [user, response]);
	const commentCards = [];
	comments.forEach((c) => {
		console.log(c);
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
		axios
			.post(
				`http://localhost:3000/api/blogs/${blogId}/comments/${replyTo || ""}`,
				{
					content: content,
				}
			)
			.then((res) => {
				commentRef.current.value = "";
				axios
					.get(`http://localhost:3000/api/blogs/${blogId}/comments/${res.data}`)
					.then((res2) => {
						setComments((c) => {
							return [res2.data, ...c];
						});
					});
				showMessage("Comment posted successfully!", "success");
			})
			.catch((e) => {
				console.log(e);
				showMessage("Couldn't post comment", "error");
			});
	}
	function deleteComment(id) {
		axios
			.delete(`http://localhost:3000/api/blogs/${blogId}/comments/${id}`)
			.then(() => {
				setComments((c) => {
					return c.filter((e) => {
						return e.commentId != id;
					});
				});
			})
			.catch(() => {});
	}
	return (
		<>
			<LoginDialog open={loginDialog} onClose={() => setLoginDialog(false)} />
			<Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
				<ViewPort data={response}></ViewPort>
				<Box display="flex" alignItems="center" gap="30px">
					<LikeButton
						isLiked={isLiked}
						likeCount={response.likeCount}
						likeURL={`http://localhost:3000/api/blogs/${blogId}/like`}
						unlikeURL={`http://localhost:3000/api/blogs/${blogId}/unlike`}
						onClick={() => {
							axios
								.post(
									`http://localhost:3000/api/blogs/${blogId}/${
										response.hasLiked ? "unlike" : "like"
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
							<Edit />
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
							sx={{ width: "100%" }}
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
				<Box maxWidth={"1000px"} width={"100%"}>
					{commentCards}
				</Box>
				<Dialog open={deleteDialog}>
					<DialogTitle color={"orange"}>
						Caution: Unpublishing Ahead!
					</DialogTitle>
					<DialogContent>
						<Typography>
							With a click, your blog post can join the ranks of vanished
							civilizations. Are you the enigmatic magician behind this
							disappearance, or could the pages of your creation still find a
							home in the library of the internet?
						</Typography>
						<Typography color={"red"}>
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
