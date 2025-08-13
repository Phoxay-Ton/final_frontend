import React from 'react';
import { Download, Eye, FileText, File } from 'lucide-react';

interface FileAttachmentProps {
    filename: string | null;
    originalName?: string;
    taskId?: number;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
    filename,
    originalName,
    taskId
}) => {
    if (!filename) {
        return (
            <span className="text-gray-500 text-sm italic">
                ບໍ່ມີໄຟລ໌ແນບ
            </span>
        );
    }

    // สร้าง URL สําหรับเข้าถึงไฟล์
    const fileUrl = `http://localhost:8080/uploads/${filename}`;
    const downloadUrl = `http://localhost:8080/api/v1/task/file/${filename}`;

    // ตรวจสอบประเภทไฟล์และส่งคืนไอคอนที่เหมาะสม
    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return <FileText className="w-4 h-4 text-red-600" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-4 h-4 text-blue-600" />;
            case 'txt':
                return <FileText className="w-4 h-4 text-gray-600" />;
            default:
                return <File className="w-4 h-4 text-gray-600" />;
        }
    };

    // ใช้ชื่อไฟล์ต้นฉบับถ้ามี ไม่งั้นใช้ชื่อไฟล์ที่เก็บ
    const displayName = originalName || filename;

    // ฟังก์ชันสำหรับดูไฟล์
    const handleViewFile = () => {
        window.open(fileUrl, '_blank');
    };

    // ฟังก์ชันสำหรับดาวน์โหลดไฟล์
    const handleDownloadFile = () => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = displayName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border">
            {/* ไอคอนประเภทไฟล์ */}
            {getFileIcon(filename)}

            {/* ชื่อไฟล์ */}
            <span className="text-sm text-gray-700 flex-1 truncate" title={displayName}>
                {displayName}
            </span>

            <div className="flex space-x-1">
                {/* ปุ่มดูไฟล์ */}
                <button
                    onClick={handleViewFile}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                    title="ເບິ່ງໄຟລ໌"
                >
                    <Eye className="w-4 h-4" />
                </button>

                {/* ปุ่มดาวน์โหลด */}
                <button
                    onClick={handleDownloadFile}
                    className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                    title="ດາວໂຫຼດໄຟລ໌"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default FileAttachment;

/* 
วิธีใช้งานใน Task List Component:

import FileAttachment from './FileAttachment';

// ในส่วนของ table cell หรือ card ที่แสดงข้อมูล task
<FileAttachment 
  filename={task.attachment} 
  originalName={task.original_filename} // ถ้ามี
  taskId={task.id} 
/>

// หรือในรูปแบบที่ง่ายกว่า
<FileAttachment filename={task.attachment} />

// ตัวอย่างการใช้ใน Table Row:
<tr>
  <td className="px-4 py-2">{task.task_name}</td>
  <td className="px-4 py-2">{task.description}</td>
  <td className="px-4 py-2">
    <FileAttachment 
      filename={task.attachment}
      originalName={task.original_filename}
    />
  </td>
</tr>

// ตัวอย่างการใช้ใน Card:
<div className="bg-white p-4 rounded-lg shadow">
  <h3 className="font-bold">{task.task_name}</h3>
  <p className="text-gray-600 mb-2">{task.description}</p>
  <div className="mt-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      ໄຟລ໌ແນບ:
    </label>
    <FileAttachment 
      filename={task.attachment}
      originalName={task.original_filename}
    />
  </div>
</div>
*/