// src/utils/fontLoader.ts

export const fontLoader = () => {
    if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Phetsarath+OT:wght@400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
};