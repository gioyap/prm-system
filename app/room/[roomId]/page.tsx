"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import ExcelJS from "exceljs";
import { useRouter } from "next/navigation";
import { CreateTableModal } from "@/components/modal/CreateTableModal";
import { Sidebar } from "@/components/sidebar";

export default function RoomDetailPage() {
	const { roomId } = useParams();
	const [room, setRoom] = useState<any>(null);
	const [rows, setRows] = useState<Record<string, any>[]>([]);
	const supabase = createClient();
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [tables, setTables] = useState<string[]>([]);

	const handleAddTable = () => {
		setIsModalOpen(true); // Open modal when + New Table is clicked
	};

	const handleSaveTable = (
		tableName: string,
		columns: { name: string; value: string }[]
	) => {
		// Save the new table (for simplicity, just add the table name to the list)
		setTables([...tables, tableName]);
		// You can extend this to save columns as well in a database or state
	};

	const handleCloseModal = () => {
		setIsModalOpen(false); // Close modal
	};

	useEffect(() => {
		if (roomId) {
			fetchRoomDetails(roomId as string);
		}
	}, [roomId]);

	const fetchRoomDetails = async (id: string) => {
		// Query Supabase to get room details from the "rooms" table
		const { data, error } = await supabase
			.from("rooms") // Assuming 'rooms' is your table name in Supabase
			.select("*")
			.eq("id", id)
			.single(); // Fetch a single room by id

		setRoom(data); // Set room details in state
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (event) => {
				const arrayBuffer = event.target?.result as ArrayBuffer;
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(arrayBuffer);
				const worksheet = workbook.worksheets[0];
				const json: Record<string, any>[] = [];

				worksheet.eachRow((row, rowNumber) => {
					const rowData: Record<string, any> = {};
					row.eachCell((cell, colNumber) => {
						rowData[`Column ${colNumber}`] = cell.text;
					});
					json.push(rowData);
				});

				setRows(json);
			};
			reader.readAsArrayBuffer(file);
		}
	};

	return (
		<div className="flex">
			<div className="w-64">
				{" "}
				{/* Sidebar width set here */}
				<Sidebar tables={tables} onAddTable={handleAddTable} />
			</div>
			<div className="flex-1 p-8">
				{" "}
				{/* Main content section */}
				{isModalOpen && (
					<CreateTableModal
						onClose={handleCloseModal}
						onSave={handleSaveTable}
					/> // Render modal when opened
				)}
				<div className="flex justify-center items-center flex-col">
					{" "}
					{/* Center content */}
					<h1 className="text-2xl font-bold mb-5">
						Room Details: {room?.name}
					</h1>
					<div className="mt-5">
						<Button
							className="bg-green-500 text-white p-2 mb-5"
							onClick={() => router.push("/head-radtech")} // Navigate using the client-side router
						>
							Back to Dashboard
						</Button>

						<div className="mb-5">
							<input
								type="file"
								accept=".xlsx, .xls"
								onChange={handleFileUpload}
								className="p-2 border rounded"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
