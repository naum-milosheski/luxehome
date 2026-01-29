'use client';

import { useState, useEffect } from 'react';
import { Upload, Sparkles, Loader2, Plus, X, ArrowLeft } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import { updateProperty, getPropertyById } from '@/app/actions/properties';
import { analyzeImage, generateDescription } from '@/app/actions/ai';
import { useRouter } from 'next/navigation';
import { MASTER_AMENITIES, createEmptyAmenities } from '@/lib/amenities';
import { Property } from '@/types/supabase';
import Link from 'next/link';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState('');
    const [amenities, setAmenities] = useState(createEmptyAmenities());

    useEffect(() => {
        loadProperty();
    }, [params.id]);

    const loadProperty = async () => {
        const data = await getPropertyById(params.id);
        if (!data) {
            alert('Property not found');
            router.push('/admin/inventory');
            return;
        }

        setProperty(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setAddress(data.address);
        setBeds(data.beds.toString());
        setBaths(data.baths.toString());
        setSqft(data.sqft.toString());
        setPropertyType(data.type);
        setListingType(data.listing_type);
        setExistingImage(data.image);

        // Set amenities if they exist
        if (data.amenities && typeof data.amenities === 'object') {
            setAmenities(data.amenities as any);
        }

        setIsLoading(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return alert('Please upload a new image first');
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        const detectedTags = await analyzeImage(formData);
        setTags(detectedTags);

        // Auto-check amenities based on tags
        const newAmenities = { ...amenities };
        const lowerTags = detectedTags.map(t => t.toLowerCase());

        if (lowerTags.some(t => t.includes('pool') && t.includes('infinity'))) newAmenities.infinityPool = true;
        else if (lowerTags.some(t => t.includes('pool'))) newAmenities.pool = true;
        if (lowerTags.some(t => t.includes('gym') || t.includes('fitness'))) newAmenities.gym = true;
        if (lowerTags.some(t => t.includes('ocean') || t.includes('sea') || t.includes('beach'))) newAmenities.oceanView = true;
        if (lowerTags.some(t => t.includes('city'))) newAmenities.cityView = true;
        if (lowerTags.some(t => t.includes('mountain'))) newAmenities.mountainView = true;
        if (lowerTags.some(t => t.includes('parking') || t.includes('garage'))) newAmenities.parking = true;
        if (lowerTags.some(t => t.includes('security') || t.includes('gated'))) newAmenities.security = true;
        if (lowerTags.some(t => t.includes('wifi') || t.includes('internet'))) newAmenities.wifi = true;
        if (lowerTags.some(t => t.includes('spa') || t.includes('hot tub'))) newAmenities.spa = true;
        if (lowerTags.some(t => t.includes('sauna'))) newAmenities.sauna = true;
        if (lowerTags.some(t => t.includes('theater') || t.includes('cinema'))) newAmenities.homeTheater = true;
        if (lowerTags.some(t => t.includes('wine'))) newAmenities.wineCellar = true;
        if (lowerTags.some(t => t.includes('smart home') || t.includes('automation'))) newAmenities.smartHome = true;
        if (lowerTags.some(t => t.includes('fireplace'))) newAmenities.fireplace = true;
        if (lowerTags.some(t => t.includes('elevator') || t.includes('lift'))) newAmenities.elevator = true;

        setAmenities(newAmenities);
        setIsAnalyzing(false);
    };

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        const activeAmenities = Object.keys(amenities).filter(k => amenities[k as keyof typeof amenities]);
        const details = `
            Type: ${propertyType}
            Title: ${title}
            Location: ${address}
            Stats: ${beds} beds, ${baths} baths, ${sqft} sqft
            Key Features: ${tags.join(', ')}
            Amenities: ${activeAmenities.join(', ')}
        `;
        const generatedText = await generateDescription(details);
        setDescription(generatedText);
        setIsGenerating(false);
    };

    const handleSubmit = async (status: 'Draft' | 'Active') => {
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
        formData.append('existing_image', existingImage);
        if (imageFile) formData.append('image', imageFile);

        try {
            await updateProperty(params.id, formData);
            router.push('/admin/inventory');
        } catch (error) {
            console.error(error);
            alert('Failed to update property');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto pb-20">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-lime" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8 pt-8">
                <div>
                    <Link href="/admin/inventory" className="inline-flex items-center text-gray-500 hover:text-brand-dark mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Inventory
                    </Link>
                    <h1 className="text-3xl font-bold text-brand-dark">Edit Property</h1>
                    <p className="text-gray-500 mt-1">Update your listing details</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSubmit('Draft')}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-full font-bold bg-white border-2 border-gray-300 text-brand-dark hover:border-brand-dark transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSubmit('Active')}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-full font-bold bg-brand-lime text-brand-dark hover:bg-brand-dark hover:text-brand-lime transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                    </button>
                </div>
            </div>

            {/* Rest of the form is identical to Add Property page */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (Left - 2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Upload Zone */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-brand-dark">Media</h3>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !imageFile}
                                className="flex items-center gap-2 text-sm font-bold text-brand-lime hover:opacity-80 disabled:opacity-50"
                            >
                                <Sparkles size={16} />
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Images (AI Vision)'}
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-brand-lime hover:bg-brand-bg/50 transition-all cursor-pointer group relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageSelect} accept="image/*" />
                            {imageFile ? (
                                <div className="text-brand-dark font-bold">{imageFile.name}</div>
                            ) : existingImage ? (
                                <div>
                                    <img src={existingImage} alt="Current" className="max-h-40 mx-auto mb-2 rounded-lg" />
                                    <p className="text-sm text-gray-500">Click to change image</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors">
                                        <Upload className="text-gray-400 group-hover:text-brand-lime transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-brand-dark">Upload Property Images</h3>
                                    <p className="text-gray-400 text-sm">Drag & drop or click to browse</p>
                                </>
                            )}
                        </div>

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
                                <button
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 text-sm font-bold text-brand-lime hover:opacity-80 disabled:opacity-50"
                                >
                                    <Sparkles size={16} />
                                    {isGenerating ? 'Writing...' : 'Generate Description (AI)'}
                                </button>
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
                            <div className="flex items-center">
                                <Plus size={18} className="text-brand-lime" />
                            </div>
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
        </div>
    );
}
