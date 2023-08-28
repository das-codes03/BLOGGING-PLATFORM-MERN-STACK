import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
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
import useShowMessage from "./pages/hooks/useShowMessage";
const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	// Add a common header to every request
	axios.interceptors.request.use((config) => {
		config.headers["authorization"] = localStorage.getItem("auth");
		return config;
	});
	const [msgBox] = useShowMessage();
	const navBarConfig = <NavBar />;
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

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
			{msgBox}
		</ThemeProvider>
	);
}

export default App;
