import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Clock, MoreHorizontal, ArrowUp, DollarSign, ArrowDown, HistoryIcon, CreditCard } from 'lucide-react';

const Footer = () => {
    return (
        <nav className="fixed bottom-0 bg-white w-full text-gray-500 z-40 flex justify-around pt-2 pb-3 shadow-inner ">
            <NavLink
                to="/"
                className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-emerald-600' : ''}`}>
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
            </NavLink>

            <NavLink
                to="/send"
                className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-emerald-600' : ''}`}>
                <ArrowUp className="w-6 h-6" />
                <span className="text-xs">Send</span>
            </NavLink>
            
            <NavLink
                to="/pay"
                className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-emerald-600' : ''}`}>
                <CreditCard className="w-6 h-6" />
                <span className="text-xs">Pay</span>
            </NavLink>
            
            <NavLink
                to="/history"
                className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-emerald-600' : ''}`}>
                <HistoryIcon className="w-6 h-6" />
                <span className="text-xs">History</span>
            </NavLink>

            <NavLink
                to="/more"
                className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-emerald-600' : ''}`}>
                <MoreHorizontal className="w-6 h-6" />
                <span className="text-xs">More</span>
            </NavLink>
        </nav>
    );
};

export default Footer;
