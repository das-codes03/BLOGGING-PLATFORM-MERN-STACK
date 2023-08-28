import { Box, Button, Typography } from "@mui/material";

export default function BlogNotFoundPage() {
	return (
		<Box
			height={"50vh"}
			display={"flex"}
			alignItems={"center"}
			justifyContent={"center"}
			flexDirection={"column"}
			textAlign={"center"}
		>
			<img height={"100px"} src="/src/assets/catimage.png"></img>
			<Typography fontSize={"3em"} color={"error"}>
				BLOG NOT FOUND
			</Typography>
			<Typography margin={"20px"}>
				404: Blog not Found 📚🔎: It seems this page's ink has faded into the
				pixels of cyberspace, leaving behind an empty parchment of thoughts.
			</Typography>
			<Button>Go to HOME</Button>
		</Box>
	);
}
