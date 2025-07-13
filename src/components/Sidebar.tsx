'use client';

import Image from "next/image";
import {
    FaUser,
    FaTasks,
    FaBuilding,
    FaFolderOpen,
    FaUsers,
    FaBriefcase,
    FaPlaneDeparture,
    FaClipboardCheck,
    FaSearch,
    FaClock,
    FaCalendarAlt,
    FaAngleLeft,
    FaBars,
    FaAngleDown,
    FaAngleRight
} from "react-icons/fa";
import Img from "/public/img/login.jpeg";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
    isCollapsed: boolean;
    onToggle: () => void;
};


export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const [isLeaveMenuExpanded, setIsLeaveMenuExpanded] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            console.log("User role from localStorage:", user.role);
            setRole(user.role || null);
        } else {
            console.log("No user found in localStorage");
            setRole(null);
        }
    }, []);

    useEffect(() => {
        console.log("Role updated:", role);
    }, [role]);

    const getLinkClass = (href: string) => {
        const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-sky-300 text-blue-800 font-semibold shadow-md' : 'hover:bg-sky-200 hover:scale-105'}`;
    };

    const getCollapsedLinkClass = (href: string) => {
        const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return `p-2 rounded-lg ${isActive ? 'bg-sky-300 text-blue-800 shadow-md' : 'hover:bg-sky-200'}`;
    };

    return (
        <div
            className={`bg-white/70 backdrop-blur-lg border-r border-sky-300/60 text-slate-800 flex flex-col shadow-xl transition-all duration-300 h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}
            style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
        >
            {/* Custom Scrollbar Styles (applies to elements with 'sidebar-scroll' class) */}
            <style jsx>{`
                .sidebar-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.5);
                    border-radius: 3px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(28, 29, 31, 0.5);
                    border-radius: 3px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(26, 27, 28, 0.7);
                }
            `}</style>

            {/* Header Section - Fixed */}
            <div className={`flex-shrink-0 p-4 ${isCollapsed ? 'text-center' : ''}`}>
                {/* Logo Section */}
                <div className={`flex items-center justify-center mb-6 ${isCollapsed ? 'mt-4' : ''}`}>
                    <div className={`relative ${isCollapsed ? 'w-14 h-14' : 'w-full max-w-[200px]'} transition-all duration-300 ease-in-out`}>
                        <Image
                            src={Img}
                            alt="Company Logo"
                            width={300}
                            height={300}
                            className={`h-auto rounded-xl shadow-lg border-2 border-sky-400/80 transform transition-transform duration-300 ease-in-out ${isCollapsed ? 'scale-100' : 'scale-100'}`}
                        />
                        {!isCollapsed && (
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/30 to-blue-300/30 rounded-xl pointer-events-none opacity-60"></div>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center">
                    <button
                        onClick={onToggle}
                        className="ml-auto p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ease-in-out"
                    >
                        {isCollapsed ? <FaBars className="text-lg" /> : <FaAngleLeft className="text-lg" />}
                    </button>
                </div>
            </div>

            {/* Scrollable Navigation Section */}
            {/* The 'flex-1' class makes this div grow to take available space, and 'overflow-y-auto' makes it scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 sidebar-scroll">
                {/* Expanded Menu */}
                <nav className={`space-y-3 text-lg transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    <Link href="/admin" className={getLinkClass("/admin")}>
                        <FaUser className="mr-3 text-xl" /> ໝ້າຫຼັກ
                    </Link>
                    {/* {(role === 'Admin' || role === 'Super_Admin') && ( */}
                    <Link href="/manage_tasks" className={getLinkClass("/manage_tasks")}>
                        <FaTasks className="mr-3 text-xl" /> ການມອບວຽກ
                    </Link>

                    {role === 'Super_Admin' && (
                        <Link href="/department" className={getLinkClass("/department")}>
                            <FaBuilding className="mr-3 text-xl" /> ພະແນກ
                        </Link>
                    )}
                    {role === 'Super_Admin' && (
                        <Link href="/Division" className={getLinkClass("/Division")}>
                            <FaFolderOpen className="mr-3 text-xl" /> ຂະແໜງ
                        </Link>
                    )}
                    {(role === 'Admin' || role === 'Super_Admin') && (
                        <Link href="/employee" className={getLinkClass("/employee")}>
                            <FaUsers className="mr-3 text-xl" /> ພະນັກງານ
                        </Link>
                    )}
                    {role === 'Super_Admin' && (
                        <Link href="/position" className={getLinkClass("/position")}>
                            <FaBriefcase className="mr-3 text-xl" /> ຕຳແໜ່ງ
                        </Link>
                    )}
                    {/* Leave Menu */}
                    <div>
                        <button
                            onClick={() => setIsLeaveMenuExpanded(!isLeaveMenuExpanded)}
                            className="flex items-center justify-between w-full px-4 py-2 font-semibold text-blue-700 rounded-lg hover:bg-sky-200 transition-all duration-200"
                        >
                            <span className="flex items-center">
                                <FaPlaneDeparture className="mr-3 text-xl" /> ລາພັກ
                            </span>
                            {isLeaveMenuExpanded ? <FaAngleDown className="text-lg" /> : <FaAngleRight className="text-lg" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isLeaveMenuExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-6 space-y-2 text-md pt-2">
                                <Link href="/Leave_Type/Leave" className={getLinkClass("/Leave_Type/Leave")}>
                                    <span className="ml-2">ຂໍລາພັກ</span>
                                </Link>
                                {(role === 'Admin' || role === 'Super_Admin') && (
                                    <Link href="/Leave_Type/Approve_leave" className={getLinkClass("/Leave_Type/Approve_leave")}>
                                        <span className="ml-2">ອະນຸມັດລາພັກ</span>
                                    </Link>
                                )}
                                {(role === 'Admin' || role === 'Super_Admin') && (
                                    <Link href="/Leave_Type/Follow_leave" className={getLinkClass("/Leave_Type/Follow_leave")}>
                                        <span className="ml-2">ຕິດຕາມລາພັກ</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    {(role === 'Admin' || role === 'Super_Admin') && (
                        <Link href="/Attendance_Type/follow_attendance" className={getLinkClass("/Attendance_Type/follow_attendance")}>
                            <FaCalendarAlt className="mr-3 text-xl" /> ຕິດຕາມການເຂົ້າອອກວຽກ
                        </Link>
                    )}
                    <Link
                        href="/Attendance_Type/attendance"
                        className={`${getLinkClass("/Attendance_Type/attendance")} flex items-center bg-blue-200 hover:bg-blue-200 text-black-1000 px-4 py-2 rounded-md transition duration-200 font-medium`}
                    >
                        <FaClock className="mr-3 text-xl text-blue-700" />
                        ເຂົ້າ-ອອກວຽກ
                    </Link>
                </nav>

                {/* Collapsed Menu */}
                {isCollapsed && (
                    <nav className="space-y-4 flex flex-col items-center opacity-100 h-auto">
                        <Link href="/admin" className={getCollapsedLinkClass("/admin")} title="ໝ້າຫຼັກ">
                            <FaUser className="text-2xl" />
                        </Link>
                        <Link href="/manage_tasks" className={getCollapsedLinkClass("/manage_tasks")} title="ການມອບວຽກ">
                            <FaTasks className="text-2xl" />
                        </Link>
                        {(role === 'Admin' || role === 'Super_Admin') && (
                            <Link href="/department" className={getCollapsedLinkClass("/department")} title="ພະແນກ">
                                <FaBuilding className="text-2xl" />
                            </Link>
                        )}
                        {role === 'Admin' && (
                            <Link href="/Division" className={getCollapsedLinkClass("/Division")} title="ຂະແໜງ">
                                <FaFolderOpen className="text-2xl" />
                            </Link>
                        )}
                        {role === 'Admin' && (
                            <Link href="/employee" className={getCollapsedLinkClass("/employee")} title="ພະນັກງານ">
                                <FaUsers className="text-2xl" />
                            </Link>
                        )}
                        <Link href="/position" className={getCollapsedLinkClass("/position")} title="ຕຳແໜ່ງ">
                            <FaBriefcase className="text-2xl" />
                        </Link>
                        {/* Leave in Collapsed */}
                        <button
                            onClick={() => setIsLeaveMenuExpanded(!isLeaveMenuExpanded)}
                            className={`p-2 rounded-lg text-blue-700 relative group ${isLeaveMenuExpanded ? 'bg-sky-200' : 'hover:bg-sky-200'}`}
                            title="ລາພັກ"
                        >
                            <FaPlaneDeparture className="text-2xl" />
                            {isLeaveMenuExpanded && (
                                <div className="absolute left-full top-0 ml-3 w-48 bg-white/90 backdrop-blur-md border border-sky-300/60 rounded-lg shadow-lg py-2 z-10 text-sm animate-fade-in-up">
                                    <Link href="/Leave_Type/Leave" className="flex items-center px-4 py-2 hover:bg-sky-100 rounded-md">
                                        ຂໍລາພັກ
                                    </Link>
                                    <Link href="/Leave_Type/Approve_leave" className="flex items-center px-4 py-2 hover:bg-sky-100 rounded-md">
                                        ອະນຸມັດລາພັກ
                                    </Link>
                                    <Link href="/Leave_Type/Follow_leave" className="flex items-center px-4 py-2 hover:bg-sky-100 rounded-md">
                                        ຕິດຕາມລາພັກ
                                    </Link>
                                </div>
                            )}
                        </button>
                        <Link href="/Attendance_Type/follow_attendance" className={getCollapsedLinkClass("/Attendance_Type/follow_attendance")} title="ຕິດຕາມການເຂົ້າອອກວຽກ">
                            <FaCalendarAlt className="text-2xl" />
                        </Link>
                        <Link href="/Attendance_Type/attendance" className={getCollapsedLinkClass("/Attendance_Type/attendance")} title="ການເຂົ້າ-ອອກວຽກ">
                            <FaClock className="text-2xl " />
                        </Link>
                    </nav>
                )}
            </div>
        </div>
    );
}