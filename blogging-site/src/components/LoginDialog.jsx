import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginDialog({ onClose, open }) {
	const [isOpen, setOpen] = useState(open);
	const nav = useNavigate();

	return (
		<Dialog open={open}>
			<DialogTitle>Login Required</DialogTitle>
			<DialogContent>
				<Typography>You must be logged in to perform this action!</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						nav("/login");
					}}
				>
					Go to login
				</Button>
				<Button
					onClick={() => {
						setOpen(false);
						onClose && onClose();
					}}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
