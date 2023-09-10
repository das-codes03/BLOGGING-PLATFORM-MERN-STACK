import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import useBlogSearch from "./hooks/useBlogSearch";
import { useCallback, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import { Masonry } from "@mui/lab";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";

export default function BlogSearchSection({ userId }) {
	const [pageno, setPageNo] = useState(0);

	const { blogs, isLoading, hasMore } = useBlogSearch(pageno, userId);
	const observer = useRef();

	const lastElementRef = useCallback(
		(node) => {
			//if loading return
			if (isLoading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) setPageNo((s) => s + 1);
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);
	const blogcards = blogs.map((b, i) => {
		//Next batch of blogs start loading earlier.
		//Example: offset = 5 means next batch loads when 5th blog from the end appears in viewport
		const preLoadOffset = 1;

		return (
			<BlogCard
				cardRef={
					i == Math.max(blogs.length - 1 - preLoadOffset, 0)
						? lastElementRef
						: null
				}
				data={b}
				key={b.blogId}
			/>
		);
	});

	const theme = useTheme();

	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
	return (
		<>
			<Masonry columns={isSmallScreen ? 1 : 2}>
				{/* List of blogs */}
				{blogcards}
				{blogcards.length == 0 ? (
					<Box display={"flex"} gap={"10px"} alignItems={"center"}>
						<Typography
							fontFamily={"Anton"}
							sx={{ whiteSpace: "nowrap" }}
							textAlign={"center"}
							fontSize={"2em"}
						>
							No blogs found
						</Typography>
						<Search fontSize="large" />
					</Box>
				) : null}
			</Masonry>
		</>
	);
}
