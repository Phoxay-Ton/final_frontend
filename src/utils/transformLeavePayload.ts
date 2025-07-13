// utils/transformLeavePayload.ts
import { AddLeave } from "@/src/types/leave";

export function transformLeavePayload(data: AddLeave) {
    return {
        // employee_id: data.Employee_ID,
        leave_type_id: data.Leave_type_ID,
        from_date: data.From_date,
        to_date: data.To_date,
        leave_days: data.Leave_days,
        description: data.Description || "",
        approval_person: data.Approval_person,
    };
}
