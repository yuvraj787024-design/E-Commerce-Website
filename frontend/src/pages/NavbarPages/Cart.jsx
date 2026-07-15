import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utilis/order'; // Using your established order API Axios instance
import Navbar from '../../components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Tracks specific cancel operations

  // Precise Amazon chronological stages map for user tracking
  const statusSteps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];

  // Fetch active transactions from your server layout configuration
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/getOrders');
      if (response.data && response.data.orderItems) {
        setOrders(response.data.orderItems);
      }
    } catch (err) {
      console.error("Error retrieving order list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Process dynamic cancellation targeting specific data entry nodes
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setActionLoading(orderId);
      const response = await api.delete(`/cancelOrder/${orderId}`);
      alert(response.data.message || "Order successfully cancelled.");
      
      // Update state locally to mark it as Cancelled without wiping it from UI entirely, 
      // or filter it out if you prefer to hide cancelled orders completely:
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Cancellation error logic fallback:", err);
      alert(err.response?.data?.message || "Failed to process cancellation event.");
    } finally {
      setActionLoading(null);
    }
  };

  // Computes line progress based on the current timeline milestone
  const getProgressWidth = (currentStatus) => {
    if (currentStatus === "Cancelled") return "100%";
    const index = statusSteps.indexOf(currentStatus);
    if (index === -1) return "0%";
    return `${(index / (statusSteps.length - 1)) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Orders</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">Track and manage your real-time food delivery progress.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="self-start sm:self-auto text-xs font-semibold px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95"
          >
            🔄 Refresh Status
          </button>
        </header>

        {loading ? (
          /* Processing Loader State Screen */
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p className="text-xs text-slate-400 font-medium font-mono">Loading order status pipeline...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty Pipeline Notification Layout Window */
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <span className="text-4xl block">📦</span>
            <h2 className="text-lg font-bold text-slate-900">No active orders</h2>
            <p className="text-xs text-slate-400">You do not have any pending orders processing right now.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-block bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-medium py-2.5 px-5 rounded-xl text-xs transition shadow-md shadow-orange-500/10"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          /* List Mapping Interface Container */
          <div className="space-y-6">
            {orders.map((order) => {
              const item = order.food || {};
              const partner = order.foodPartner || {};
              const priceValue = item.price || 0;
              const isCancelled = order.status === "Cancelled";
              const currentStepIndex = statusSteps.indexOf(order.status);

              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Internal Details Block Layout wrapper */}
                  <div className="p-5 sm:p-6 space-y-6">
                    
                    {/* Upper Metadata Ribbon row */}
                    <div className="flex flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-100 text-orange-700 uppercase tracking-wider">
                          {order.paymentType}
                        </span>
                        {isCancelled && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-red-50 border border-red-100 text-red-700 uppercase tracking-wider">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Placed: {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>

                    {/* Primary Product Content Body layout block */}
                    <div className="flex items-start gap-4">
                      
                      {/* Video Thumbnail block */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200/60 shrink-0 relative">
                        {item.video ? (
                          <video 
                            src={`${item.video}#t=0.5`} 
                            preload="metadata"
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl bg-orange-50 text-orange-500">
                            🍲
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-bold text-slate-900 text-base truncate">{item.name || "Unknown Dish"}</h3>
                          <span className="font-extrabold text-base text-orange-600 sm:text-right">₹{priceValue}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{partner.name} • {partner.phone}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 pt-1">
                          📍 <span className="font-medium text-slate-600">Delivery Point:</span> {order.address}
                        </p>
                      </div>
                    </div>

                    {/* Amazon-Inspired Visual Status Tracker */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="mb-4">
                        <h4 className={`text-sm font-black tracking-tight ${isCancelled ? 'text-red-600' : 'text-orange-600'}`}>
                          {isCancelled ? 'Order Cancelled' : `Status: ${order.status || 'Pending'}`}
                        </h4>
                      </div>

                      <div className="relative pt-2 pb-1">
                        {/* Tracker Path Line */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full" />
                        
                        {/* Colored progress fill */}
                        <div 
                          className={`absolute top-4 left-0 h-1 rounded-full transition-all duration-500 ease-out ${
                            isCancelled ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          style={{ width: getProgressWidth(order.status) }}
                        />

                        {isCancelled ? (
                          <div className="flex items-center gap-2 relative z-10 pl-1 mt-1">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-red-500/20">
                              ✕
                            </div>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                              This order was cancelled
                            </span>
                          </div>
                        ) : (
                          <div className="relative flex justify-between">
                            {statusSteps.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;

                              return (
                                <div key={step} className="flex flex-col items-center group relative z-10">
                                  
                                  {/* Stepper Dot */}
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all duration-300 ${
                                    isCurrent 
                                      ? 'bg-orange-500 border-orange-500 text-white scale-125 shadow-md shadow-orange-500/20' 
                                      : isCompleted 
                                        ? 'bg-orange-500 border-orange-500 text-white' 
                                        : 'bg-white border-slate-200 text-slate-400'
                                  }`}>
                                    {isCompleted && !isCurrent ? '✓' : idx + 1}
                                  </div>
                                  
                                  {/* Label text under dot */}
                                  <span className={`text-[9px] sm:text-xs mt-2 font-bold text-center select-none tracking-tight transition-colors duration-200 ${
                                    isCurrent 
                                      ? 'text-orange-600 scale-105 font-black' 
                                      : isCompleted 
                                        ? 'text-slate-800' 
                                        : 'text-slate-400'
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

                    {/* Operational Cancel Button Section */}
                    {/* Only show Cancel button if order is not already cancelled, delivered, or out for delivery */}
                    {!isCancelled && order.status !== "Delivered" && order.status !== "Out for Delivery" && (
                      <div className="pt-2 flex justify-end border-t border-slate-50">
                        <button
                          type="button"
                          disabled={actionLoading === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-xl transition text-xs tracking-wide border border-red-200"
                        >
                          {actionLoading === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      </div>
                    )}

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

export default Cart;
