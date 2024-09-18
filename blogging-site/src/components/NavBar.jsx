import {
	Brightness2,
	Create,
	DarkMode,
	Edit,
	Explore,
	Label,
	LocalActivity,
	Logout,
	MenuBook,
	MenuOutlined,
	PersonAdd,
	Settings,
	WbSunny,
	WifiProtectedSetup,
} from "@mui/icons-material";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Switch,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useUserInfo from "../pages/hooks/useUserInfo";

function WebsiteLogo() {
	const nav = useNavigate();
	return (
		<Box
			display={"flex"}
			alignItems={"center"}
			gap={"10px"}
			sx={{ cursor: "pointer" }}
			onClick={() => {
				nav("/");
			}}
		>
			<Typography
				color={"textSecondary"}
				fontFamily={"Sedgwick Ave Display"}
				fontSize={"2em"}
			>
				InsightInk
			</Typography>
			<LocalActivity htmlColor="green" />
		</Box>
	);
}

export default function NavBar({ setDarkMode }) {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const [darkMode, setSwitchMode] = useState(false);
	useEffect(() => {
		setDarkMode((d) => {
			setSwitchMode(d);
			return d;
		});
	}, []);

	const [anchorMenu, setAnchorMenu] = useState(null);
	const openUser = Boolean(anchorEl);
	const openMenu = Boolean(anchorMenu);
	const handleClickUser = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClickMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setAnchorMenu(null);
	};

	const { user } = useUserInfo();

	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<>
			<AppBar
				position="sticky"
			// bgcolor={"navbar.light"}
			>
				<Container sx={{ padding: "10px" }}>
					<Toolbar disableGutters>
						<Box marginLeft={"20px"}>
							<WebsiteLogo />
						</Box>

						<Box
							marginLeft={"auto"}
							display={"flex"}
							gap={"10px"}
							alignItems={"center"}
						>
							{isSmallScreen && (
								<IconButton onClick={handleClickMenu}>
									<MenuOutlined />
								</IconButton>
							)}
							<Box display={isSmallScreen ? "none" : "flex"} gap={"10px"}>
								<Button
									variant="text"
									color="info"
									onClick={() => {
										navigate("/");
									}}
								>
									Explore
									<Explore sx={{ paddingLeft: "5px" }} />
								</Button>
								<Button
									variant="text"
									color="info"
									onClick={() => {
										navigate(user ? "/create" : "/login?from=/create");
									}}
								>
									{isSmallScreen ? "" : "Create"}
									<Create sx={{ paddingLeft: "5px" }} />
								</Button>
								<Box
									display={"flex"}
									flexDirection={"row"}
									alignItems={"center"}
								>
									{!darkMode ? <WbSunny fontSize={"0.75em"} /> : <DarkMode />}
									<Switch
										checked={darkMode}
										color="info"
										onChange={() => {
											setDarkMode &&
												setDarkMode((d) => {
													setSwitchMode(!d);
													return !d;
												});
										}}
									/>
								</Box>
							</Box>
							<Box marginRight={"10px"}>
								{user ? (
									<IconButton onClick={handleClickUser}>
										<Avatar src={user.profilePic}>{user.displayName[0]}</Avatar>
									</IconButton>
								) : (
									<Button
										onClick={() => {
											navigate("/login");
										}}
										color="info"
										variant="outlined"
									>
										Sign In
									</Button>
								)}
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			{user && (
				<Menu
					anchorEl={anchorEl}
					id="account-menu"
					open={openUser}
					onClose={handleClose}
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
						<Avatar src={user.profilePic || ""} sx={{ mr: 1.5 }} />{" "}
						<Box>
							<Typography fontWeight={"bold"}>
								{user && user.displayName}
							</Typography>
							<Typography>@{user && user.username}</Typography>
						</Box>
					</MenuItem>

					<Divider />

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
			)}
			<Menu
				anchorEl={anchorMenu}
				id="account-menu"
				open={openMenu}
				onClose={handleClose}
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
						navigate("/");
					}}
				>
					<Explore /> <Typography marginLeft={"10px"}>Explore</Typography>
				</MenuItem>
				<MenuItem
					onClick={() => {
						navigate(user ? "/create" : "/login?from=/create");
					}}
				>
					<Edit /> <Typography marginLeft={"10px"}>Create</Typography>
				</MenuItem>
				<MenuItem>
					<Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
						{!darkMode ? <WbSunny fontSize={"0.75em"} /> : <DarkMode />}
						<Switch
							checked={darkMode}
							color="info"
							onChange={() => {
								setDarkMode &&
									setDarkMode((d) => {
										setSwitchMode(!d);
										return !d;
									});
							}}
						/>
					</Box>
				</MenuItem>
			</Menu>
		</>
	);
}
