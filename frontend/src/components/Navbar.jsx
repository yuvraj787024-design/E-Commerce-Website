import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from "../utilis/userauth"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Modern Orange Theme Active desktop link styling helper
  const linkStyles = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 py-2 px-1 border-b-2 ${
      isActive 
        ? 'text-orange-500 border-orange-500' 
        : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
    }`;

  // Mobile drawer links helper
  const mobileLinkStyles = ({ isActive }) =>
    `block text-base font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-orange-50 text-orange-600' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  // Asynchronous Logout Controller Engine
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    
    try {
      setLoggingOut(true);
      
      // Requesting your direct authorization session termination pipeline
      await api.get('/user/logout', {
        withCredentials: true // Ensures browser cookies/session items clear if required by backend
      });

      // Clear local storage / tokens here if your project caches them
      localStorage.clear();
      sessionStorage.clear();

      // Redirect directly back to your starting authentication page
      navigate('/');
    } catch (error) {
      console.error("Logout runtime execution error:", error);
      // Fallback redirection in case API acts up but client session must close
      navigate('/');
    } finally {
      setLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo Anchor */}
          <div className="shrink-0 flex items-center">
            <NavLink to="/dashboard" className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bite<span className="text-orange-500">Dash</span>
            </NavLink>
          </div>

          {/* Desktop Navigation Links (Hidden on Mobile view elements) */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/dashboard" end className={linkStyles}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkStyles}>
              About
            </NavLink>
            <NavLink to="/cart" className={linkStyles}>
              Cart
            </NavLink>
            <NavLink to="/help" className={linkStyles}>
              Help
            </NavLink>

            {/* Red Destructive Logout Action Trigger */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 px-4 py-2 rounded-xl transition duration-200 disabled:opacity-50"
            >
              {loggingOut ? "Leaving..." : "Logout"}
            </button>
          </div>

          {/* Responsive Hamburger Icon (Hidden on Desktop display scales) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6 transition-transform duration-200 rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Smooth Mobile Menu Drawer layout stack */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-100 bg-white ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          <NavLink to="/dashboard" end onClick={() => setIsOpen(false)} className={mobileLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>
            About
          </NavLink>
          <NavLink to="/cart" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>
            Cart
          </NavLink>
          <NavLink to="/help" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>
            Help
          </NavLink>
          
          {/* Mobile Specific Red Logout Block Element */}
          <div className="pt-2 mt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full text-left text-base font-bold py-3 px-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center justify-between"
            >
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              <span>🚪</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;