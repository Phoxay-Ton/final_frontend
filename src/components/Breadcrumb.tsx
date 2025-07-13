// src/components/Breadcrumb.tsx
import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
    paths: { name: string; href?: string }[];
}

export default function Breadcrumb({ paths }: BreadcrumbProps) {
    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 text-sm text-slate-700 font-saysettha border-b border-sky-300"
            style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
            {paths.map((path, index) => (
                <span key={index}>
                    {path.href ? (
                        <Link href={path.href} className="hover:text-blue-600 transition-colors">
                            {path.name}
                        </Link>
                    ) : (
                        <span className="text-blue-800 font-semibold">{path.name}</span>
                    )}
                    {index < paths.length - 1 && ' / '}
                </span>
            ))}
        </div>
    );
}