"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import bcrypt from "bcryptjs";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();

	const handleLogin = async () => {
		if (!username || !password) {
			setErrorMessage("Both username and password are required.");
			return;
		}

		const supabase = createClient();

		// Fetch the user by username
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("username", username)
			.single();

		if (error || !data) {
			setErrorMessage("Invalid username or password");
			return;
		}

		// Compare the entered password with the hashed password in the database
		const isMatch = await bcrypt.compare(password, data.password);

		if (isMatch) {
			// Redirect to /head-radtech on successful login
			router.push("/head-radtech");
		} else {
			setErrorMessage("Invalid username or password");
		}
	};

	return (
		<div className="p-10">
			<h1 className="text-2xl font-bold">Head RadTech Login</h1>
			<div className="mt-5">
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="border p-2"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 ml-2"
				/>
				<button
					onClick={handleLogin}
					className="bg-blue-500 text-white p-2 ml-2"
				>
					Login
				</button>
			</div>

			{errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
		</div>
	);
}
