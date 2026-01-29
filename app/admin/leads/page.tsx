'use client';

import { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, deleteLead, createLead } from '@/app/actions/leads';
import { Lead } from '@/types/supabase';
import { Mail, Phone, Calendar, ArrowUpRight, Search, MoreHorizontal, ChevronLeft, ChevronRight, Download, Plus, X, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import CustomSelect from '@/components/CustomSelect';
import ActionDropdown from '@/components/ActionDropdown';

export default function LeadsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        setIsLoading(true);
        const data = await getLeads();
        setLeads(data);
        setIsLoading(false);
    };

    const handleView = (lead: Lead) => {
        setSelectedLead(lead);
        setViewModalOpen(true);
    };

    const handleStatusClick = (lead: Lead) => {
        setSelectedLead(lead);
        setStatusModalOpen(true);
    };

    const handleDeleteClick = (lead: Lead) => {
        setSelectedLead(lead);
        setDeleteModalOpen(true);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedLead) return;
        setIsUpdating(true);
        try {
            await updateLeadStatus(selectedLead.id, newStatus);
            // Optimistic update
            setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: newStatus as Lead['status'] } : l));
            setStatusModalOpen(false);
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedLead) return;
        setIsUpdating(true);
        try {
            await deleteLead(selectedLead.id);
            setLeads(leads.filter(l => l.id !== selectedLead.id));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete lead');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Score', 'Date', 'Message'];
        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead => [
                `"${lead.name}"`,
                `"${lead.email}"`,
                `"${lead.phone}"`,
                `"${lead.status}"`,
                `"${lead.score}"`,
                `"${new Date(lead.created_at).toLocaleDateString()}"`,
                `"${lead.message.replace(/"/g, '""')}"` // Escape quotes
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await createLead(formData);
            if (result.success) {
                setAddModalOpen(false);
                loadLeads(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to add lead:', error);
            alert('Failed to add lead');
        } finally {
            setIsUpdating(false);
        }
    };

    // Stats
    const totalLeads = leads.length;
    const highPriority = leads.filter(l => l.score > 70).length;
    const pendingActions = leads.filter(l => l.status === 'New').length;

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 pt-8">
                <h1 className="text-3xl font-bold text-brand-dark">Leads CRM</h1>
                <p className="text-gray-500 mt-1">Manage and track your potential clients</p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                    <p className="text-gray-500 text-sm font-bold mb-1">Total Leads</p>
                    <p className="text-3xl font-bold text-brand-dark mt-auto">{totalLeads}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                    <p className="text-gray-500 text-sm font-bold mb-1">High Priority</p>
                    <p className="text-3xl font-bold text-green-600 mt-auto">{highPriority}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                    <p className="text-gray-500 text-sm font-bold mb-1">Pending Actions</p>
                    <p className="text-3xl font-bold text-brand-dark mt-auto">{pendingActions}</p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search and Filter Container */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full lg:w-auto lg:flex-1">
                    {/* Search */}
                    <div className="relative flex-1 lg:max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime transition-all font-medium text-brand-dark"
                        />
                    </div>

                    {/* Filter */}
                    <div className="w-full lg:w-48">
                        <CustomSelect
                            options={[
                                { label: 'All Statuses', value: 'All Statuses' },
                                { label: 'New', value: 'New' },
                                { label: 'Contacted', value: 'Contacted' },
                                { label: 'Qualified', value: 'Qualified' },
                                { label: 'Closed', value: 'Closed' }
                            ]}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={handleExportCSV}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-lime hover:text-brand-dark transition-all shadow-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Lead</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider">Lead Name</th>
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider">Contact Info</th>
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider">Message Analysis</th>
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider">Score</th>
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider">Status</th>
                                <th className="p-6 font-extrabold text-brand-dark text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading leads...</td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Search className="w-12 h-12 text-gray-300 mb-4" />
                                            <p className="text-lg font-bold text-brand-dark">No leads found</p>
                                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                                            <button
                                                onClick={() => { setSearchQuery(''); setStatusFilter('All Statuses'); }}
                                                className="mt-4 text-brand-dark font-bold hover:underline"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => {
                                    const isHighPriority = lead.score > 70;

                                    return (
                                        <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-brand-dark text-lg">{lead.name}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                                    <Calendar size={12} />
                                                    {new Date(lead.created_at).toLocaleDateString('en-US')}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-2">
                                                    <a href={`mailto:${lead.email}`} className="text-sm text-gray-600 hover:text-brand-lime flex items-center gap-2 transition-colors font-medium">
                                                        <Mail size={14} /> {lead.email}
                                                    </a>
                                                    <a href={`tel:${lead.phone}`} className="text-sm text-gray-600 hover:text-brand-lime flex items-center gap-2 transition-colors font-medium">
                                                        <Phone size={14} /> {lead.phone}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs italic">
                                                    "{lead.message}"
                                                </p>
                                            </td>
                                            <td className="p-6">
                                                <span className={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
                                                    isHighPriority
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {isHighPriority ? (
                                                        <>
                                                            <ArrowUpRight size={14} />
                                                            High ({lead.score})
                                                        </>
                                                    ) : (
                                                        `Std (${lead.score})`
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={clsx(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
                                                    lead.status === 'New' ? "bg-brand-lime text-brand-dark" : "bg-gray-100 text-gray-600"
                                                )}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a href={`mailto:${lead.email}`} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-lime hover:text-brand-dark transition-all" title="Email Lead">
                                                        <Mail size={16} />
                                                    </a>
                                                    <a href={`tel:${lead.phone}`} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-lime hover:text-brand-dark transition-all" title="Call Lead">
                                                        <Phone size={16} />
                                                    </a>
                                                    <ActionDropdown
                                                        onView={() => handleView(lead)}
                                                        onStatusUpdate={() => handleStatusClick(lead)}
                                                        onDelete={() => handleDeleteClick(lead)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm text-gray-500 font-medium">Showing <span className="font-bold text-brand-dark">1</span> of <span className="font-bold text-brand-dark">1</span> pages</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50" disabled>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {viewModalOpen && selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setViewModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-brand-dark">{selectedLead.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">Lead Details</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Contact Info</p>
                                <div className="space-y-2">
                                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-brand-dark font-medium hover:text-brand-lime transition-colors">
                                        <Mail size={16} /> {selectedLead.email}
                                    </a>
                                    <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-brand-dark font-medium hover:text-brand-lime transition-colors">
                                        <Phone size={16} /> {selectedLead.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Lead Score</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-3xl font-bold ${selectedLead.score > 70 ? 'text-green-600' : 'text-brand-dark'}`}>
                                        {selectedLead.score}
                                    </span>
                                    {selectedLead.score > 70 && (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">High Priority</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Message</p>
                            <p className="text-gray-700 leading-relaxed italic">"{selectedLead.message}"</p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setViewModalOpen(false)} className="px-6 py-3 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                                Close
                            </button>
                            <button
                                onClick={() => { setViewModalOpen(false); handleStatusClick(selectedLead); }}
                                className="px-6 py-3 rounded-full font-bold bg-brand-dark text-white hover:bg-brand-lime hover:text-brand-dark transition-all"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {statusModalOpen && selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setStatusModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setStatusModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <h2 className="text-2xl font-bold text-brand-dark mb-6">Update Status</h2>

                        <div className="space-y-3 mb-8">
                            {['New', 'Contacted', 'Qualified', 'Closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={isUpdating}
                                    className={`w-full p-4 rounded-xl text-left font-bold transition-all flex items-center justify-between ${selectedLead.status === status
                                        ? 'bg-brand-lime text-brand-dark shadow-sm ring-2 ring-brand-dark/10'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                    {selectedLead.status === status && <div className="w-3 h-3 bg-brand-dark rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark text-center mb-3">Delete Lead?</h2>
                        <p className="text-gray-600 text-center mb-8">
                            Are you sure you want to delete <span className="font-bold text-brand-dark">{selectedLead.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                disabled={isUpdating}
                                className="flex-1 px-6 py-3 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isUpdating}
                                className="flex-1 px-6 py-3 rounded-full font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {isUpdating ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Lead Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setAddModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <h2 className="text-2xl font-bold text-brand-dark mb-6">Add New Lead</h2>

                        <form onSubmit={handleAddLead} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes / Message</label>
                                <textarea
                                    name="message"
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-lime transition-all resize-none"
                                    placeholder="Enter any initial notes..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAddModalOpen(false)}
                                    disabled={isUpdating}
                                    className="flex-1 px-6 py-3 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-6 py-3 rounded-full font-bold bg-brand-dark text-white hover:bg-brand-lime hover:text-brand-dark transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Add Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
