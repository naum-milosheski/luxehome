'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import PropertyLightbox from './PropertyLightbox';

interface PropertyGalleryProps {
    images: string[];
    title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const slides = images.map(src => ({ src }));

    return (
        <>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 h-auto md:h-[500px] rounded-3xl overflow-hidden mb-12 relative">
                {/* Main Image (Left) */}
                <div
                    className="relative h-[300px] md:h-full cursor-pointer group overflow-hidden w-full"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={images[0]}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                    {/* Magnifier Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/50">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Grid Images (Right) - Hidden on Mobile */}
                <div className="hidden md:grid grid-cols-2 gap-4 h-full w-full">
                    {images.slice(1, 5).map((img, index) => (
                        <div
                            key={index}
                            className="relative h-full cursor-pointer group overflow-hidden"
                            onClick={() => openLightbox(index + 1)}
                        >
                            <Image
                                src={img}
                                alt={`${title} ${index + 2}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                            {/* Magnifier Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/50">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <PropertyLightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                index={photoIndex}
                slides={slides}
            />
        </>
    );
}
