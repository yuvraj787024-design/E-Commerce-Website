import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../utilis/foodRoute'
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[0];
        if (!file) { return; }
        if (!file.type.startsWith("video/")) {
            setVideoFile(null);
            setFileError("Please select a valid video file.");
            return;
        }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append("videoFile", videoFile);
        try {
            const response = await api.post("/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(-1);
        } catch (err) {
            console.error("Error creating food post:", err);
        } finally {
            setLoading(false);
        }
    };

 const isDisabled = useMemo(
    () =>
        !name.trim() ||
        !price ||
        Number(price) <= 0 ||
        !videoFile ||
        loading,
    [name, price, videoFile, loading]
);

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 p-4 sm:p-6 md:p-10 flex items-center justify-center transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden animate-fade-in">
                
                {/* Header Context Bar */}
                <header className="bg-linear-to-r from-orange-500 to-red-600 p-6 md:p-8 text-white">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                        🍳 Add Premium Dish Log
                    </h1>
                    <p className="text-xs sm:text-sm text-orange-100 mt-1">
                        Upload your short cooking video log, title your work, and list active vendor specifications.
                    </p>
                </header>

                <form className="p-6 md:p-8 space-y-6" onSubmit={onSubmit}>
                    
                    {/* Media File Picker Area */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="foodVideo" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Food Video Reel
                        </label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="hidden"
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                        />

                        {/* Interactive Drag & Drop Area */}
                        <div
                            className="group relative border-2 border-dashed border-orange-200/80 bg-orange-50/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/40 transition-all duration-200"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                    📹
                                </div>
                                <div className="text-xs sm:text-sm text-zinc-700">
                                    <strong className="text-orange-600 font-bold">Tap to upload</strong> or drag and drop files here
                                </div>
                                <div className="text-[10px] text-zinc-400">MP4, WebM, MOV • Up to ~100MB</div>
                            </div>
                        </div>

                        {fileError && <p className="text-xs font-semibold text-red-500 mt-1" role="alert">⚠️ {fileError}</p>}

                        {/* File Meta Chip Accent Info */}
                        {videoFile && (
                            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-base">🎬</span>
                                    <span className="font-medium truncate max-w-45 sm:max-w-xs">{videoFile.name}</span>
                                    <span className="text-[10px] bg-zinc-200/70 px-1.5 py-0.5 rounded text-zinc-500 font-semibold">
                                        {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button type="button" className="px-2.5 py-1 font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" onClick={openFileDialog}>Change</button>
                                    <button type="button" className="px-2.5 py-1 font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => { setVideoFile(null); setFileError(''); }}>Remove</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compact Square Aspect Video Preview Frame */}
                    {videoURL && (
                        <div className="flex flex-col space-y-2 max-w-50">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Player Preview</span>
                            <div className="aspect-square w-full rounded-xl overflow-hidden bg-black border border-orange-100 shadow-sm relative">
                                <video className="w-full h-full object-cover" src={videoURL} controls playsInline preload="metadata" />
                            </div>
                        </div>
                    )}

                    {/* Dish Name Field Input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="foodName" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Dish Name
                        </label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Crunchy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all text-zinc-800 placeholder-zinc-400"
                            required
                        />
                    </div>

                    {/* Price Field */}
<div className="flex flex-col space-y-1.5">
    <label
        htmlFor="foodPrice"
        className="text-xs font-bold uppercase tracking-wider text-zinc-500"
    >
        Price (₹)
    </label>

    <input
        id="foodPrice"
        type="number"
        min="1"
        step="1"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all text-zinc-800 placeholder-zinc-400"
        required
    />
</div>

                    {/* Recipe Logs Description Input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="foodDesc" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Ingredients & Description
                        </label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            placeholder="Describe your dish logs: key ingredients, pricing layers, spice matrix metrics, cooking timeline notes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all text-zinc-800 placeholder-zinc-400 resize-none"
                        />
                    </div>

                    {/* Submission Layout Footprint Action Row */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2.5 border border-zinc-200 text-zinc-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-50 active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isDisabled}
                            className={`px-6 py-2.5 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                                isDisabled 
                                    ? 'bg-zinc-300 border-transparent shadow-none cursor-not-allowed text-zinc-400' 
                                    : 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/20 active:scale-95'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Publishing...
                                </>
                            ) : 'Save Food Dish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;