// /src/components/Modal.tsx


import { ModalProps } from '@/src/types/position';

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    children
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-96 shadow-2xl border border-gray-100 transform animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
                style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
            >
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-300 to-sky-400 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                </div>

                <h2
                    className={`text-2xl font-bold mb-4 text-center ${title === "ຢືນຢັນການລຶບ" ? "text-red-600" : "text-gray-800"
                        }`}
                >
                    {title}
                </h2>

                <p
                    className={`mb-8 text-center leading-relaxed ${title === "ຢືນຢັນການລຶບ" ? "text-red-500" : "text-gray-600"
                        }`}>
                    {message}
                </p>
                <div className="flex gap-4">
                    <button
                        className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 text-white font-medium hover:from-blue-500 hover:to-sky-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
                {children ? (
                    <div className="mb-8">{children}</div>
                ) : (
                    <p className={`mb-8 text-center leading-relaxed ${title === "ຢືນຢັນການລຶບ" ? "text-red-500" : "text-gray-600"}`}>

                    </p>
                )}


            </div>
        </div>
    );
}