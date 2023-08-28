import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useUserInfo from "../pages/hooks/useUserInfo";

function WebsiteLogo() {
	return (
		<>
			<Typography>Blogging Website</Typography>
		</>
	);
}

export default function NavBar() {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const { user } = useUserInfo();

	return (
		<>
			<Box
				bgcolor={"primary"}
				display={"flex"}
				justifyContent={"space-between"}
				borderBottom={"solid"}
				borderColor={"divider"}
			>
				<div style={{ display: "flex", alignItems: "center" }}>
					<WebsiteLogo />
				</div>
				<div style={{ display: "flex" }}>
					<Button
						onClick={() => {
							navigate("/post");
						}}
					>
						My Blogs
					</Button>
					<Button
						onClick={() => {
							navigate("/");
						}}
					>
						Explore
					</Button>
					<Button
						onClick={() => {
							navigate("/create");
						}}
					>
						Create New
					</Button>
					{user ? (
						<IconButton onClick={handleClick}>
							<Avatar src={user.profilePic}>A</Avatar>
						</IconButton>
					) : (
						<Button
							onClick={() => {
								navigate("/login");
							}}
						>
							Sign In
						</Button>
					)}
				</div>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				elevation={0}
				sx={{
					overflow: "visible",
					filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
					mt: 1.5,
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(`/user/${user.username}`);
					}}
				>
					<Avatar sx={{ mr: 1.5 }} /> {user && user.username}
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<Avatar sx={{ mr: 1.5 }} /> My account
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<PersonAdd fontSize="small" />
					</ListItemIcon>
					Add another account
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem
					onClick={() => {
						localStorage.removeItem("auth");
						window.location.href = "/login";
					}}
				>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
}
