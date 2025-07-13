// src/components/PositionEditModal.tsx
import React, { useState, useEffect } from "react";
import { Position } from "@/src/types/position"; // Adjust the import path as needed
import { FaEdit } from "react-icons/fa";

interface PositionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Position | null;
    onSave: (updatedPosition: Position) => void;
}

export default function PositionEditModal({ isOpen, onClose, initialData, onSave }: PositionEditModalProps) {
    const [editedPosition, setEditedPosition] = useState<Position>(initialData || {
        Position_ID: 0,
        Position_Name: '',
    });

    useEffect(() => {
        if (initialData) {
            setEditedPosition(initialData);
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedPosition(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedPosition);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
            style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
        >
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 flex items-center justify-center gap-2">
                    <FaEdit className="text-blue-500" />
                    ແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງ
                </h2>                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ຊື່ຕຳແໜ່ງ</label>
                        <input
                            type="text"
                            name="Position_Name"
                            value={editedPosition.Position_Name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ຊື່ຕຳແໜ່ງ"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-300 text-slate-700 rounded-xl hover:bg-gray-400 transition-colors shadow-md font-medium"
                            onClick={onClose}
                        >
                            ຍົກເລີກ
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium"
                        >
                            ບັນທຶກ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}