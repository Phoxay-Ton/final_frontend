// 'use client';

// import React, { useState, ChangeEvent, useRef, useEffect, memo } from 'react';
// import { FaPlus, FaRegFileAlt } from 'react-icons/fa';
// import { AddManageTaskPayload } from "@/src/types/manageTask";

// interface Employee {
//     Employee_ID: number;
//     Name: string;
// }

// interface Division {
//     Division_ID: number;
//     Division_Name: string;
// }
// export interface AddManageTaskFormProps {
//     onSave: (taskPayload: AddManageTaskPayload, file: File | null) => Promise<boolean>;
//     onCancel: () => void;
//     showNotification: (title: string, message: string) => void;
//     employees: Employee[]; // Use the new Employee interface
//     divisions: Division[]; // Use the new Division interface
//     fetchEmployeesByDivision: (divisionId: number) => void;
// }

// const AddManageTaskForm = memo(({
//     onSave,
//     onCancel,
//     showNotification,
//     employees,
//     divisions,
//     fetchEmployeesByDivision
// }: AddManageTaskFormProps) => {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     // แยก state สำหรับ Division_ID และ Employee_ID
//     const [divisionId, setDivisionId] = useState(0);
//     const [employeeId, setEmployeeId] = useState(0);
//     console.log("================Form employees:", employees);

//     const [task, setTask] = useState<Omit<AddManageTaskPayload, 'Attachment'> & { document: File | null }>({
//         Task_name: '',
//         Description: '',
//         Start_Date: '',
//         End_date: '',
//         Status: 'ກຳລັງດຳເນີນການ',
//         Employee_ID: 0,
//         Division_ID: 0,
//         document: null,
//     });

//     useEffect(() => {
//         if (divisionId > 0) {
//             fetchEmployeesByDivision(divisionId);
//             setEmployeeId(0);
//             setTask(prev => ({
//                 ...prev,
//                 Division_ID: divisionId,
//                 Employee_ID: 0,
//             }));
//         } else {
//             // ไม่ต้อง fetchEmployeesByDivision(null) และไม่ต้อง setEmployeeId(0) ซ้ำ
//             setTask(prev => ({
//                 ...prev,
//                 Division_ID: 0,
//                 Employee_ID: 0,
//             }));
//         }
//         console.log(",,,,,,,,,divisions updated in page:", divisions);

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [divisionId]);

//     useEffect(() => {
//         setTask(prev => ({
//             ...prev,
//             Employee_ID: employeeId,
//         }));
//     }, [employeeId]);

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         if (name === "Division_ID") {
//             setDivisionId(parseInt(value) || 0);
//         } else if (name === "Employee_ID") {
//             setEmployeeId(parseInt(value) || 0);
//         } else {
//             setTask(prevTask => ({
//                 ...prevTask,
//                 [name]: value
//             }));
//         }
//     };

//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 showNotification("ໄຟລ໌ໃຫຍ່ເກີນໄປ", "ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 5MB.");
//                 setTask(prevTask => ({ ...prevTask, document: null }));
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//                 return;
//             }
//             const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
//             if (!allowedTypes.includes(file.type)) {
//                 showNotification("ປະເພດໄຟລ໌ບໍ່ຮອງຮັບ", "ກະລຸນາເລືອກໄຟລ໌ PDF, DOC, DOCX, ຫຼື TXT.");
//                 setTask(prevTask => ({ ...prevTask, document: null }));
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//                 return;
//             }

//             setTask(prevTask => ({ ...prevTask, document: file }));
//         } else {
//             setTask(prevTask => ({ ...prevTask, document: null }));
//         }
//     };

//     const handleClickFile = () => {
//         fileInputRef.current?.click();
//     };

//     const getEmployeeName = (employeeId: number): string => {
//         const employee = employees.find(emp => emp.Employee_ID === employeeId);
//         return employee ? employee.Name : 'ບໍ່ພົບພະນັກງານ';
//     };

//     const getDivisionName = (divisionId: number): string => {
//         const division = divisions.find(div => div.Division_ID === divisionId);
//         return division ? division.Division_Name : 'ບໍ່ພົບຂະແໜງ';
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!task.Task_name || !task.Description || !task.Start_Date || !task.End_date || task.Employee_ID === 0 || task.Division_ID === 0) {
//             showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ.");
//             return;
//         }

//         if (new Date(task.Start_Date) > new Date(task.End_date)) {
//             showNotification("ວັນທີບໍ່ຖືກຕ້ອງ", "ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ.");
//             return;
//         }

//         const payload: AddManageTaskPayload = {
//             Task_name: task.Task_name,
//             Description: task.Description,
//             Attachment: task.document ? task.document.name : '',
//             Employee_ID: task.Employee_ID,
//             Division_ID: task.Division_ID,
//             Start_Date: task.Start_Date,
//             End_date: task.End_date,
//             Status: task.Status,
//         };

//         try {
//             const success = await onSave(payload, task.document);
//             if (success) {
//                 setTask({
//                     Task_name: '',
//                     Description: '',
//                     Start_Date: '',
//                     End_date: '',
//                     Status: 'ກຳລັງດຳເນີນການ',
//                     Employee_ID: 0,
//                     Division_ID: 0,
//                     document: null,
//                 });
//                 setDivisionId(0);
//                 setEmployeeId(0);
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//             }
//         } catch (error) {
//             showNotification("ຜິດພາດ", "ບໍ່ສາມາດບັນທຶກວຽກໄດ້. ກະລຸນາລອງໃໝ່.");
//         }
//     };

//     return (
//         <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-md border border-sky-200 p-6">
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                     <div>
//                         <label htmlFor="Task_name" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ຊື່ວຽກ
//                         </label>
//                         <input
//                             type="text"
//                             id="Task_name"
//                             name="Task_name"
//                             value={task.Task_name}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
//                             placeholder="ຊື່ວຽກທີ່ຖືກມອບ"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="Start_Date" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ເລີ່ມວັນທີ່
//                         </label>
//                         <input
//                             type="date"
//                             id="Start_Date"
//                             name="Start_Date"
//                             value={task.Start_Date}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="End_date" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ກຳນົດສົ່ງ
//                         </label>
//                         <input
//                             type="date"
//                             id="End_date"
//                             name="End_date"
//                             value={task.End_date}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ສົ່ງເອກະສານ
//                         </label>
//                         <div className="w-full border border-gray-300 rounded-lg bg-white">
//                             <button
//                                 type="button"
//                                 onClick={handleClickFile}
//                                 className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-slate-700"
//                             >
//                                 <FaRegFileAlt className="text-xl text-blue-500" />
//                                 <span className="text-sm">
//                                     {task.document ? task.document.name : "ວາລະຖຶນມອບໃຫ້ (ເລືອກໄຟລ໌)"}
//                                 </span>
//                             </button>
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept=".pdf,.doc,.docx,.txt"
//                                 className="hidden"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ລາຍລະອຽດວຽກ
//                         </label>
//                         <textarea
//                             id="Description"
//                             name="Description"
//                             value={task.Description}
//                             onChange={handleChange}
//                             placeholder="ກະລຸນາປ້ອນລາຍລະອຽດ..."
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-gray-500 resize-y min-h-[100px]"
//                             rows={4}
//                             required
//                         />
//                     </div>
//                 </div>

//                 {/* Right Column */}
//                 <div>
//                     <div>
//                         <label htmlFor="Division_ID" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ຂະແໝງ
//                         </label>
//                         <select
//                             id="Division_ID"
//                             name="Division_ID"
//                             value={divisionId}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
//                             required
//                         >
//                             <option value={0}>ເລືອກຂະແໝງ</option>
//                             {divisions.map(division => (
//                                 <option key={division.Division_ID} value={division.Division_ID}>
//                                     {division.Division_Name}
//                                 </option>
//                             ))}
//                         </select>
//                         {divisionId > 0 && (
//                             <p className="text-xs text-blue-600 mt-1 font-saysettha">
//                                 ເລືອກແລ້ວ: {getDivisionName(divisionId)}
//                             </p>
//                         )}
//                     </div>

//                     <div className="mt-4">
//                         <label htmlFor="Employee_ID" className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
//                             ພະນັກງານ
//                         </label>
//                         <select
//                             id="Employee_ID"
//                             name="Employee_ID"
//                             value={employeeId}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
//                             required
//                         >
//                             <option value={0}>
//                                 {divisionId === 0 ? "ເລືອກຂະແໝງກ່ອນ" : "ເລືອກພະນັກງານ"}
//                             </option>
//                             {divisionId > 0 && employees.map(employee => (
//                                 <option key={employee.Employee_ID} value={employee.Employee_ID}>
//                                     {employee.Name}
//                                 </option>
//                             ))}
//                         </select>
//                         {employeeId > 0 && (
//                             <p className="text-xs text-blue-600 mt-1 font-saysettha">
//                                 ເລືອກແລ້ວ: {getEmployeeName(employeeId)}
//                             </p>
//                         )}
//                     </div>

//                     {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
//                         <h4 className="text-sm font-medium text-blue-800 mb-2 font-saysettha">ສະຫຼຸບການມອບວຽກ:</h4>
//                         <div className="text-xs text-blue-700 space-y-1 font-saysettha">
//                             <p><strong>ພະນັກງານ:</strong> {employeeId > 0 ? getEmployeeName(employeeId) : 'ຍັງບໍ່ໄດ້ເລືອກ'}</p>
//                             <p><strong>ຂະແໝງ:</strong> {divisionId > 0 ? getDivisionName(divisionId) : 'ຍັງບໍ່ໄດ້ເລືອກ'}</p>
//                             <p><strong>ສະຖານະ:</strong> {task.Status}</p>
//                         </div>
//                     </div> */}
//                 </div>

//                 <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-saysettha"
//                     >
//                         ຍົກເລີກ
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-saysettha flex items-center gap-2"
//                     >
//                         <FaPlus className="text-sm" />
//                         ບັນທຶກ
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// });

// export default AddManageTaskForm;



'use client';

import React, { useState, ChangeEvent, useRef, memo, useEffect, useCallback } from 'react';
interface AddManageTaskPayload {
    Task_name: string;
    Description: string;
    Attachment: string; // Storing file name here, actual file handled separately
    Employee_ID: number;
    Division_ID: number;
    Start_Date: string;
    End_Date: string;
    Status: string;
}

interface Employee {
    Employee_ID: number;
    Name: string;
}

interface Division {
    Division_ID: number;
    Division_Name: string;
}

export interface AddManageTaskFormProps {
    onSave: (taskPayload: AddManageTaskPayload, file: File | null) => Promise<boolean>;
    onCancel: () => void;
    showNotification: (title: string, message: string) => void;
    employees: Employee[];
    divisions: Division[];
    fetchEmployeesByDivision: (Division_ID: number) => void;
    loadingData?: boolean; // Optional, similar to previous component
    errorData?: string | null; // Optional, similar to previous component
}

const AddManageTaskForm = memo(({
    onSave, onCancel, showNotification, employees, divisions, fetchEmployeesByDivision, loadingData, errorData
}: AddManageTaskFormProps) => {
    // State to manage the task input fields and the selected document file
    const [task, setTask] = useState<Omit<AddManageTaskPayload, 'Attachment'> & { document: File | null }>(
        {
            Task_name: '',
            Description: '',
            Start_Date: '',
            End_Date: '',
            Status: 'ກຳລັງດຳເນີນການ', // Default status
            Employee_ID: 0,
            Division_ID: 0,
            document: null // Holds the actual file object
        }
    );

    // Ref for the hidden file input to programmatically trigger a click
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Form submission loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track if we're currently loading employees
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

    // Previous division ID to avoid unnecessary re-fetches 
    // const prevDivisionIdRef = useRef<number>(0);

    // Initial form setup: This effect runs only once when the component first mounts.
    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
    }, []);
    useEffect(() => {
        console.log('Employees updated:', employees);
    }, [employees]);// Empty dependency array means this runs once on mount.

    // Memoized function to handle division change
    const handleDivisionChange = useCallback(async (divisionId: number) => {
        if (divisionId > 0) {
            setIsLoadingEmployees(true);
            try {
                await fetchEmployeesByDivision(divisionId);
            } catch (error) {
                console.error("Error fetching employees:", error);
                showNotification("Error", "Failed to fetch employees");
            } finally {
                setIsLoadingEmployees(false);
            }
        }

        // prevDivisionIdRef.current = divisionId;
    }
        , [fetchEmployeesByDivision, showNotification]);


    // Effect to handle when employees are loaded - optimized to reduce unnecessary updates
    useEffect(() => {
        // ตรวจสอบว่า division ถูกเปลี่ยนและมี employees ถูกโหลดมา
        if (task.Division_ID > 0 && employees.length > 0) {
            console.log(`Employees loaded for division ${task.Division_ID}:`, employees);
        }
    }, [employees, task.Division_ID]); // More specific dependencies

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Special handling for Division_ID to trigger employee fetch
        if (name === 'Division_ID') {
            const divisionId = parseInt(value, 10) || 0;

            // Update only Division_ID, keep other fields intact
            setTask(prev => ({
                ...prev,
                Division_ID: divisionId,
                Employee_ID: 0 // Reset employee selection when division changes
            }));

            if (divisionId > 0) {
                handleDivisionChange(divisionId);
            }
        } else {
            // For all other fields, update normally
            setTask(prev => ({
                ...prev,
                [name]: name === 'Employee_ID' ? parseInt(value, 10) || 1 : value
            }));
        }
    }, [handleDivisionChange]);

    // Handles changes specifically for the file input
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the first selected file
        if (file) {
            console.log(`File selected: ${file.name}, size: ${file.size}`);

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification("ໄຟລ໌ໃຫຍ່ເກີນໄປ", "ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 5MB.");
                setTask(prev => ({ ...prev, document: null })); // Clear document state
                if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input field
                return;
            }

            // Validate file type
            const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                showNotification("ໄຟລ໌ບໍ່ຖືກຕ້ອງ", "ກະລຸນາເລືອກໄຟລ໌ປະເພດ PDF, DOC, DOCX, ຫຼື TXT.");
                setTask(prev => ({ ...prev, document: null })); // Clear document state
                if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input field
                return;
            }

            setTask(prev => ({ ...prev, document: file })); // Set the selected file
        } else {
            setTask(prev => ({ ...prev, document: null })); // Clear document if no file is selected
        }
    }, [showNotification]);

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default browser form submission

        if (isSubmitting) {
            console.log("Form is already submitting, ignoring duplicate submission");
            return;
        }

        setIsSubmitting(true);

        try {
            // Destructure task properties for easier access and validation
            const { Task_name, Description, Start_Date, End_Date, Employee_ID, Division_ID } = task;

            console.log("Form submission started with data:", {
                Task_name,
                Description,
                Start_Date,
                End_Date,
                Employee_ID,
                Division_ID,
                document: task.document?.name
            });

            // Basic form validation
            if (!Task_name.trim()) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາປ້ອນຊື່ວຽກ.");
                return;
            }

            if (!Description.trim()) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາປ້ອນລາຍລະອຽດວຽກ.");
                return;
            }

            if (!Start_Date) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາເລືອກວັນທີເລີ່ມ.");
                return;
            }

            if (!End_Date) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາເລືອກວັນທີສິ້ນສຸດ.");
                return;
            }

            if (Division_ID === 0) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາເລືອກຂະແນງ.");
                return;
            }

            if (Employee_ID === 0) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ", "ກະລຸນາເລືອກພະນັກງານທີ່ຮັບຜິດຊອບ.");
                return;
            }

            // Date validation: Start Date must not be after End Date
            const startDate = new Date(Start_Date);
            const endDate = new Date(End_Date);

            if (startDate > endDate) {
                showNotification("ວັນທີບໍ່ຖືກຕ້ອງ", "ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ.");
                return;
            }

            // Validate that the selected employee exists in the current employee list
            const selectedEmployee = employees.find(emp => emp.Employee_ID === Employee_ID);
            if (!selectedEmployee) {
                showNotification("ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", "ພະນັກງານທີ່ເລືອກບໍ່ມີໃນຂະແນງນີ້. ກະລຸນາເລືອກໃໝ່.");
                return;
            }

            // Construct the payload for the onSave function
            const payload: AddManageTaskPayload = {
                Task_name: Task_name.trim(),
                Description: Description.trim(),
                Attachment: task.document ? task.document.name : '', // Send file name as Attachment string
                Employee_ID,
                Division_ID,
                Start_Date,
                End_Date,
                Status: task.Status
            };

            console.log("Payload being sent:", payload);

            // Call the onSave prop with the payload and the actual file
            const success = await onSave(payload, task.document);

            if (success) {
                console.log("Task saved successfully, resetting form");
                // Reset form fields upon successful save
                setTask({
                    Task_name: '',
                    Description: '',
                    Start_Date: '',
                    End_Date: '',
                    Status: 'ກຳລັງດຳເນີນການ',
                    Employee_ID: 0,
                    Division_ID: 0,
                    document: null
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input visually
                }
                // prevDivisionIdRef.current = 0; // Reset division ref
                showNotification("ສຳເລັດ", "ບັນທຶກວຽກສຳເລັດແລ້ວ.");
            } else {
                console.log("Task save failed");
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດບັນທຶກວຽກໄດ້. ກະລຸນາລອງໃໝ່.");
            }
        } catch (error) {
            console.error("Error saving task:", error);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ. ກະລຸນາລອງໃໝ່.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ເພີ່ມວຽກໃໝ່</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- Left Column: Task Details --- */}
                <div className="space-y-5">
                    {/* Task Name Input */}
                    <div>
                        <label htmlFor="Task_name" className="block text-md font-medium text-gray-700 mb-1">
                            ຊື່ວຽກ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="Task_name"
                            name="Task_name"
                            value={task.Task_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ປ້ອນຊື່ວຽກ"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Start Date Input */}
                    <div>
                        <label htmlFor="Start_Date" className="block text-md font-medium text-gray-700 mb-1">
                            ວັນທີເລີ່ມ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="Start_Date"
                            name="Start_Date"
                            value={task.Start_Date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* End Date Input */}
                    <div>
                        <label htmlFor="End_Date" className="block text-md font-medium text-gray-700 mb-1">
                            ວັນທີສິ້ນສຸດ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="End_Date"
                            name="End_Date"
                            value={task.End_Date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label htmlFor="Description" className="block text-md font-medium text-gray-700 mb-1">
                            ລາຍລະອຽດ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="Description"
                            name="Description"
                            value={task.Description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ປ້ອນລາຍລະອຽດວຽກ..."
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* File Attachment Input */}
                    <div>
                        <label htmlFor="attachment_file" className="block text-md font-medium text-gray-700 mb-1">
                            ໄຟລ໌ແນບ
                        </label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {/* Replaced FaRegFileAlt with inline SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-5 w-5 text-blue-500">
                                <path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                            </svg>
                            <span className="truncate">{task.document ? task.document.name : "ເລືອກໄຟລ໌ (PDF, DOCX, TXT, Max 5MB)"}</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="attachment_file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* --- Right Column: Assignment Details --- */}
                <div className="space-y-5">
                    {/* Division Select */}
                    <div>
                        <label htmlFor="Division_ID" className="block text-md font-medium text-gray-700 mb-1">
                            ຂະແນງ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="Division_ID"
                            name="Division_ID"
                            value={task.Division_ID}
                            onChange={async (e) => {
                                const divisionId = parseInt(e.target.value, 10) || 0;
                                setTask(prev => ({
                                    ...prev,
                                    Division_ID: divisionId,
                                    Employee_ID: 0
                                }));
                                await handleDivisionChange(divisionId); // ✅ ถูกต้องแล้ว
                            }}

                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting || loadingData}
                        >
                            {loadingData ? (
                                <option disabled>ກຳລັງໂຫຼດ...</option>
                            ) : errorData ? (
                                <option disabled>{errorData}</option>
                            ) : (
                                <>
                                    <option value={0}>-- ເລືອກຂະແນງ --</option>
                                    {divisions.map(division => (
                                        <option key={division.Division_ID} value={division.Division_ID}>
                                            {division.Division_Name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Employee Select */}
                    <div>
                        <label htmlFor="Employee_ID" className="block text-md font-medium text-gray-700 mb-1">
                            ພະນັກງານທີ່ຮັບຜິດຊອບ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="Employee_ID"
                            name="Employee_ID"
                            value={task.Employee_ID}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={task.Division_ID === 0 || isLoadingEmployees || isSubmitting}
                        >
                            {isLoadingEmployees ? (
                                <option disabled>ກຳລັງໂຫຼດພະນັກງານ...</option>
                            ) : (
                                <>
                                    <option value={0}>
                                        {task.Division_ID === 0 ? "ເລືອກຂະແນງກ່ອນ" : "-- ເລືອກພະນັກງານ --"}
                                    </option>
                                    {employees.map(emp => (
                                        <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                            {emp.Name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {task.Division_ID > 0 && employees.length === 0 && !isLoadingEmployees && (
                            <p className="text-sm text-gray-500 mt-1">ບໍ່ມີພະນັກງານໃນຂະແນງນີ້</p>
                        )}
                    </div>

                    {/* Status Display (read-only for 'ກຳລັງດຳເນີນການ') */}
                    {/* <div>
                        <label htmlFor="Status" className="block text-md font-medium text-gray-700 mb-1">
                            ສະຖານະ
                        </label>
                        <input
                            type="text"
                            id="Status"
                            name="Status"
                            value={task.Status}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 bg-gray-100 cursor-not-allowed"
                        />
                    </div> */}

                    {/* Simplified Debug Information - Only show when needed */}
                    {/* {process.env.NODE_ENV === 'development' && (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            <p><strong>Debug Info:</strong></p>
                            <p>Division: {task.Division_ID} | Employee: {task.Employee_ID} | Employees: {employees.length}</p>
                            <p>Loading: {isLoadingEmployees ? 'Yes' : 'No'} | Error: {errorData || 'None'}</p>
                        </div>
                    )} */}
                </div>
                {/* Action Buttons */}
                <div className="lg:col-span-2 flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-300 text-slate-700 rounded-xl hover:bg-gray-400 transition-colors shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        ຍົກເລີກ
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {/* Replaced FaPlus with inline SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5">
                            <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                        </svg>
                        <span>{isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
});

AddManageTaskForm.displayName = 'AddManageTaskForm';

export default AddManageTaskForm;