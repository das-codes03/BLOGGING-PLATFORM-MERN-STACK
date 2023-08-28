import {
	Add,
	ArrowDownward,
	ArrowUpward,
	Book,
	Delete,
	DeleteForever,
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
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router";
import useUserInfo from "./hooks/useUserInfo";

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
				else [f[i + 1], f[i]] = [f[i], f[i + 1]];
				break;
			}
		}
		f = [...f];
		console.log(f);
		return f;
	});
}
export default function PostBlogPage() {
	function Subdivision({ index = 0, getData }) {
		return (
			<Box width={"100%"} margin={"10px"}>
				<Box width={"100%"} display={"flex"}>
					<Input
						placeholder="No subtitle..."
						fullWidth
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
						<Delete />
					</IconButton>
				</Box>
				<Box>
					<TextField
						id={`blog-section-content-${index}`}
						multiline
						fullWidth
						placeholder="Enter text"
					/>
				</Box>
			</Box>
		);
	}

	const editorRef = useRef(null);
	const titleRef = useRef(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const [fields, setFields] = useState([<Subdivision key={0} index={0} />]);
	const fieldRef = useRef();
	const { user, isLoading } = useUserInfo();
	useEffect(() => {
		if (!user && !isLoading) {
			navigate("/login");
		}
	}, [isLoading, user]);

	return (
		<section>
			<Box padding={"10px"} sx={{ objectFit: "contain" }}>
				<Typography>Start Blogging!</Typography>
				<Input
					fullWidth
					inputRef={titleRef}
					placeholder="Title"
					sx={{
						color: theme.palette.primary.main,
						fontSize: "2em",
						fontFamily: "sans-serif",
					}}
				/>

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
								console.log(f);
								return f;
							});
						}}
					>
						<Add />
					</IconButton>
				</Box>
			</Box>
			<Box padding={"10px"}>
				<Button
					onClick={() => {
						//first get all the content
						const data = { title: titleRef.current.value, content: [] };
						fields.forEach((e) => {
							const subtitle = document.getElementById(
								`blog-section-subtitle-${e.props.index}`
							).value;
							const body = document.getElementById(
								`blog-section-content-${e.props.index}`
							).value;
							data.content.push({ subtitle, body });
						});
						console.log(data);
						axios
							.post("http://localhost:3000/api/blogs", data)
							.then((res) => {
								navigate(`../blogs/${res.data._id}`);
							})
							.catch((e) => {
								alert("Error: " + e);
							});
					}}
				>
					POST
					<Upload sx={{ ml: "5px" }} />
				</Button>
				<Button
					onClick={() => {
						axios.get("http://localhost:3000/api/post/10").then((res) => {
							console.log(res.data);
						});
					}}
				>
					Preview
					<RemoveRedEye sx={{ ml: "5px" }} />
				</Button>
			</Box>
		</section>
	);
}
