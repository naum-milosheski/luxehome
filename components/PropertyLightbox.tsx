'use client';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PropertyLightboxProps {
    open: boolean;
    close: () => void;
    index: number;
    slides: { src: string }[];
}

export default function PropertyLightbox({ open, close, index, slides }: PropertyLightboxProps) {
    return (
        <Lightbox
            open={open}
            close={close}
            index={index}
            slides={slides}
        />
    );
}
