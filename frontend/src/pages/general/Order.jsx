import React, { useEffect, useState } from 'react';
import api from '../../utilis/order';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Normalized incoming state (handling both foodId and food_id flavors)
const incomingFoodId =
    location.state?.foodId || location.state?.food_id || "";

const foodPrice = Number(location.state?.price || 0);

  const [orderPayload, setOrderPayload] = useState({
    food_id: incomingFoodId, // Standardized to snake_case to match common backend expectations
    address: "",
    paymentType: "Cash On Delivery"
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Sync state if navigation changes
  useEffect(() => {
    if (incomingFoodId) {
      setOrderPayload((prev) => ({
        ...prev,
        food_id: incomingFoodId,
      }));
    }
  }, [incomingFoodId]);

  const updateField = (key, value) => {
    setOrderPayload((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Live Location Fetcher using OpenStreetMap's free Nominatim API
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            updateField('address', data.display_name);
          } else {
            alert("Could not extract a readable address. Please type manually.");
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          alert("Failed to resolve coordinate to address.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or location unavailable.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!orderPayload.food_id) {
      alert("No food item selected. Please go back and select a dish.");
      return;
    }
    if (!orderPayload.address.trim()) {
      alert("Please enter or detect a delivery address");
      return;
    }

    try {
      setLoading(true);

      // Sending both variations just in case backend expects one or the other
      const finalPayload = {
        ...orderPayload,
        foodId: orderPayload.food_id,
        quantity 
      };

      const response = await api.post("/orderFood", finalPayload);
      alert(response.data.message || "Order placed successfully!");
      console.log(response.data.success)
      
      if (response.data.message === "Ordered Successfully" ) {
        navigate('/dashboard');
      }

      setOrderPayload({
        food_id: "",
        address: "",
        paymentType: "Cash On Delivery"
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to place order (400 Bad Request). Check API fields.");
    } finally {
      setLoading(false);
    }
  };

const deliveryCharge = 0;
const subtotal = foodPrice * quantity;
const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">Review your choices and set your location.</p>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Block */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Input Column */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-100 transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Shipping Destination
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    disabled={locating}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 transition disabled:opacity-50 self-start sm:self-auto"
                  >
                    {locating ? (
                      <span className="inline-block animate-spin mr-1">⏳</span>
                    ) : (
                      <span className="mr-1">📍</span>
                    )}
                    {locating ? "Locating..." : "Use Live Location"}
                  </button>
                </div>
                
                <textarea 
                  rows="3"
                  value={orderPayload.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-slate-700 text-sm resize-none"
                  placeholder="Type your complete drop address here..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-100 transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/xl" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <div 
                  onClick={() => updateField('paymentType', 'Cash On Delivery')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                    orderPayload.paymentType === 'Cash On Delivery' 
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/10' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-900">Cash on Delivery</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                      orderPayload.paymentType === 'Cash On Delivery' ? 'bg-blue-600 border-transparent' : 'border-slate-300'
                    }`}>
                      {orderPayload.paymentType === 'Cash On Delivery' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Pay at your doorstep.</span>
                </div>

                {/* Online Payment */}
                <div 
                  onClick={() => updateField('paymentType', 'ONLINE')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                    orderPayload.paymentType === 'ONLINE' 
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/10' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-900">Online Payment</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                      orderPayload.paymentType === 'ONLINE' ? 'bg-blue-600 border-transparent' : 'border-slate-300'
                    }`}>
                      {orderPayload.paymentType === 'ONLINE' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Cards, UPI, netbanking.</span>
                </div>
              </div>

              {/* Online payment banner notification block */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                orderPayload.paymentType === 'ONLINE' ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-100 flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Redirecting to secure merchant checkout window upon submission.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Block */}
          <div className="lg:col-span-1">
<div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-100 lg:sticky lg:top-6 space-y-5">
  <h2 className="text-lg font-bold tracking-tight text-slate-900">
    Order Summary
  </h2>

  {/* Interactive Quantity Selection Row */}
  <div className="flex items-center justify-between py-1">
    <span className="text-sm font-medium text-slate-600">
      Quantity
    </span>

    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-200/60 select-none">
      <button
        type="button"
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 transition-colors flex items-center justify-center"
      >
        －
      </button>

      <span className="font-extrabold text-sm text-slate-900 min-w-4 text-center">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => setQuantity(quantity + 1)}
        className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-sm shadow-xs border border-slate-200 transition-colors flex items-center justify-center"
      >
        ＋
      </button>
    </div>
  </div>

  <hr className="border-slate-100" />

  {/* Pricing Breakdown Calculations */}
  <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
    <div className="flex justify-between items-center">
      <span>Price</span>
      <span className="font-medium text-slate-800">₹{foodPrice} × {quantity}</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Subtotal</span>
      <span className="font-medium text-slate-800">₹{subtotal}</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Delivery Charge</span>
      <span className="text-emerald-600 font-semibold uppercase tracking-wide text-[11px] sm:text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
        FREE
      </span>
    </div>
  </div>

  <hr className="border-slate-100" />

  {/* Total Bill Calculation */}
  <div className="flex justify-between items-center text-slate-900 font-extrabold text-base sm:text-lg">
    <span>Total</span>
    <span className="text-blue-600 tracking-tight">
      ₹{total}
    </span>
  </div>

  {/* Live Data Payload Console (Optional Dev Tooling) */}


  {/* Main Submission Action Button */}
  <button
    type="submit"
    onClick={handlePlaceOrder}
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/10 hover:shadow-lg text-xs sm:text-sm text-center block tracking-wide"
  >
    {loading ? "Processing..." : `Pay ₹${total}`}
  </button>
</div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Order;