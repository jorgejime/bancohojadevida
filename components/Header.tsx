import React, { useState } from 'react';
import { getUserName, logout } from '../auth';
import Icon from './Icon';

const Header = (): React.ReactNode => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const userName = getUserName();

    return (
        <header className="bg-white shadow-lg z-20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/#/my-profile">
                    <img 
                        src="https://usm.edu.co/assets/Publico/images/Logo.png" 
                        alt="Banco de Hojas de Vidas USM" 
                        className="h-14 transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                </a>
                <div className="flex items-center space-x-5">
                    <button className="text-gray-600 hover:text-blue-700 focus:outline-none transition-colors duration-300">
                        <Icon name="bell" className="h-7 w-7" />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 focus:outline-none"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 border-2 border-blue-400 transition-all duration-300 ease-in-out hover:bg-blue-300">
                                <Icon name="user" className="h-6 w-6" />
                            </div>
                            <span className="text-gray-800 hidden md:block font-semibold">{userName}</span>
                        </button>

                        {dropdownOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 transition-all duration-300 ease-in-out"
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <div className="px-4 py-2 text-sm text-gray-800 border-b">
                                    <p className="font-bold">{userName}</p>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                                <a 
                                    href="#" 
                                    onClick={handleLogout} 
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600"
                                >
                                    <Icon name="logout" className="h-5 w-5 mr-3" />
                                    Log Out
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
