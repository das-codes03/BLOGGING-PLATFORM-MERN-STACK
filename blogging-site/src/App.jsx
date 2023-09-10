import {
	Box,
	CssBaseline,
	ThemeProvider,
	createTheme,
	useMediaQuery,
} from "@mui/material";
import HomePage from "./pages/HomePage";
import ViewBlogPage from "./pages/ViewBlogPage";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import PostBlogPage from "./pages/PostBlogPage";
import { Route, Routes, json } from "react-router-dom";
import { Home } from "@mui/icons-material";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { useEffect, useState } from "react";
import EditProfileForm from "./pages/EditProfileForm";
import BlogNotFoundPage from "./pages/errorpages/BlogNotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ActivateUserPage from "./pages/ActivateUserPage";

function App() {
	const [darkMode, setDarkMode] = useState(true);

	const theme = createTheme({
		palette: {
			primary: {
				main: "#f9f9f9",
				dark: "#2f2f2f",
			},

			mode: darkMode ? "dark" : "light",
			info: {
				main: "#00a12b",
				dark: "#0f0",
			},
		},

		typography: {
			fontFamily: "Montserrat",
		},
	});

	// // Add a common header to every request
	// axios.interceptors.request.use((config) => {
	// 	config.headers["authorization"] = localStorage.getItem("auth");
	// 	return config;
	// });

	const navBarConfig = <NavBar setDarkMode={setDarkMode} />;
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				minHeight={"100vh"}
				display={"flex"}
				flexDirection={"column"}
				overflow={"hidden"}
			>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/"
						element={
							<>
								{navBarConfig}
								<HomePage />
							</>
						}
					/>
					<Route
						path="/create"
						element={
							<>
								{navBarConfig}
								<PostBlogPage />
							</>
						}
					/>
					<Route
						path="/blogs/:blogId"
						element={
							<>
								{navBarConfig}
								<ViewBlogPage />
							</>
						}
					/>
					<Route
						path="/blogs/:blogId/edit"
						element={
							<>
								{navBarConfig}
								<PostBlogPage />
							</>
						}
					/>

					<Route
						path="user/:username"
						element={
							<div
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								{navBarConfig}
								<ProfilePage />
							</div>
						}
					/>
					<Route
						path="/register"
						element={
							<>
								{navBarConfig}
								<RegisterPage />
							</>
						}
					/>
					<Route
						path="/editprofile"
						element={
							<>
								{navBarConfig}
								<EditProfileForm />
							</>
						}
					/>
					<Route
						path="/forgotpassword"
						element={
							<>
								{navBarConfig}
								<ForgotPasswordPage />
							</>
						}
					/>
					<Route
						path="/forgotpassword"
						element={
							<>
								{navBarConfig}
								<ForgotPasswordPage />
							</>
						}
					/>
					<Route
						path="/resetpassword"
						element={
							<>
								{navBarConfig}
								<ResetPasswordPage />
							</>
						}
					/>
					<Route
						path="/activate"
						element={
							<>
								<ActivateUserPage />
							</>
						}
					/>
					<Route path="/error">
						<Route
							path="blognotfound"
							element={
								<>
									{navBarConfig}
									<BlogNotFoundPage />
								</>
							}
						/>
					</Route>
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
