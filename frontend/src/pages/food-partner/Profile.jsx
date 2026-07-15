import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utilis/foodPartnerRoute';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isOwner, setIsOwner] = useState(false); 
    const [isPartnerLoggedIn, setIsPartnerLoggedIn] = useState(false); 
    const [ordersCount, setOrdersCount] = useState(0);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    
    // Modal states
    const [activeVideoIndex, setActiveVideoIndex] = useState(null); 
    const [likedVideos, setLikedVideos] = useState({}); 
    const [savedVideos, setSavedVideos] = useState({}); 

useEffect(() => {
        // 1. Fetch profile data
        api.get(`/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner);
                setVideos(response.data.foodPartner?.foodItems || []);
                
                // Check if logged in actor is a food partner
                const loggedInPartner = JSON.parse(localStorage.getItem("foodPartner"));
                if (loggedInPartner) {
                    setIsPartnerLoggedIn(true);
                    setIsOwner(loggedInPartner._id === id);
                } else {
                    setIsPartnerLoggedIn(false);
                    setIsOwner(false);
                }
            })
            .catch(err => console.error("Error retrieving food partner profile:", err));

        // 2. Fetch orders and calculate active orders count
        api.get('/orders', { withCredentials: true })
            .then(res => {
                const allOrders = res.data.orders || [];
                // Filter: keep orders that are NOT Delivered and NOT Cancelled
                const activeOrders = allOrders.filter(
                    order => order.status !== "Delivered" && order.status !== "Cancelled"
                );
                setActiveOrdersCount(activeOrders.length);
            })
            .catch(err => console.error("Error fetching orders for stats:", err));
    }, [id]);

    // Handle Keyboard Navigation inside Modal (Up/Down/Esc)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeVideoIndex === null) return;
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowDown') {
                if (activeVideoIndex < videos.length - 1) {
                    setActiveVideoIndex(prev => prev + 1);
                }
            } else if (e.key === 'ArrowUp') {
                if (activeVideoIndex > 0) {
                    setActiveVideoIndex(prev => prev - 1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeVideoIndex, videos]);

    const addFood = () => {
        navigate('/create-food');
    };

    const viewOrders = () => {
        navigate(`/userOrder/${id}`);
    };

    const closeModal = () => {
        setActiveVideoIndex(null);
    };

    // Interaction Handlers
    const toggleLike = (videoId, e) => {
        e.stopPropagation();
        setLikedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
        // Optional: Trigger API request here to persist like status
    };

    const toggleSave = (videoId, e) => {
        e.stopPropagation();
        setSavedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
        // Optional: Trigger API request here to persist save status
    };

    const handleOrder = (video, e) => {
        e.stopPropagation();
        // Redirect user to checkout or handling system with item context
        console.log("Ordering item:", video);
            navigate("/order", {
        state: {
            foodId: video._id,
            price: video.price
        }
    });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 text-zinc-800 transition-colors duration-300">
            
            {/* Top Branding Profile Banner */}
            <div className="h-36 md:h-48 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 shadow-inner relative" />

            {/* Profile Meta Info Wrapper */}
            <div className="max-w-4xl mx-auto px-4 pb-12 relative">
                
                {/* Header Metrics Details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-8 gap-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                        {/* Avatar Image */}
                        <img 
                            className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-white" 
                            src="https://img.magnific.com/free-vector/charming-female-chef-holding-delicious-sandwich-handdrawn-illustration-vector_56104-2570.jpg?semt=ais_hybrid&w=740&q=80" 
                            alt={profile?.name || "Partner Avatar"} 
                        />
                        <div className="sm:mb-2">
                            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                                {profile?.name || "Loading Vendor..."}
                            </h1>
                            <p className="text-xs md:text-sm font-medium text-orange-600/90 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                                📍 {profile?.address || "Address Not Specified"}
                            </p>
                        </div>
                    </div>

                    {/* Conditional Buttons based on logged in Partner vs Regular User */}
                    {isPartnerLoggedIn && isOwner && (
                        <div className="flex gap-2 sm:mb-2 flex-wrap justify-center">
                            <button 
                                onClick={addFood}
                                className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all duration-150"
                            >
                                ➕ Add New Dish
                            </button>
                            <button 
                                onClick={viewOrders}
                                className="px-5 py-2.5 bg-linear-to-r from-zinc-800 to-zinc-900 hover:from-black hover:to-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition-all duration-150"
                            >
                                📋 View Orders
                            </button>
                        </div>
                    )}
                </div>

 {/* Dashboard Stats Panel Layout Grid */}
<div className="grid grid-cols-2 gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-orange-100 shadow-sm mb-10">
    <div className="flex flex-col items-center justify-center p-3 border-r border-orange-50">
        <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">
            {/* CHANGE 1: Use the videos array length to count uploaded videos */}
            {videos.length}
        </span>
        <span className="text-[10px] md:text-xs font-bold tracking-wider text-zinc-400 uppercase mt-1">
            {/* LABEL UPDATE */}
            Videos Uploaded
        </span>
    </div>
<div className="flex flex-col items-center justify-center p-3">
    <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">
        {activeOrdersCount}
    </span>
    <span className="text-[10px] md:text-xs font-bold tracking-wider text-zinc-400 uppercase mt-1">
        Active Orders
    </span>
</div>
</div>

                {/* Separator Accent */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600/80 whitespace-nowrap">
                        Video Catalog ({videos.length})
                    </span>
                    <hr className="w-full border-orange-100" />
                </div>

                {/* Video Grid layout */}
                {videos.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-orange-50 text-zinc-400 text-sm font-medium">
                        No videos published by this food partner yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {videos.map((v, index) => (
                            <div 
                                key={v._id || v.id} 
                                onClick={() => setActiveVideoIndex(index)}
                                className="group relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer"
                            >
                                {v.video ? (
                                    <video
                                        className="w-full h-full object-cover pointer-events-none"
                                        src={v.video} 
                                        muted 
                                        playsInline
                                        preload="metadata"
                                        onMouseEnter={(e) => e.target.play().catch(() => {})}
                                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px]">
                                        Empty
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                                    <span className="text-xl drop-shadow-md">▶️</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FULL SCREEN REEL MODAL PLAYER */}
            {activeVideoIndex !== null && (
                <div 
                    onClick={closeModal}
                    className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-0 sm:p-4 transition-all duration-300"
                >
                    {/* Main Reel Frame Container */}
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="relative w-full h-full sm:h-[85vh] max-w-md bg-zinc-950 sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-zinc-800"
                    >
                        {/* Native Loop-enabled Video Engine */}
                        <video 
                            key={videos[activeVideoIndex].video}
                            src={videos[activeVideoIndex].video} 
                            className="w-full h-full object-cover"
                            controls={false} 
                            autoPlay 
                            playsInline
                            loop
                        />

                        {/* Close Modal Controls */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-lg font-bold z-50 hover:bg-black/75 transition-colors"
                        >
                            ✕
                        </button>

                        {/* Interactive Sidebar (Like, Save, Order buttons) */}
                        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-40">
                            {/* Like Action */}
                            <button 
                                onClick={(e) => toggleLike(videos[activeVideoIndex]._id || videos[activeVideoIndex].id, e)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
                                    likedVideos[videos[activeVideoIndex]._id || videos[activeVideoIndex].id]
                                        ? 'bg-red-500/80 border-red-500 text-white scale-110' 
                                        : 'bg-black/40 border-white/10 text-white hover:scale-105'
                                }`}>
                                    ❤️
                                </div>
                                <span className="text-[10px] text-white/90 font-bold drop-shadow-md tracking-wider">
                                    {likedVideos[videos[activeVideoIndex]._id || videos[activeVideoIndex].id] ? 'Liked' : 'Like'}
                                </span>
                            </button>

                            {/* Save Action */}
                            <button 
                                onClick={(e) => toggleSave(videos[activeVideoIndex]._id || videos[activeVideoIndex].id, e)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
                                    savedVideos[videos[activeVideoIndex]._id || videos[activeVideoIndex].id]
                                        ? 'bg-yellow-500/80 border-yellow-500 text-white scale-110' 
                                        : 'bg-black/40 border-white/10 text-white hover:scale-105'
                                }`}>
                                    🔖
                                </div>
                                <span className="text-[10px] text-white/90 font-bold drop-shadow-md tracking-wider">
                                    {savedVideos[videos[activeVideoIndex]._id || videos[activeVideoIndex].id] ? 'Saved' : 'Save'}
                                </span>
                            </button>

                            {/* Quick Checkout / Order Action */}
                            <button 
                                onClick={(e) => handleOrder(videos[activeVideoIndex], e)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border border-transparent text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-110 active:scale-95">
                                    🛒
                                </div>
                                <span className="text-[10px] text-white font-extrabold drop-shadow-md tracking-widest uppercase">
                                    Order
                                </span>
                            </button>
                        </div>

                        {/* Title & Metadata Bottom Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-6 pt-16 flex flex-col justify-end text-white">
                            <h3 className="text-base font-black tracking-tight mb-1">
                                {videos[activeVideoIndex].name || "Special Dish"}
                            </h3>
                            <p className="text-xs text-white/70 line-clamp-2 font-medium">
                                {videos[activeVideoIndex].description || "Sourced fresh and crafted locally."}
                            </p>
                        </div>

                        {/* Multi-reel Carousel Navigation arrows (Visible on Desktop hover) */}
                        {activeVideoIndex > 0 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveVideoIndex(prev => prev - 1); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white text-xs flex items-center justify-center transition-all opacity-0 sm:group-hover:opacity-100 sm:opacity-50"
                            >
                                ◀
                            </button>
                        )}
                        {activeVideoIndex < videos.length - 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveVideoIndex(prev => prev + 1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white text-xs flex items-center justify-center transition-all opacity-0 sm:group-hover:opacity-100 sm:opacity-50"
                            >
                                ▶
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;