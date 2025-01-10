// components/CreateRoomModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "../../utils/supabase/client";

interface CreateRoomModalProps {
	isOpen: boolean;
	onClose: () => void;
	onRoomCreated: (roomName: string, code: string) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
	isOpen,
	onClose,
	onRoomCreated,
}) => {
	const [roomName, setRoomName] = useState("");
	const supabase = createClient();

	const handleCreateRoom = async () => {
		const code = Math.random().toString(36).substring(2, 8).toUpperCase();
		const { data, error } = await supabase
			.from("rooms")
			.insert([{ name: roomName, code }]);

		if (error) {
			console.error("Error creating room:", error.message);
		} else {
			onRoomCreated(roomName, code); // Notify parent about room creation
			onClose(); // Close modal after creating room
		}
	};

	return (
		isOpen && (
			<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
				<div className="bg-white p-8 rounded-lg w-96">
					<h2 className="text-xl font-bold">Create Room</h2>
					<input
						type="text"
						placeholder="Room Name"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						className="border p-2 mt-3 w-full"
					/>
					<div className="mt-5 flex justify-between">
						<Button
							onClick={handleCreateRoom}
							className="bg-blue-500 text-white p-2"
						>
							Create
						</Button>
						<Button onClick={onClose} className="bg-gray-500 text-white p-2">
							Close
						</Button>
					</div>
				</div>
			</div>
		)
	);
};

export default CreateRoomModal;
