'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    User,
    Bell,
    Link as LinkIcon,
    Camera,
    Save,
    Check,
    Lock,
    Shield,
    X,
    Loader2
} from 'lucide-react';
import { getCurrentProfile, updateProfile, Profile } from '@/app/actions/profile';
import { deleteAccount } from '@/app/actions/user';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getCurrentProfile();
                setProfile(data);
                if (data?.avatar_url) setPreviewUrl(data.avatar_url);
            } catch (error) {
                console.error('Failed to load profile', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!profile) return;
        setIsSaving(true);

        const formData = new FormData();
        formData.append('full_name', profile.full_name || '');
        formData.append('job_title', profile.job_title || '');
        formData.append('email', profile.email || '');
        formData.append('phone', profile.phone || '');
        formData.append('bio', profile.bio || '');
        formData.append('existing_avatar', profile.avatar_url || '');
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            await updateProfile(formData);
            // Refresh profile to get new avatar URL if uploaded
            const updated = await getCurrentProfile();
            setProfile(updated);
        } catch (error) {
            alert('Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-brand-lime" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-32 pt-8">
            {/* 1. PAGE HEADER */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="hidden lg:flex items-center gap-2 bg-brand-lime text-brand-dark px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-8">
                {/* Card A: Public Profile */}
                <div className="bg-brand-card rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                            <User size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">Agent Profile</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 flex flex-col items-center gap-3 lg:items-start">
                            <div
                                onClick={handleImageClick}
                                className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative group cursor-pointer border-4 border-white shadow-sm"
                            >
                                <img
                                    src={previewUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button onClick={handleImageClick} className="text-sm font-bold text-brand-dark hover:text-brand-lime transition-colors">
                                Change Photo
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile?.full_name || ''}
                                        onChange={e => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        value={profile?.job_title || ''}
                                        onChange={e => setProfile(prev => prev ? { ...prev, job_title: e.target.value } : null)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-dark mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-dark mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profile?.phone || ''}
                                    onChange={e => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-dark mb-2">Bio</label>
                                <textarea
                                    rows={4}
                                    value={profile?.bio || ''}
                                    onChange={e => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card B: Notifications */}
                <div className="bg-brand-card rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">Alerts & Notifications</h2>
                    </div>

                    <div className="space-y-6">
                        <ToggleItem
                            label="New Lead Alert (Email)"
                            description="Receive an email whenever a new lead registers."
                            defaultChecked={true}
                        />
                        <ToggleItem
                            label="New Lead Alert (SMS)"
                            description="Receive a text message for urgent leads."
                            defaultChecked={false}
                        />
                        <ToggleItem
                            label="Weekly Performance Report"
                            description="Get a summary of your stats every Monday."
                            defaultChecked={true}
                        />
                    </div>
                </div>

                {/* Card C: Login & Security (NEW) */}
                <div className="bg-brand-card rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">Login & Security</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                            <div>
                                <p className="font-bold text-brand-dark">Password</p>
                                <p className="text-sm text-gray-500 mt-0.5">Last updated 3 months ago</p>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>

                        <ToggleItem
                            label="Two-Factor Authentication"
                            description="Add an extra layer of security to your account."
                            defaultChecked={false}
                        />
                    </div>
                </div>

                {/* Card D: Integrations */}
                <div className="bg-brand-card rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                            <LinkIcon size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">Connected Apps</h2>
                    </div>

                    <div className="space-y-6">
                        <ToggleItem
                            label="Google Calendar"
                            description="Sync viewings and open houses to your calendar."
                            defaultChecked={true}
                        />
                        <ToggleItem
                            label="WhatsApp Business"
                            description="Send automated lead alerts to WhatsApp."
                            defaultChecked={false}
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Save Button - Above Danger Zone */}
                <div className="lg:hidden">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-brand-lime text-brand-dark px-6 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Card E: Danger Zone */}
                <div className="bg-red-50 rounded-3xl p-5 md:p-8 shadow-sm border border-red-100">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <div>
                            <p className="font-bold text-brand-dark">Delete Account</p>
                            <p className="text-sm text-gray-500 mt-0.5">Permanently delete your account and all data.</p>
                        </div>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full md:w-auto px-4 py-2 rounded-lg border border-red-200 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <PasswordModal onClose={() => setIsPasswordModalOpen(false)} />
            )}

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
            )}
        </div>
    );
}

function ToggleItem({ label, description, defaultChecked }: { label: string, description: string, defaultChecked: boolean }) {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-bold text-brand-dark">{label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
            <button
                onClick={() => setIsChecked(!isChecked)}
                className={`w-14 h-8 rounded-full transition-colors relative ${isChecked ? 'bg-brand-lime' : 'bg-gray-200'}`}
            >
                <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isChecked ? 'left-7' : 'left-1'}`}
                />
            </button>
        </div>
    );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-brand-dark">Update Password</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Current Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-brand-lime text-brand-dark py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
                        >
                            {isSaving ? 'Saving...' : 'Save Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const router = useRouter();

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') {
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteAccount();

            if (result.error) {
                alert(result.error);
                setIsDeleting(false);
                return;
            }

            // Sign out the user
            await supabase.auth.signOut();

            // Force hard redirect to login page (clears any cached state)
            window.location.href = '/login';
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete account');
            setIsDeleting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-red-600">Delete Account</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-800 font-bold mb-2">⚠️ Warning: This action cannot be undone!</p>
                        <p className="text-sm text-red-700">
                            Deleting your account will permanently remove:
                        </p>
                        <ul className="text-sm text-red-700 mt-2 ml-4 list-disc space-y-1">
                            <li>Your profile and account information</li>
                            <li>All your properties (active and archived)</li>
                            <li>Your lead associations</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">
                            Type <span className="text-red-600">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                            placeholder="DELETE"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={confirmText !== 'DELETE' || isDeleting}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Forever'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

