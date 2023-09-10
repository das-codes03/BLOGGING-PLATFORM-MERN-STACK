import { Edit } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Input,
	Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";

export default function EditProfilePic({ src, setData }) {
	const [mouseOver, setMouseOver] = useState(false);
	const [imagePromptOpen, setImageOpen] = useState(false);
	const [imagePreview, setImagePreview] = useState(src);

	function PreviewImage(url) {
		const f = url;
		FileResizer.imageFileResizer(f, 512, 512, "JPEG", 75, 0, (compressed) => {
			setImagePreview(compressed);
			setData &&
				setData((d) => {
					const data = {
						...d,
						newProfilePic: compressed,
					};
					return data;
				});

			setImageOpen(false);
		});
	}

	function UploadImagePrompt({ open, handleClose }) {
		const inputRef = useRef();

		return (
			<>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Change Profile Picture</DialogTitle>
					<DialogContent>
						<Box display={"flex"} justifyContent={"center"}>
							{imagePreview && (
								<img
									src={imagePreview}
									style={{
										width: "200px",
										height: "200px",
										objectFit: "cover",
									}}
								/>
							)}
						</Box>
					</DialogContent>
					<DialogActions>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							onChange={(e) => {
								const f = e.currentTarget.files[0];

								PreviewImage(f);
							}}
						/>
					</DialogActions>
					<DialogActions>
						<Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
							<Button
								color="info"
								onClick={() => {
									setImageOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								color="error"
								onClick={() => {
									setImagePreview(null);
									setImageOpen(false);
									setData &&
										setData((d) => {
											const data = {
												...d,
												newProfilePic: "remove",
											};
											return data;
										});
								}}
							>
								Remove Picture
							</Button>
						</Box>
					</DialogActions>
				</Dialog>
			</>
		);
	}
	return (
		<>
			<UploadImagePrompt open={imagePromptOpen} />
			{imagePreview ? (
				<div
					onClick={() => {
						setImageOpen(true);
					}}
					style={{ position: "relative" }}
					onMouseEnter={() => setMouseOver(true)}
					onMouseLeave={() => {
						setMouseOver(false);
					}}
				>
					<img
						src={imagePreview}
						style={{
							width: "100%",
							borderRadius: "10%",
							aspectRatio: 1,
							objectFit: "cover",
							filter: `brightness(${mouseOver ? 0.25 : 1})`,
							transition: "all 0.2s",
							cursor: "pointer",
						}}
					/>
					{mouseOver && (
						<Box
							textAlign={"center"}
							position={"absolute"}
							left={0}
							right={0}
							top={"50%"}
							bottom={"50%"}
							sx={{ userSelect: "none", cursor: "pointer" }}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<Typography color={"white"}>Change Image</Typography>
							<Edit htmlColor="white" />
						</Box>
					)}
				</div>
			) : (
				<Button
					color="info"
					onClick={() => {
						setImageOpen(true);
					}}
				>
					Add a profile picture
				</Button>
			)}
		</>
	);
}
