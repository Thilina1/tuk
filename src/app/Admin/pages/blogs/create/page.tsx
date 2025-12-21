'use client';

import { useState, useRef, useMemo } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminLayout from "../../../components/AdminLayout";
import { colorPalettes } from '@/config/colorPalettes';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const palettesToShow = [
    { name: 'Yellow', key: 'amber' },
    { name: 'Green', key: 'green' },
    { name: 'Creme', key: 'creme' },
    { name: 'Blue', key: 'blue' },
];

export default function CreateBlogPage() {
    const [color, setColor] = useState('amber'); // Default to the first palette
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [proTips, setProTips] = useState<{ title: string; description: string; }[]>([]);
    const [content1, setContent1] = useState('');
    const [content2, setContent2] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        previewHeader: '',
        previewDescription: '',
        header1: '',
        contentImage: '',
        featured: false,
        titleDescription: '',
        bookingButtonText: '',
        bookingButtonContent: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addTag = () => {
        if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const addProTip = () => {
        setProTips([...proTips, { title: '', description: '' }]);
    };

    const handleProTipChange = (index: number, field: string, value: string) => {
        const updatedProTips = [...proTips];
        updatedProTips[index] = { ...updatedProTips[index], [field]: value };
        setProTips(updatedProTips);
    };

    const removeProTip = (index: number) => {
        const updatedProTips = proTips.filter((_, i) => i !== index);
        setProTips(updatedProTips);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let featuredPosition = null;
            if (formData.featured) {
                const q = query(collection(db, 'blogs'), where('featured', '==', true));
                const featuredBlogsSnapshot = await getDocs(q);
                featuredPosition = featuredBlogsSnapshot.size + 1;
            }

            await addDoc(collection(db, 'blogs'), {
                ...formData,
                content1,
                content2,
                color,
                tags,
                proTips,
                ...(formData.featured && { featuredPosition }),
                createdAt: new Date(),
            });

            router.push('/Admin/pages/blogs');
        } catch (error) {
            console.error('Error creating blog post: ', error);
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
        <div className="container mx-auto p-8 bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Create New Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Blog Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preview Description</label>
                            <textarea name="previewDescription" value={formData.previewDescription} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900">Featured Post</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {palettesToShow.map(({ name, key }) => (
                                    <div key={key} className="flex flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => setColor(key)}
                                            className={`w-10 h-10 rounded-full border-2 ${color === key ? 'border-blue-500' : 'border-transparent'}`}
                                            style={{ backgroundColor: colorPalettes[key].primary_color }}
                                        ></button>
                                        <span className="text-sm mt-1">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content Image URL</label>
                            <input type="text" name="contentImage" value={formData.contentImage} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Booking Button Text</label>
                            <input type="text" name="bookingButtonText" value={formData.bookingButtonText} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Booking Button Content</label>
                            <input type="text" name="bookingButtonContent" value={formData.bookingButtonContent} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Content Sections</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preview Header</label>
                            <input type="text" name="previewHeader" value={formData.previewHeader} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Header 1</label>
                            <input type="text" name="header1" value={formData.header1} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content 1</label>
                            <JoditEditor
                                value={content1}
                                onBlur={newContent => setContent1(newContent)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content 2</label>
                            <JoditEditor
                                value={content2}
                                onBlur={newContent => setContent2(newContent)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tags</h2>
                    <div className="flex items-center mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                            className="flex-grow border-gray-300 rounded-md shadow-sm"
                            placeholder="Add a tag and press Enter"
                        />
                        <button type="button" onClick={addTag} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Add Tag
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-red-500 hover:text-red-700">
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pro-Tips Section */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pro-Tips</h2>
                    {proTips.map((tip, index) => (
                        <div key={index} className="p-4 border rounded-md mb-4 space-y-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800">Pro-Tip {index + 1}</h3>
                                <button type="button" onClick={() => removeProTip(index)} className="text-red-500 hover:text-red-700">
                                    Remove
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" value={tip.title} onChange={(e) => handleProTipChange(index, 'title', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea value={tip.description} onChange={(e) => handleProTipChange(index, 'description', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addProTip} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Add Pro-Tip
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Blog Post'}
                    </button>
                </div>
            </form>
        </div>
        </AdminLayout>
    );
}
