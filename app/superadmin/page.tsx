"use client";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import bcrypt from "bcryptjs";

export default function SuperAdminPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleCreateAccount = async () => {
		if (!username || !password) {
			setErrorMessage("Both username and password are required.");
			return;
		}

		try {
			// Hash the password using bcrypt with a salt round of 10
			const hashedPassword = await bcrypt.hash(password, 10);

			const supabase = createClient();

			// Insert the user with the hashed password into the custom "users" table
			const { data, error } = await supabase
				.from("users")
				.insert([{ username, password: hashedPassword }]);

			if (error) {
				console.error("Error creating account:", error.message);
				setErrorMessage("Failed to create account. " + error.message);
			} else {
				setSuccessMessage("Head RadTech account created successfully.");
				setUsername("");
				setPassword("");
			}
		} catch (err) {
			console.error("Error hashing password:", err);
			setErrorMessage("An error occurred while processing your request.");
		}
	};

	return (
		<div className="p-10">
			<h1 className="text-2xl font-bold">SuperAdmin Dashboard</h1>
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
					onClick={handleCreateAccount}
					className="bg-blue-500 text-white p-2 ml-2"
				>
					Create Head RadTech
				</button>
			</div>

			{errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
			{successMessage && (
				<p className="text-green-500 mt-4">{successMessage}</p>
			)}
		</div>
	);
}
