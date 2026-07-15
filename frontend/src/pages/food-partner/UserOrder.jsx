import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utilis/foodPartnerRoute'; // Reuses your axios/api instance with credentials

const UserOrder = () => {
    const { id } = useParams(); // food-partner ID from URL
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // Order status configurations mapping to chronological indices for our Amazon-style Stepper
    const statusSteps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];
    const statusEnum = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    // Fetch orders for this food partner on mount
    useEffect(() => {
        setLoading(true);
        api.get('/orders', { withCredentials: true })
            .then(response => {
                // Adjust if your API returns the orders array directly or nested
                setOrders(response.data.orders || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders. Please try again later.");
                setLoading(false);
            });
    }, [id]);

    // Handle updating status via PATCH API
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await api.patch(`/orders/${orderId}/status`, 
                { status: newStatus },
                { withCredentials: true }
            );
            
            if (response.data) {
                // Dynamically update the local state to match the updated order status
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Helper to calculate the progress percentage for the stepper timeline
    const getProgressWidth = (currentStatus) => {
        if (currentStatus === "Cancelled") return "100%";
        const index = statusSteps.indexOf(currentStatus);
        if (index === -1) return "0%";
        return `${(index / (statusSteps.length - 1)) * 100}%`;
    };

    // Dynamic formatting for Date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50/50 via-white to-red-50/50 text-zinc-800 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Back Navigation Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 flex items-center gap-1 mb-2"
                        >
                            ◀ Back to Profile
                        </button>
                        <h1 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">
                            Partner Order Dashboard 📋
                        </h1>
                    </div>
                    <div className="bg-orange-500/10 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold tracking-wide">
                        Active Orders: {orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Orders Main List */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                        <span className="text-4xl">🥡</span>
                        <h3 className="mt-4 text-base font-bold text-zinc-800">No incoming orders yet</h3>
                        <p className="text-zinc-400 text-xs mt-1">When users order items from your dishes, they will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isCancelled = order.status === "Cancelled";
                            const currentStepIndex = statusSteps.indexOf(order.status);

                            return (
                                <div 
                                    key={order._id} 
                                    className="bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    {/* Order Meta Header Information Block */}
                                    <div className="bg-zinc-50 border-b border-zinc-100 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-medium text-zinc-500">
                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2">
                                            <div>
                                                <p className="uppercase text-[10px] tracking-wider text-zinc-400 font-bold">Order Placed</p>
                                                <p className="text-zinc-700 font-semibold mt-0.5">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="uppercase text-[10px] tracking-wider text-zinc-400 font-bold">Total Bill</p>
                                                <p className="text-zinc-900 font-black mt-0.5 text-sm">₹{order.price}</p>
                                            </div>
                                            <div>
                                                <p className="uppercase text-[10px] tracking-wider text-zinc-400 font-bold">Recipient Customer</p>
                                                <p className="text-zinc-700 font-semibold mt-0.5">{order.user?.fullName || "Guest User"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-200">
                                            <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Order ID: {order._id}</span>
                                        </div>
                                    </div>

                                    {/* Order Body Details Grid */}
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                                        
                                        {/* Left Side: Dish & Address Context details */}
                                        <div className="md:col-span-5 space-y-4">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                                                    Item Requested
                                                </span>
                                                <h3 className="text-lg font-bold text-zinc-900 mt-2">
                                                    {order.food?.name || "Unspecified Specialty Dish"}
                                                </h3>
                                                <p className="text-zinc-500 text-xs mt-1">Payment Method: <span className="font-semibold text-zinc-700">{order.paymentType}</span></p>
                                            </div>
                                            
                                            <div className="border-t border-zinc-100 pt-4">
                                                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Shipping Destination Address</p>
                                                <p className="text-zinc-600 text-xs mt-1 font-medium leading-relaxed">
                                                    📍 {order.address || "Address detail unavailable"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Interface to Update Order State */}
                                        <div className="md:col-span-7 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 flex flex-col justify-center">
                                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-400 block mb-2">
                                                Perform Status Operation
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={order.status || "Pending"}
                                                    disabled={updatingId === order._id}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="w-full bg-white border border-zinc-200 hover:border-orange-200 text-zinc-800 text-xs font-bold rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer disabled:opacity-50 appearance-none"
                                                >
                                                    {statusEnum.map((st) => (
                                                        <option key={st} value={st}>
                                                            Change status to: {st}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                                                    ▾
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Stepper Tracking Line (Amazon Style) */}
                                    <div className="px-6 py-8 border-t border-zinc-100 bg-white">
                                        <div className="relative">
                                            
                                            {/* Grey Background track */}
                                            <div className="absolute top-2.5 left-0 right-0 h-1 bg-zinc-100 rounded-full" />
                                            
                                            {/* Colored active fill track */}
                                            <div 
                                                className={`absolute top-2.5 left-0 h-1 rounded-full transition-all duration-500 ease-out ${
                                                    isCancelled ? 'bg-red-500' : 'bg-orange-500'
                                                }`}
                                                style={{ width: getProgressWidth(order.status) }}
                                            />

                                            {/* Stepper nodes rendering */}
                                            {isCancelled ? (
                                                <div className="flex items-center gap-4 pl-1">
                                                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">✕</div>
                                                    <div>
                                                        <span className="text-xs font-black text-red-500 uppercase tracking-wide">Cancelled</span>
                                                        <p className="text-[10px] text-zinc-400">This order request was canceled by you or the customer.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative flex justify-between">
                                                    {statusSteps.map((step, idx) => {
                                                        const isCompleted = idx <= currentStepIndex;
                                                        const isCurrent = idx === currentStepIndex;

                                                        return (
                                                            <div key={step} className="flex flex-col items-center group relative z-10">
                                                                {/* Circular step node */}
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-300 ${
                                                                    isCurrent 
                                                                        ? 'bg-orange-500 border-orange-500 text-white scale-125 shadow-md shadow-orange-500/20' 
                                                                        : isCompleted 
                                                                            ? 'bg-orange-500 border-orange-500 text-white' 
                                                                            : 'bg-white border-zinc-200 text-zinc-400'
                                                                }`}>
                                                                    {isCompleted && !isCurrent ? '✓' : idx + 1}
                                                                </div>
                                                                
                                                                {/* Stage Label details below node */}
                                                                <span className={`text-[9px] md:text-xs mt-3 font-bold text-center select-none tracking-tight transition-colors duration-200 ${
                                                                    isCurrent 
                                                                        ? 'text-orange-600 scale-105 font-black' 
                                                                        : isCompleted 
                                                                            ? 'text-zinc-800' 
                                                                            : 'text-zinc-400'
                                                                }`}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrder;