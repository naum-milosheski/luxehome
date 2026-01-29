'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/supabase';

interface FeaturedPropertiesGridProps {
    properties: Property[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut" as any
        }
    }
};

export default function FeaturedPropertiesGrid({ properties }: FeaturedPropertiesGridProps) {
    if (properties.length === 0) {
        return (
            <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
            {properties.map((property) => (
                <motion.div key={property.id} variants={item}>
                    <Link href={`/listings/${property.id}`} className="block h-full">
                        <PropertyCard property={property} />
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
