import React, { useEffect, useState } from 'react';
import api from "../../utilis/foodRoute"
import { useLocation, useNavigate } from 'react-router-dom';

const ReelFeed = () => {
    const navigate = useNavigate()
    const [videos, setVideos] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // axios.get("http://localhost:3000/api/food", { withCredentials: true })
        api.get("/", { withCredentials: true })
            .then(response => {
                let fetchedVideos = response.data.foodItems || [];
                
                // Track if a specific video was clicked on the Dashboard
                const initialVideoId = location.state?.initialVideoId;
                
                if (initialVideoId) {
                    const targetIndex = fetchedVideos.findIndex(v => v._id === initialVideoId);
                    if (targetIndex !== -1) {
                        // Splice and move the target video to index 0 so it starts instantly
                        const [selectedVideo] = fetchedVideos.splice(targetIndex, 1);
                        fetchedVideos = [selectedVideo, ...fetchedVideos];
                    }
                }
                
                setVideos(fetchedVideos);
            })
            .catch((err) => { console.error("Error fetching reels:", err); });
    }, [location.state]);

    async function likeVideo(item) {
        const response = await api.post("/like", { foodId: item._id }, { withCredentials: true });
        if (response.data.like) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 0) - 1) } : v));
        }
    }

    async function saveVideo(item) {
        const response = await api.post("/save", { foodId: item._id }, { withCredentials: true });
        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 0) - 1) } : v));
        }
    }

  const handleOrder = (item) => {
    navigate("/order", {
        state: {
            foodId: item._id,
            price: item.price
        }
    });
};

    const handleVisitStore = (item) => {
        navigate(`/food-partner/${item.foodPartner}`)
    };

    // Tracks scroll positioning to accurately play/pause reels in viewport snapping contexts
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
                No videos available.
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 flex justify-center items-center p-0 sm:p-4 transition-all duration-300">
            {/* Core Responsive Frame: Seamless full-bleed on mobile, neat floating window on laptops */}
            <div className="w-full h-screen sm:h-[85vh] md:h-[90vh] max-w-112.5 md:max-w-187.5 md:aspect-9/16 bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/40 relative">
                
                {/* Scroll Container Snap Pipeline */}
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
                                {/* Video Element Wrapper */}
                                {item.video ? (
                                    <video
                                        src={item.video}
                                        className="w-full h-full object-cover"
                                        loop
                                        playsInline
                                        autoPlay={isCurrent}
                                        muted={!isCurrent} // Helps override strict browser auto-play locks
                                        ref={(el) => {
                                            if (el) {
                                                if (isCurrent) el.play().catch(() => {});
                                                else el.pause();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-zinc-500 text-xs">Video file missing</div>
                                )}

                                {/* Right Side Interaction Overlay Bar */}
                                <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 z-30 animate-fade-in">
                                    
                                    {/* Like Button */}
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

                                    {/* Save Button */}
                                    <button 
                                        onClick={() => saveVideo(item)} 
                                        className="group flex flex-col items-center transition-transform active:scale-90"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-zinc-900/60 backdrop-blur-md flex items-center justify-center text-xl text-white border border-zinc-700/40 hover:bg-red-600 hover:border-red-500 transition-colors duration-200">
                                            🔖
                                        </div>
                                        <span className="text-[11px] text-white font-medium mt-1 drop-shadow-md">
                                            {item.savesCount || 0}
                                        </span>
                                    </button>

                                    {/* Visit Store Action Button */}
                                    <button 
                                        onClick={() => handleVisitStore(item)}
                                        className="group flex flex-col items-center transition-transform active:scale-90"
                                        title="Visit Store"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 flex items-center justify-center text-xl text-white transform group-hover:scale-105 transition-all">
                                            🏪
                                        </div>
                                        <span className="text-[10px] text-orange-400 font-bold tracking-wider uppercase mt-1 drop-shadow-md">
                                            Store
                                        </span>
                                    </button>

                                    {/* High Contrast Order Button Accent */}
                                    <button 
                                        onClick={() => handleOrder(item)}
                                        className="mt-2 px-4 py-2.5 bg-linear-to-r from-red-600 via-orange-600 to-orange-500 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-red-600/30 active:scale-95 transition-all border border-red-400/20 whitespace-nowrap"
                                    >
                                        Order 🛒
                                    </button>
                                </div>

                                {/* Bottom Info Text Details Description Gradient Banner */}
                                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 pb-6 flex flex-col justify-end text-white z-20 pointer-events-none">
                                    <h2 className="font-extrabold text-base tracking-wide text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-400">
                                        @{item.name || "Chef Special"}
                                    </h2>
                                    <p className="text-xs text-zinc-200 mt-1 line-clamp-2 max-w-[85%] font-normal leading-relaxed">
                                        {item.description || "No description loaded for this feed reel asset profile link."}
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

export default ReelFeed;