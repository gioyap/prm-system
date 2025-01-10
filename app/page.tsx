"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Home() {
	const [code, setCode] = useState<string>(""); // State to store input code
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const supabase = createClient();
	const router = useRouter();

	const handleJoinRoom = async () => {
		// Validate input
		if (!code) {
			setErrorMessage("Please enter a valid code.");
			return;
		}

		// Query the database to check if the room exists
		const { data, error } = await supabase
			.from("rooms")
			.select("*")
			.eq("code", code)
			.single();

		if (error || !data) {
			setErrorMessage("Invalid code or room not found.");
		} else {
			// Redirect to the room page if code is valid
			router.push(`/room/${data.id}`);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-6">Join a Room</h1>
			<div className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="Enter Room Code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="border p-2 rounded w-64"
				/>
				{errorMessage && <p className="text-red-500">{errorMessage}</p>}
				<button
					onClick={handleJoinRoom}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Join Room
				</button>
			</div>
		</div>
	);
}
