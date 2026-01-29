'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

interface ActionDropdownProps {
    onView: () => void;
    onStatusUpdate: () => void;
    onDelete: () => void;
}

export default function ActionDropdown({ onView, onStatusUpdate, onDelete }: ActionDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                // Check if click is inside the portal content (which is not a child of the component in DOM tree)
                // We can't easily check this with a ref to the portal content unless we store it.
                // But since the portal is appended to body, we can check if the target is inside a specific class or id.
                // A simpler way is to close it on any click outside the button, 
                // but we need to prevent closing if clicking inside the dropdown itself.
                // Let's use a ref for the dropdown content if possible, but it's in a portal.
                // Actually, we can just check if the click target is inside the dropdown element.
                const dropdown = document.getElementById('action-dropdown-content');
                if (dropdown && !dropdown.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false); // Close on scroll to avoid detached dropdown
        };

        const handleResize = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate position: align right edge of dropdown with right edge of button
            // Dropdown width is w-48 (12rem = 192px)
            // We want it to open downwards.
            setPosition({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.right + window.scrollX - 192 // Align right
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`p-2 rounded-full transition-all ${isOpen ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-brand-dark hover:text-white'}`}
                title="More Actions"
            >
                <MoreHorizontal size={16} />
            </button>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    id="action-dropdown-content"
                    className="fixed bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[9999] py-1 w-48"
                    style={{
                        top: `${position.top - window.scrollY}px`, // Adjust for fixed positioning
                        left: `${position.left - window.scrollX}px`
                    }}
                >
                    <button
                        onClick={() => { setIsOpen(false); onView(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-dark transition-colors flex items-center gap-2 font-medium"
                    >
                        <Eye size={14} />
                        View Details
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); onStatusUpdate(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-dark transition-colors flex items-center gap-2 font-medium"
                    >
                        <Edit size={14} />
                        Update Status
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                        onClick={() => { setIsOpen(false); onDelete(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-bold"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}
