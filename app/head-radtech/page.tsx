"use client";
import { useState, useEffect } from "react";
import { Room } from "../../types/room";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateRoomModal from "@/components/modal/CreateRoomModal";
import { createClient } from "@/utils/supabase/client";

export default function HeadRadTechPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter(); // Initialize router
	const supabase = createClient();

	// Fetch rooms when the component mounts
	useEffect(() => {
		fetchRooms();
	}, []);

	const fetchRooms = async () => {
		const { data, error } = await supabase.from("rooms").select("*");
		if (data) setRooms(data);
		if (error) console.error("Error fetching rooms:", error);
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	const handleRoomCreated = (roomName: string, code: string) => {
		alert(`Room created with name: ${roomName} and code: ${code}`);
		fetchRooms(); // Refresh room list after creation
	};

	const handleRoomClick = (roomId: string) => {
		router.push(`/room/${roomId}`);
	};

	return (
		<div className="p-10">
			<h1 className="text-2xl font-bold">Head RadTech Dashboard</h1>

			{/* Create Room Button */}
			<Button
				onClick={() => setIsModalOpen(true)}
				className="mt-5 text-white p-2"
			>
				Create Room
			</Button>

			{/* Modal */}
			<CreateRoomModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onRoomCreated={handleRoomCreated} // Pass the handler to the modal
			/>

			{/* Rooms List (with Thumbnails) */}
			<div className="mt-10 grid grid-cols-3 gap-4">
				{rooms.map((room) => (
					<div
						key={room.id}
						className="border p-4 text-center cursor-pointer hover:bg-gray-200"
						onClick={() => handleRoomClick(room.id)}
					>
						<h3 className="font-semibold">{room.name}</h3>
						<p className="text-sm text-gray-500">Code: {room.code}</p>
					</div>
				))}
			</div>

			{/* Logout Button */}
			<div className="mt-10">
				<Button onClick={handleLogout} className="bg-red-500 text-white p-2">
					Logout
				</Button>
			</div>
		</div>
	);
}
