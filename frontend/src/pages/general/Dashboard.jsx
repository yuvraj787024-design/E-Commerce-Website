import React, { useEffect, useState, useMemo } from 'react';
import api from '../../utilis/foodRoute'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // Options: all, popular, saved
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/", { withCredentials: true } )
            .then(response => {
                setVideos(response.data.foodItems || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching dashboard items:", err);
                setLoading(false);
            });
    }, []);

    // Directs user to the Home feed, pointing specifically to the chosen video element
    const handleVideoClick = (item) => {
        navigate('/reels', { state: { initialVideoId: item._id } });
    };

    // Client-side filtering and search pipeline logic
    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
const matchesSearch =
    (video.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (video.description?.toLowerCase().includes(searchQuery.toLowerCase()));
            
            if (!matchesSearch) return false;

            if (activeFilter === "popular") {
                return (video.likeCount || 0) > 5; // Example threshold for popular tier
            }
            if (activeFilter === "saved") {
                return (video.savesCount || 0) > 0;
            }
            return true;
        });
    }, [videos, searchQuery, activeFilter]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-orange-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
     <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 p-4 sm:p-6 md:p-10 transition-colors duration-300">
            
            {/* Header Title Section */}
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600 tracking-tight">
                    Food Reels Hub
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-orange-700/70">
                    Search, filter, and dive straight into your curated cooking logs.
                </p>
            </div>

            {/* Filter Area & Search Bar Controls */}
            <div className="mb-8 flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100/80 md:flex-row md:items-center md:justify-between">
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-3 flex items-center text-orange-400">🔍</span>
                    <input 
                        type="text"
                        placeholder="Search recipes, dishes or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-orange-100 bg-orange-50/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all text-zinc-800"
                    />
                </div>

                {/* Filter Switcher Buttons */}
                <div className="flex flex-wrap gap-2 items-center">
                    {[
                        { id: 'all', label: 'All Items' },
                        { id: 'popular', label: '🔥 Trending' },
                        { id: 'saved', label: '🔖 Bookmarked' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 ${
                                activeFilter === tab.id
                                    ? 'bg-linear-to-r from-orange-500 to-red-500 text-white border-transparent shadow-md shadow-orange-500/20'
                                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amazon-inspired Compact Layout Content Grid */}
            {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-orange-100 text-center p-6">
                    <p className="text-zinc-400 text-sm sm:text-base font-medium">No matches found for your current criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {filteredVideos.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleVideoClick(item)}
                            className="group flex flex-col overflow-hidden rounded-xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                        >
                            {/* Amazon Wrap Mock Structure - Compact Square Aspect Container */}
                            <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                                {item.video ? (
                                    <video
                                        src={item.video}
                                        className="h-full w-full object-cover"
                                        muted
                                        playsInline
                                        preload="metadata" // Drastically optimizes visual rendering pipelines
                                        onMouseEnter={(e) => e.target.play().catch(() => {})}
                                        onMouseLeave={(e) => { e.target.pause(); }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-orange-100 text-orange-500 text-xs">
                                        No Media
                                    </div>
                                )}
                                
                                {/* Overlay Accent Badge */}
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block text-center">
                                        Open Reel ⚡
                                    </span>
                                </div>
                            </div>

                            {/* Text Info Section */}
                           {/* Text Info Section */}
<div className="flex flex-1 flex-col p-2.5 bg-white">
    <h3 className="font-bold text-xs text-zinc-800 line-clamp-1 group-hover:text-orange-600 transition-colors duration-150">
        {item.name || "Food Item"}
    </h3>

    <p className="mt-0.5 text-[11px] leading-tight text-zinc-500 line-clamp-2">
        {item.description || "View video documentation recipe logs."}
    </p>

    {/* Price Tag */}
    <div className="mt-2">
        <span className="inline-flex items-center rounded-lg bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700">
            ₹{item.price}
        </span>
    </div>

    {/* Engagement Bar */}
    <div className="mt-2 flex items-center justify-between border-t border-zinc-50 pt-1.5 text-[10px] font-medium text-orange-600">
        <span className="flex items-center gap-0.5">
            ❤️ {item.likeCount || 0}
        </span>

        <span className="flex items-center gap-0.5 text-zinc-400">
            🔖 {item.savesCount || 0}
        </span>
    </div>
</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div> );
};

export default Dashboard;