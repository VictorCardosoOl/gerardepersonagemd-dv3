import React from 'react';
import { Hexagon, Book, Skull, Map, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
    currentView: string;
    onChangeView: (view: 'sanctum' | 'sheet' | 'codex' | 'guide') => void;
    onToggleBestiary: () => void;
    activeCharacterName?: string;
    isBestiaryOpen: boolean;
}

const NavIcon = ({ icon: Icon, active, onClick, tooltip }: any) => (
    <div className="relative group flex items-center justify-center">
        <button 
            onClick={onClick}
            className={`
                p-3 rounded-full transition-all duration-500 cursor-pointer
                ${active ? 'text-champagne-500' : 'text-zinc-600 hover:text-white'}
            `}
        >
            <Icon size={24} strokeWidth={1.5} />
            {active && (
                <motion.div 
                    layoutId="nav-dot"
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-champagne-500 rounded-full"
                />
            )}
        </button>
        {/* Tooltip */}
        <span className="absolute left-14 text-[10px] uppercase tracking-widest font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-obsidian-900 px-2 py-1 rounded">
            {tooltip}
        </span>
    </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onToggleBestiary, activeCharacterName, isBestiaryOpen }) => {
    return (
        <nav className="fixed left-0 top-0 h-screen w-24 hidden md:flex flex-col items-center justify-center py-12 z-50 pointer-events-none">
            <div className="pointer-events-auto bg-obsidian-950/80 backdrop-blur-md border border-white/5 rounded-full py-8 px-2 flex flex-col gap-6 shadow-2xl">
                <NavIcon 
                    icon={Hexagon} 
                    active={currentView === 'sanctum'} 
                    onClick={() => onChangeView('sanctum')} 
                    tooltip="Sanctum"
                />
                
                {activeCharacterName && (
                     <NavIcon 
                        icon={Shield} 
                        active={currentView === 'sheet'} 
                        onClick={() => onChangeView('sheet')} 
                        tooltip={activeCharacterName}
                    />
                )}

                <div className="w-4 h-px bg-white/10 mx-auto my-2"></div>

                <NavIcon 
                    icon={Skull} 
                    active={isBestiaryOpen} 
                    onClick={onToggleBestiary} 
                    tooltip="Bestiário"
                />
                <NavIcon 
                    icon={Book} 
                    active={currentView === 'codex'} 
                    onClick={() => onChangeView('codex')} 
                    tooltip="Códice"
                />
                 <NavIcon 
                    icon={Map} 
                    active={currentView === 'guide'} 
                    onClick={() => onChangeView('guide')} 
                    tooltip="Guia"
                />
            </div>
        </nav>
    );
};