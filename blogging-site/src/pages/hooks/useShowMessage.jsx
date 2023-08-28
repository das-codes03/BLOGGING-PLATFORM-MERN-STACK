import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

function MessageBar({ message, open, mode, onClose }) {
	return (
		<>
			<Snackbar
				open={open}
				ClickAwayListenerProps={{ onClickAway: () => null }}
				onClose={onClose}
				autoHideDuration={5000}
			>
				<Alert severity={mode} sx={{ width: "100%" }}>
					{message}
				</Alert>
			</Snackbar>
		</>
	);
}

export default function useShowMessage() {
	const [open, setOpen] = useState(false);
	const [render, setRender] = useState(<></>);
	const [config, setConfig] = useState({});

	let msg = "",
		mode = "info";
	useEffect(() => {
		setRender(
			<MessageBar
				message={config.message}
				mode={config.mode}
				open={open}
				onClose={() => {
					setOpen(false);
				}}
			/>
		);
	}, [open, config]);
	//modes 'error' | 'info' | 'success' | 'warning'
	const showMessage = (message, severity = "info") => {
		message = `${message}`;
		setConfig(() => {
			const c = {
				message: message,
				mode: severity,
			};
			setOpen(true);
			return c;
		});
	};

	return [render, showMessage];
}
