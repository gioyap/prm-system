"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Column {
	name: string;
	value: string;
}

interface CreateTableModalProps {
	onClose: () => void; // Close modal function
	onSave: (tableName: string, columns: Column[]) => void; // Save the new table and columns
}

export const CreateTableModal: React.FC<CreateTableModalProps> = ({
	onClose,
	onSave,
}) => {
	const [tableName, setTableName] = useState<string>("");
	const [columns, setColumns] = useState<Column[]>([{ name: "", value: "" }]);

	const handleColumnChange = (
		index: number,
		field: "name" | "value",
		value: string
	) => {
		const updatedColumns = [...columns];
		updatedColumns[index][field] = value;
		setColumns(updatedColumns);
	};

	const handleAddColumn = () => {
		setColumns([...columns, { name: "", value: "" }]);
	};

	const handleSubmit = () => {
		if (tableName && columns.every((col) => col.name && col.value)) {
			onSave(tableName, columns); // Pass table name and columns to the parent
			onClose(); // Close the modal after saving
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-8 rounded-md w-96">
				<h3 className="font-bold mb-4">Create New Table</h3>
				<div className="mb-4">
					<label className="block font-medium">Table Name</label>
					<input
						type="text"
						value={tableName}
						onChange={(e) => setTableName(e.target.value)}
						className="w-full p-2 border rounded"
						placeholder="Enter table name"
					/>
				</div>

				{columns.map((col, index) => (
					<div key={index} className="mb-4 flex space-x-4">
						<div className="flex-1">
							<label className="block font-medium">Column Name</label>
							<input
								type="text"
								value={col.name}
								onChange={(e) =>
									handleColumnChange(index, "name", e.target.value)
								}
								className="w-full p-2 border rounded"
								placeholder="Enter column name"
							/>
						</div>
						<div className="flex-1">
							<label className="block font-medium">Column Value</label>
							<input
								type="text"
								value={col.value}
								onChange={(e) =>
									handleColumnChange(index, "value", e.target.value)
								}
								className="w-full p-2 border rounded"
								placeholder="Enter column value"
							/>
						</div>
					</div>
				))}

				<Button
					className="bg-green-500 text-white p-2 mb-5"
					onClick={handleAddColumn}
				>
					Add Column
				</Button>

				<div className="flex space-x-4 mt-4">
					<Button className="bg-gray-500 text-white p-2" onClick={onClose}>
						Cancel
					</Button>
					<Button className="bg-blue-500 text-white p-2" onClick={handleSubmit}>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};
