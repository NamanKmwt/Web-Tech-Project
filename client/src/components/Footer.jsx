import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-carbon-black border-t border-white/10 pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4 relative group">
                            <span className="font-orbitron font-black text-3xl italic tracking-tighter text-f1-red">F1</span>
                            <span className="font-inter font-medium text-lg tracking-widest uppercase mt-1">Velocity</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Your ultimate destination for the latest Formula 1 news, driver stats, racing analysis, and technical insights. Experience the thrill of velocity.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons Placeholder */}
                            <a href="#" className="text-gray-400 hover:text-f1-red transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-f1-red transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-orbitron uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/racing" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Racing</Link></li>
                            <li><Link to="/leaderboard" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Leaderboard</Link></li>
                            <li><Link to="/news" className="text-gray-400 hover:text-f1-red transition-colors text-sm">News</Link></li>
                            <li><Link to="/tech" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Tech</Link></li>
                            <li><Link to="/drivers" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Drivers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-orbitron uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link to="/rules" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Rules & Regulations</Link></li>
                            <li><a href="#" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-f1-red transition-colors text-sm">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center md:text-left">
                    <p className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} F1 Velocity. All rights reserved. This site is not officially associated with Formula 1.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
