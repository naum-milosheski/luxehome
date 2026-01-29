'use client';

import { useState } from 'react';
import { Upload, Sparkles, Loader2, Plus, X } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import { createProperty } from '@/app/actions/properties';
import { generateDescription, analyzeImage } from '@/app/actions/ai';
import { useRouter } from 'next/navigation';
import { MASTER_AMENITIES, createEmptyAmenities, AmenityKey } from '@/lib/amenities';

export default function AddPropertyPage() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [listingType, setListingType] = useState('Sale');
    const [propertyType, setPropertyType] = useState('House');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [sqft, setSqft] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [amenities, setAmenities] = useState(createEmptyAmenities());
    const [validationError, setValidationError] = useState('');

    // Safety Locks: Button Enable Logic
    const canAnalyze = imageFiles.length > 0;
    const canGenerate = title.trim() !== '' && address.trim() !== '' && beds !== '' && baths !== '';

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...filesArray]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (imageFiles.length === 0) return alert('Please upload at least one image first');
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('image', imageFiles[0]); // Analyze first image

        const detectedAmenities = await analyzeImage(formData);

        // Store tags for display (extract keys from JSON)
        const tagKeys = Object.keys(detectedAmenities);
        setTags(tagKeys);

        // Auto-check amenities directly from AI response
        setAmenities(prev => ({
            ...prev,
            ...detectedAmenities
        }));

        setIsAnalyzing(false);
    };

    const handleGenerateDescription = async () => {
        setIsGenerating(true);

        const activeAmenities = Object.keys(amenities)
            .filter(k => amenities[k as keyof typeof amenities])
            .map(k => k);

        const generatedText = await generateDescription({
            title,
            location: address,
            stats: `${beds} beds, ${baths} baths, ${sqft} sqft`,
            features: tags,
            amenities: activeAmenities
        });

        setDescription(generatedText);
        setIsGenerating(false);
    };

    const handleSubmit = async (status: 'Draft' | 'Active') => {
        setValidationError('');

        // Conditional Validation
        if (status === 'Draft') {
            // Draft: Only require title
            if (!title.trim()) {
                setValidationError('Property title is required to save as draft.');
                return;
            }
        } else if (status === 'Active') {
            // Publish: Require all fields
            const errors: string[] = [];

            if (!title.trim()) errors.push('Title');
            if (!address.trim()) errors.push('Location');
            if (!price || parseFloat(price) <= 0) errors.push('Price (must be > 0)');
            if (!beds || parseInt(beds) < 0) errors.push('Bedrooms');
            if (!baths || parseInt(baths) < 0) errors.push('Bathrooms');
            if (!sqft || parseInt(sqft) <= 0) errors.push('Square Footage');
            if (imageFiles.length === 0) errors.push('At least 1 image');

            if (errors.length > 0) {
                setValidationError(`Please fill in all required fields before publishing: ${errors.join(', ')}`);
                return;
            }
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('type', propertyType);
        formData.append('listing_type', listingType);
        formData.append('status', status);
        formData.append('beds', beds);
        formData.append('baths', baths);
        formData.append('sqft', sqft);
        formData.append('address', address);
        formData.append('amenities', JSON.stringify(amenities));
        // Append all image files
        imageFiles.forEach((file, index) => {
            formData.append(`image_${index}`, file);
        });
        formData.append('image_count', imageFiles.length.toString());

        try {
            await createProperty(formData);
            router.push('/admin');
        } catch (error) {
            console.error(error);
            setValidationError('Failed to create property. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pt-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">Add New Property</h1>
                    <p className="text-gray-500 mt-1">Create a new listing for your portfolio</p>
                </div>
                <div className="hidden lg:flex gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => handleSubmit('Draft')}
                        disabled={isSubmitting}
                        className="flex-1 lg:flex-none px-6 py-3 rounded-full font-bold bg-white border-2 border-gray-300 text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSubmit('Active')}
                        disabled={isSubmitting}
                        className="flex-1 lg:flex-none px-6 py-3 rounded-full font-bold bg-brand-lime text-brand-dark hover:bg-brand-dark hover:text-brand-lime transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                    </button>
                </div>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-8">
                    <p className="text-red-800 font-bold flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        {validationError}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (Left - 2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Image Upload Zone */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-brand-dark">Media</h3>
                            <div className="relative group">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!canAnalyze || isAnalyzing}
                                    className="flex items-center gap-2 text-sm font-bold text-brand-lime hover:opacity-80 disabled:cursor-not-allowed transition-opacity"
                                >
                                    <Sparkles size={16} />
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze Images (AI Vision)'}
                                </button>
                                {!canAnalyze && !isAnalyzing && (
                                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        Upload at least one image to enable AI analysis.
                                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-brand-lime hover:bg-brand-bg/50 transition-all cursor-pointer group relative">
                            <input
                                type="file"
                                multiple
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageSelect}
                                accept="image/*"
                            />
                            {imageFiles.length > 0 ? (
                                <div className="text-brand-dark font-bold">{imageFiles.length} image(s) selected</div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors">
                                        <Upload className="text-gray-400 group-hover:text-brand-lime transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-brand-dark">Upload Property Images</h3>
                                    <p className="text-gray-400 text-sm">Drag & drop or click to browse (multiple files supported)</p>
                                </>
                            )}
                        </div>

                        {/* Image Preview Grid */}
                        {imageFiles.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-3">Selected Images ({imageFiles.length}):</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {imageFiles.map((file, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Result */}
                        {tags.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-3">Detected Features:</p>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="bg-brand-lime/20 text-brand-dark px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                            {tag}
                                            <X size={14} className="cursor-pointer hover:text-red-500" />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Basic Info & Description */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="font-bold text-brand-dark ml-1">Property Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Modern Sunset Villa"
                                className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime transition-all font-medium text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-bold text-brand-dark ml-1">Location / Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g. 123 Palm Avenue, Miami, FL"
                                className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-brand-dark ml-1">Description</label>
                                <div className="relative group">
                                    <button
                                        onClick={handleGenerateDescription}
                                        disabled={!canGenerate || isGenerating}
                                        className="flex items-center gap-2 text-sm font-bold text-brand-lime hover:opacity-80 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        <Sparkles size={16} />
                                        {isGenerating ? 'Writing...' : 'Generate Description (AI)'}
                                    </button>
                                    {!canGenerate && !isGenerating && (
                                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            Enter Title, Location, and Basic Stats to enable AI writing.
                                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                                        <Loader2 className="animate-spin text-brand-lime" size={32} />
                                    </div>
                                )}
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the property..."
                                    className="w-full h-64 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column (Right - 1/3) */}
                <div className="space-y-6">

                    {/* Publishing Status */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-lg text-brand-dark">Publishing</h3>

                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setListingType('Sale')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${listingType === 'Sale' ? 'bg-brand-lime text-brand-dark shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                            >
                                For Sale
                            </button>
                            <button
                                onClick={() => setListingType('Rent')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${listingType === 'Rent' ? 'bg-brand-lime text-brand-dark shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                            >
                                For Rent
                            </button>
                        </div>

                    </div>

                    {/* Price & Type */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-lg text-brand-dark">Pricing & Type</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 ml-1">Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-gray-50 pl-8 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime font-bold text-brand-dark"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 ml-1">Property Type</label>
                            <CustomSelect
                                options={[
                                    { label: 'House', value: 'House' },
                                    { label: 'Condo', value: 'Condo' },
                                    { label: 'Villa', value: 'Villa' },
                                    { label: 'Apartment', value: 'Apartment' },
                                    { label: 'Land', value: 'Land' }
                                ]}
                                value={propertyType}
                                onChange={setPropertyType}
                            />
                        </div>
                    </div>

                    {/* The Stats */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="font-bold text-lg text-brand-dark">Property Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 ml-1">Bedrooms</label>
                                <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 ml-1">Bathrooms</label>
                                <input type="number" value={baths} onChange={(e) => setBaths(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime font-medium" />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-bold text-gray-400 ml-1">Square Footage</label>
                                <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime font-medium" />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-brand-dark">Amenities</h3>
                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus size={18} className="text-brand-lime" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {MASTER_AMENITIES.map((amenity) => (
                                <label key={amenity.key} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${amenities[amenity.key] ? 'bg-brand-lime border-brand-lime' : 'border-gray-300 group-hover:border-brand-lime'}`}>
                                        {amenities[amenity.key] && <X size={12} className="text-brand-dark rotate-45" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={amenities[amenity.key]}
                                        onChange={() => setAmenities(prev => ({ ...prev, [amenity.key]: !prev[amenity.key] }))}
                                    />
                                    <span className="capitalize text-gray-600 font-medium">{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile/Tablet Bottom Action Buttons */}
            <div className="lg:hidden flex gap-3 mt-8">
                <button
                    onClick={() => handleSubmit('Draft')}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-full font-bold bg-white border-2 border-gray-300 text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                    onClick={() => handleSubmit('Active')}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-full font-bold bg-brand-lime text-brand-dark hover:bg-brand-dark hover:text-brand-lime transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </button>
            </div>
        </div>
    );
}
