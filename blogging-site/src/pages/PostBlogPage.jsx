import {
	Add,
	ArrowDownward,
	ArrowUpward,
	Book,
	Delete,
	DeleteForever,
	DeleteOutline,
	DownhillSkiing,
	DragHandle,
	RemoveRedEye,
	Upload,
	ViewAgenda,
	ViewArray,
} from "@mui/icons-material";
import {
	Box,
	Button,
	IconButton,
	Input,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";
import useUserInfo from "./hooks/useUserInfo";
import useShowMessage from "./hooks/useShowMessage";
import axiosConfig from "../components/AxiosConfig";

function handleDelete(key, setFields) {
	setFields((f) => {
		const newFields = [];
		f.forEach((i, e) => {
			if (i.props.index !== key) {
				newFields.push(i);
			}
		});

		return newFields;
	});
}
function movePost(index, goDown, setFields) {
	setFields((f) => {
		for (let i = 0; i < f.length; ++i) {
			if (f[i].props.index == index) {
				if ((i == 0 && !goDown) || (i == f.length - 1 && goDown)) return f;
				if (!goDown) [f[i - 1], f[i]] = [f[i], f[i - 1]];
				else[f[i + 1], f[i]] = [f[i], f[i + 1]];
				break;
			}
		}
		f = [...f];

		return f;
	});
}
export default function PostBlogPage() {
	function Subdivision({ index = 0, preSetData }) {
		return (
			<Box width={"100%"} margin={"10px"}>
				<Box width={"100%"} display={"flex"} alignItems={"center"}>
					<TextField
						inputProps={{ style: { fontSize: "1.5em" } }}
						variant="standard"
						placeholder="Subheading"
						fullWidth
						defaultValue={preSetData ? preSetData.subtitle : ""}
						sx={{
							marginBottom: "5px",
							input: { fontFamily: "Barlow Condensed" },
						}}
						id={`blog-section-subtitle-${index}`}
					/>
					<IconButton
						onClick={() => {
							movePost(index, true, setFields);
						}}
					>
						<ArrowDownward />
					</IconButton>
					<IconButton
						onClick={() => {
							movePost(index, false, setFields);
						}}
					>
						<ArrowUpward />
					</IconButton>
					<IconButton
						onClick={() => {
							handleDelete(index, setFields);
						}}
					>
						<DeleteOutline />
					</IconButton>
				</Box>
				<Box>
					<TextField
						InputProps={{ disableUnderline: true }}
						id={`blog-section-content-${index}`}
						defaultValue={preSetData ? preSetData.body : ""}
						multiline
						fullWidth
						variant="filled"
						placeholder="Enter text"
					/>
				</Box>
			</Box>
		);
	}
	// const [blogId, setBlogId] = useState();

	const [data, setData] = useState();
	const params = useParams();
	useEffect(() => {
		const blogId = params.blogId;
		if (blogId) {
			axiosConfig
				.get(`/blogs/${blogId}`)
				.then((res) => {
					console.log(res.data);
					setData(res.data);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}, [params]);

	// console.log(blogId);

	const titleRef = useRef(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const [fields, setFields] = useState([<Subdivision key={0} index={0} />]);
	const [msgBox, showMessage] = useShowMessage();
	const { user, isLoading } = useUserInfo(true);
	useEffect(() => {
		if (!user && !isLoading) {
			navigate("/login");
		}
	}, [isLoading, user]);
	useEffect(() => {
		if (data) {
			setFields(() => {
				const map = data.content.map((c, i) => {
					return <Subdivision preSetData={c} index={i} key={i} />;
				});
				return map;
			});
		}
	}, [data]);

	return (
		<section>
			<Box padding={"5%"} sx={{ objectFit: "contain" }}>
				<div key={data ? data.title : ""}>
					<TextField
						fullWidth
						inputRef={titleRef}
						defaultValue={data ? data.title : ""}
						placeholder="Title"
						inputProps={{ style: { fontSize: "2em" } }}
						sx={{
							color: theme.palette.primary.main,
							marginBottom: "20px",

							input: { fontFamily: "Barlow Condensed" },
						}}
					/>
				</div>

				<Box
					display="flex"
					flexDirection={"column"}
					alignItems={"center"}
					width={"100%"}
					height={"100%"}
				>
					{fields}
					<IconButton
						onClick={() => {
							setFields((f) => {
								let newInd = 0;
								if (f.length)
									newInd =
										Math.max(
											...f.map((e) => {
												return e.props.index;
											})
										) + 1;
								f = [...f, <Subdivision key={newInd} index={newInd} />];

								return f;
							});
						}}
					>
						<Add />
					</IconButton>
				</Box>
			</Box>
			<Box
				padding={"10px"}
				display={"flex"}
				alignItems={"center"}
				flexDirection={"column"}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						//first get all the content
						const data = { title: titleRef.current.value.trim(), content: [] };
						fields.forEach((e) => {
							const subtitle = document
								.getElementById(`blog-section-subtitle-${e.props.index}`)
								.value.trim();
							const body = document
								.getElementById(`blog-section-content-${e.props.index}`)
								.value.trim();
							data.content.push({ subtitle, body });
						});

						//now validate the content
						//title validation
						if (data.title.length == 0) {
							titleRef.current.focus();
							return showMessage("Title cannot be empty!", "error");
						}
						//content validation
						//minimum length of total content must be 200 words
						let cnt = 0;
						data.content.forEach((p) => {
							cnt += p.body.length;
						});
						if (cnt < 1000) {
							return showMessage(
								"Content too short! Content must be atleast 1000 characters. ",
								"error"
							);
						}

						//if post
						if (!params.blogId) {
							axiosConfig
								.post("/blogs", data)
								.then((res) => {
									navigate(`../blogs/${res.data}`);
								})
								.catch((e) => {
									alert("Error: " + e);
								});
						} else {
							axiosConfig
								.put(
									`/blogs/${params.blogId}/edit`,
									data
								)
								.then((res) => {
									navigate(`../blogs/${res.data}`);
								})
								.catch((e) => {
									alert("Error: " + e);
								});
						}
					}}
				>
					{params.blogId ? "UPDATE" : "POST"}
					<Upload sx={{ ml: "5px" }} />
				</Button>
			</Box>
			{msgBox}
		</section>
	);
}
