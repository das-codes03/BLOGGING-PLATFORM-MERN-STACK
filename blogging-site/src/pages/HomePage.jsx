import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import BlogCard from "../components/BlogCard";
import { Search, SearchOff } from "@mui/icons-material";

import { useCallback, useEffect, useRef, useState } from "react";

import useBlogSearch from "./hooks/useBlogSearch";
import BlogSearchSection from "./BlogsSearchSection";

export default function HomePage() {
	// const [blogs, setBlogs] = useState([]);
	// const [pageno, setPageNo] = useState(0);
	// const { blogs, isLoading, hasMore } = useBlogSearch(pageno);

	// const observer = useRef();

	// const lastElementRef = useCallback(
	// 	(node) => {
	// 		//if loading return
	// 		if (isLoading) return;

	// 		if (observer.current) observer.current.disconnect();

	// 		observer.current = new IntersectionObserver((entries) => {
	// 			if (entries[0].isIntersecting && hasMore) setPageNo((s) => s + 1);
	// 		});
	// 		if (node) observer.current.observe(node);
	// 	},
	// 	[isLoading, hasMore]
	// );

	return (
		<>
			<Box
				width={"100%"}
				height={"100%"}
				padding={"1em"}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				maxWidth={"1200px"}
				flexDirection={"column"}
				alignSelf={"center"}
			>
				{/* <FormControl>
						<InputLabel id="demo-simple-select-label">Sort by</InputLabel>
						<Select
							variant="standard"
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={10}
							label="Sort by"
							onChange={null}
						>
							<MenuItem value={10}>Newest First</MenuItem>
							<MenuItem value={20}>Top Rated</MenuItem>
							<MenuItem value={30}>Hot</MenuItem>
						</Select>
					</FormControl>
					<TextField label="Search" variant="standard" sx={{ width: "50%" }} />
					<IconButton sx={{ width: "2em", height: "2em" }}>
						<Search />
					</IconButton> */}
				<Typography fontSize={"2em"} marginBottom={"10px"} fontFamily={"Anton"}>
					Latest posts 🔍
				</Typography>
				<BlogSearchSection />
			</Box>
		</>
	);
}
