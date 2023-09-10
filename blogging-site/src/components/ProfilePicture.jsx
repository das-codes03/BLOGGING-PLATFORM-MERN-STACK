import { Edit } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	Input,
	Typography,
} from "@mui/material";
import { useRef, useState } from "react";

export default function ProfilePicture({ src, maxHeight }) {
	return (
		<>
			<div style={{ position: "relative" }}>
				<img
					src={src}
					style={{
						width: "100%",
						borderRadius: "20%",
						border: "solid black 5px",
						aspectRatio: 1,
						objectFit: "cover",
						maxHeight: maxHeight,
					}}
				/>
			</div>
		</>
	);
}
