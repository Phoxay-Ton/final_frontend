'use client';

import { useEffect, useState } from "react";
import { FaSignOutAlt } from 'react-icons/fa';

interface HeaderProps {
    onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.name || "");
            setRole(user.role || "");
        }
    }, []);

    return (
        <header className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-4 flex justify-between items-center shadow-lg font-[Phetsarath_OT]">
            <h1 className="text-xl font-bold font-saysettha ">ລະບົບຕິດຕາມວຽກ</h1>
            <div className="flex items-center space-x-6">
                <div className="text-right">
                    <div className="font-bold text-white text-lg font-saysettha ">{username}</div>
                    <div className="text-sm text-slate-200">
                        {role === "Admin"
                            ? "Admin"
                            : role === "Super_Admin"
                                ? "Super Admin"
                                : "User"}
                    </div>
                </div>

                <button
                    onClick={onSignOut}
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-md flex items-center gap-2"
                >
                    <FaSignOutAlt /> ອອກລະບົບ
                </button>
            </div>
        </header>
    );
}



// import { useEffect, useState } from "react";
// import Link from 'next/link';
// import { FaUserShield, FaSignOutAlt } from 'react-icons/fa';

// interface HeaderProps {
//     onSignOut: () => void;
// }

// export default function Header({ onSignOut }: HeaderProps) {
//     const [username, setUsername] = useState<string>("");
//     const [role, setRole] = useState<string>("");

//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             const user = JSON.parse(storedUser);
//             setUsername(user.name || "");
//             setRole(user.role || "");
//         }
//     }, []);

//     return (
//         <header className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
//             <h1 className="text-xl font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
//             <div className="flex items-center space-x-4">
//                 <Link href="/admin">
//                     <div className="inline-flex items-center gap-2 cursor-pointer hover:text-sky-300 transition-colors">
//                         <FaUserShield className="text-xl" />
//                         <span className="text-base font-medium">{role === "Admin" ? "admin" : "User"}</span>
//                     </div>
//                 </Link>
//                 <button
//                     onClick={onSignOut}
//                     className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-md flex items-center gap-2"
//                 >
//                     <FaSignOutAlt /> ອອກລະບົບ
//                 </button>
//             </div>
//         </header>
//     );
// }




// export default function Header({ onSignOut }: HeaderProps) {
//     return (
//         <header className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
//             <h1 className="text-xl font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
//             <div className="flex items-center space-x-4">
//                 <Link href="/admin">
//                     <div className="inline-flex items-center gap-2 cursor-pointer hover:text-sky-300 transition-colors">
//                         <FaUserShield className="text-xl" />
//                         <span className="text-base font-medium">admin</span>
//                     </div>
//                 </Link>
//                 <button
//                     onClick={onSignOut}
//                     className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-md flex items-center gap-2"
//                 >
//                     <FaSignOutAlt /> ອອກລະບົບ
//                 </button>
//             </div>
//         </header>
//     );
// }