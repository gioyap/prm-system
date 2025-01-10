"use client";
import { Button } from "@/components/ui/button";

interface SidebarProps {
	tables: string[]; // List of table names
	onAddTable: () => void; // Function to trigger the table creation modal
}

export const Sidebar: React.FC<SidebarProps> = ({ tables, onAddTable }) => {
	return (
		<div className="w-64 h-screen p-4 border-r bg-gray-800 text-white">
			{" "}
			{/* Fixed width for sidebar */}
			<Button
				className="bg-blue-500 text-white p-2 mb-5 w-full"
				onClick={onAddTable}
			>
				{" "}
				{/* Full width button */}+ New Table
			</Button>
			<div>
				{tables.map((table, index) => (
					<div key={index} className="p-2 border-b">
						{table}
					</div>
				))}
			</div>
		</div>
	);
};
