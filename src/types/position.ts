// /src/types/position.ts
export interface Position {
    Position_ID: number;
    Position_Name: string;
}

export interface AddPosition {
    position_name: string;
}

export interface PositionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Position | null;
    onSave: (updatedPosition: Position) => void;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    children?: React.ReactNode;
}

export interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}