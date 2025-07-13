// /src/components/NotificationModal.tsx
import { NotificationModalProps } from '@/src/types/position';

export default function NotificationModal({
    isOpen,
    onClose,
    title,
    message
}: NotificationModalProps) {
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
                    <div className="w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    {title}
                </h2>
                <p className="mb-8 text-center text-gray-600 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-center">
                    <button
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 text-white font-medium hover:from-blue-500 hover:to-sky-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        onClick={onClose}
                    >
                        ຕົກລົງ
                    </button>
                </div>
            </div>
        </div>
    );
}