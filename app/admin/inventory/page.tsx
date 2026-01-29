'use client';

import { useState, useEffect } from 'react';
import { getUserProperties, deleteProperty } from '@/app/actions/properties';
import { Property } from '@/types/supabase';
import { Trash2, Loader2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function InventoryPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setIsLoading(true);
        const data = await getUserProperties();
        setProperties(data);
        setIsLoading(false);
    };

    const handleDeleteClick = (propertyId: string, title: string) => {
        setPropertyToDelete({ id: propertyId, title });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!propertyToDelete) return;

        setDeletingId(propertyToDelete.id);
        try {
            await deleteProperty(propertyToDelete.id);
            setProperties(properties.filter(p => p.id !== propertyToDelete.id));
            setDeleteModalOpen(false);
            setPropertyToDelete(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete property. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setPropertyToDelete(null);
    };

    // Pagination logic
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto pb-20 pt-8">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-lime" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 pt-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark">My Inventory</h1>
                <p className="text-gray-500 mt-1">Manage your property listings</p>
            </div>

            {/* Properties Table */}
            {properties.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any properties yet.</p>
                    <Link href="/admin/add-property" className="inline-block bg-brand-lime text-brand-dark px-6 py-3 rounded-full font-bold hover:bg-brand-dark hover:text-brand-lime transition-all">
                        Add Your First Property
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedProperties.map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                                                    <Image
                                                        src={(() => {
                                                            try {
                                                                if (!property.image) return '/fallback-property.jpg';
                                                                const parsed = JSON.parse(property.image);
                                                                const url = Array.isArray(parsed) ? parsed[0] : property.image;
                                                                return url || '/fallback-property.jpg';
                                                            } catch {
                                                                return property.image || '/fallback-property.jpg';
                                                            }
                                                        })()}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <Link href={`/listings/${property.id}`} className="font-bold text-brand-dark hover:text-brand-lime transition-colors">
                                                        {property.title}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{property.address}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-brand-dark">
                                                ${property.price.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${property.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : property.status === 'Draft'
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/edit-property/${property.id}`}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all"
                                                    title="Edit property"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(property.id, property.title)}
                                                    disabled={deletingId === property.id}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                                                    title="Delete property"
                                                >
                                                    {deletingId === property.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {properties.length > 0 && (
                        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <p className="text-sm text-gray-500 font-medium">
                                Showing <span className="font-bold text-brand-dark">{currentPage}</span> of <span className="font-bold text-brand-dark">{totalPages}</span> pages
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                propertyTitle={propertyToDelete?.title || ''}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                isDeleting={deletingId !== null}
            />
        </div>
    );
}
