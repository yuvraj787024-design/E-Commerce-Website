import React, { useEffect, useState } from 'react';
import api from "../../utilis/foodRoute"
import { useLocation } from 'react-router-dom';

const Saved = () => {
    const [videos, setVideos] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();

    useEffect(() => {
        api.get("/save", { withCredentials: true })
            .then(response => {
                const fetchedItems = response.data.savedFoods || [];
                
                // Map data from the savedFoods structure matching backend keys
                let savedFoods = fetchedItems.map((item) => ({
                    _id: item.food?._id,
                    video: item.food?.video, // Using 'video' as requested
                    name: item.food?.name || item.food?.title, // Using 'name' as requested
                    description: item.food?.description,
                    likeCount: item.food?.likeCount || 0,
                    savesCount: item.food?.savesCount || 0,
                    foodPartner: item.food?.foodPartner,
                }));

                // Dashboard routing tracking: shift the chosen video to the front of the line
                const initialVideoId = location.state?.initialVideoId;
                if (initialVideoId) {
                    const targetIndex = savedFoods.findIndex(v => v._id === initialVideoId);
                    if (targetIndex !== -1) {
                        const [selectedVideo] = savedFoods.splice(targetIndex, 1);
                        savedFoods = [selectedVideo, ...savedFoods];
                    }
                }
                setVideos(savedFoods);
            })
            .catch((err) => { console.error("Error fetching saved videos:", err); });
    }, [location.state]);

    async function likeVideo(item) {
        const response = await api.post("/like", { foodId: item._id }, { withCredentials: true });
        if (response.data.like) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 0) - 1) } : v));
        }
    }

    const removeSaved = async (item) => {
        try {
            await api.post("/save", { foodId: item._id }, { withCredentials: true });
            // Drop it instantly or optimize values depending on UI preferences
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1) } : v));
        } catch (err) {
            console.error("Error updating save status:", err);
        }
    };

    const handleOrder = (item) => {
        alert(`Order request placed for: ${item.name || 'Selected dish'}`);
    };

    const handleVisitStore = (item) => {
        alert(`Opening store view for vendor item: ${item._id}`);
    };

    const handleScroll = (e) => {
        const scrollTop = e.currentTarget.scrollTop;
        const clientHeight = e.currentTarget.clientHeight;
        const newIndex = Math.round(scrollTop / clientHeight);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    if (videos.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-orange-500 font-medium">
                No saved videos yet.
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 flex justify-center items-center p-0 sm:p-4 transition-all duration-300">
            {/* Main Full Screen Viewport Frame (Mobile vs Laptop Scaled Container) */}
            <div className="w-full h-screen sm:h-[85vh] md:h-[90vh] max-w-112.5 md:max-w-187.5 md:aspect-9/16 bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/40 relative">
                
                {/* Scroll Snap Reel Loop Engine */}
                <div 
                    onScroll={handleScroll}
                    className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {videos.map((item, index) => {
                        const isCurrent = index === activeIndex;
                        return (
                            <div 
                                key={item._id} 
                                className="w-full h-full snap-start snap-always relative bg-zinc-900 flex items-center justify-center"
                            >
                                {/* Video Element Engine Player */}
                                {item.video ? (
                                    <video
                                        src={item.video} // Using mapped item.video asset pointer references
                                        className="w-full h-full object-cover"
                                        loop
                                        playsInline
                                        autoPlay={isCurrent}
                                        muted={!isCurrent}
                                        ref={(el) => {
                                            if (el) {
                                                if (isCurrent) el.play().catch(() => {});
                                                else el.pause();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-zinc-500 text-xs">Video content data missing</div>
                                )}

                                {/* Interaction Action Column */}
                                <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 z-30">
                                    
                                    {/* Like Control Bubble */}
                                    <button 
                                        onClick={() => likeVideo(item)} 
                                        className="group flex flex-col items-center transition-transform active:scale-90"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center text-xl text-white border border-zinc-700/40 hover:bg-orange-600 hover:border-orange-500 transition-colors duration-200">
                                            ❤️
                                        </div>
                                        <span className="text-[11px] text-white font-medium mt-1 drop-shadow-md">
                                            {item.likeCount || 0}
                                        </span>
                                    </button>

                                    {/* Save Button (Acts as Unsave Action Here) */}
                                    <button 
                                        onClick={() => removeSaved(item)} 
                                        className="group flex flex-col items-center transition-transform active:scale-90"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-orange-600/90 backdrop-blur-md flex items-center justify-center text-xl text-white border border-orange-500 shadow-md shadow-orange-600/30">
                                            🔥
                                        </div>
                                        <span className="text-[11px] text-orange-400 font-bold mt-1 drop-shadow-md">
                                            Saved
                                        </span>
                                    </button>

                                    {/* Store Shortcut Button */}
                                    <button 
                                        onClick={() => handleVisitStore(item)}
                                        className="group flex flex-col items-center transition-transform active:scale-90"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-orange-500 to-red-500 shadow-lg flex items-center justify-center text-xl text-white">
                                            🏪
                                        </div>
                                        <span className="text-[10px] text-orange-400 font-bold tracking-wider uppercase mt-1 drop-shadow-md">
                                            Store
                                        </span>
                                    </button>

                                    {/* Checkout Order CTA Accent Button */}
                                    <button 
                                        onClick={() => handleOrder(item)}
                                        className="mt-2 px-4 py-2.5 bg-linear-to-r from-red-600 via-orange-600 to-orange-500 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-red-600/30 active:scale-95 transition-all border border-red-400/20 whitespace-nowrap"
                                    >
                                        Order 🛒
                                    </button>
                                </div>

                                {/* Bottom Brand & Description Overlay Area */}
                                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 pb-6 flex flex-col justify-end text-white z-20 pointer-events-none">
                                    <h2 className="font-extrabold text-base tracking-wide text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-400">
                                        @{item.name || "Chef Special"}
                                    </h2>
                                    <p className="text-xs text-zinc-200 mt-1 line-clamp-2 max-w-[85%] leading-relaxed">
                                        {item.description || "No description loaded for this bookmarked dish configuration."}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Saved;