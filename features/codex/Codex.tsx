import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RulesRepository } from '../../services/RulesRepository';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';

// Imagem de fallback genérica (Mapa/Fantasia) caso a específica falhe
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542259681-d3d63b82a0d7?q=80&w=600&auto=format&fit=crop';

export const Codex: React.FC = () => {
    const races = RulesRepository.getRaces();
    const { createCharacter } = useCharacter();

    const getRaceImage = (raceName: string): string => {
        // Tenta pegar a imagem exata, senão usa fallback
        return RACE_IMAGES[raceName] || FALLBACK_IMG;
    };

    return (
        <div className="w-full relative min-h-[80vh] flex flex-col justify-center animate-fade-in">
            <div className="text-center mb-16 px-4">
                <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-lg">
                    Códice de Origens
                </h2>
                <p className="text-mystic-400 text-lg max-w-2xl mx-auto font-light">
                    Explore as linhagens antigas. Cada origem concede dons únicos que moldarão seu destino.
                </p>
            </div>
            
            {/* Fluid Horizontal Snap Container */}
            <div 
                className="w-full overflow-x-auto snap-x snap-mandatory flex gap-8 px-6 md:px-[15vw] pb-20 no-scrollbar items-center" 
                data-lenis-prevent
            >
                {races.map(race => (
                    <div 
                        key={race.name} 
                        className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[550px] group relative rounded-[3rem] overflow-hidden cursor-pointer bg-void-950 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                        onClick={() => createCharacter(false, race.name)}
                    >
                        {/* Race Image Layer */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-80" 
                                style={{ backgroundImage: `url(${getRaceImage(race.name)})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/50 to-transparent"></div>
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
                        </div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <h3 className="text-4xl font-display font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors translate-y-4 group-hover:translate-y-0 duration-500 drop-shadow-md">
                                {race.name}
                            </h3>
                            
                            <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 delay-75">
                                <p className="text-sm text-mystic-200 leading-relaxed font-medium line-clamp-4 text-balance shadow-black drop-shadow-sm">
                                    {race.description}
                                </p>
                                
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {Object.keys(race.bonuses).slice(0, 2).map(attr => (
                                            <span key={attr} className="text-[10px] font-bold uppercase bg-white/10 px-2 py-1 rounded text-cyan-300 backdrop-blur-sm">
                                                +{race.bonuses[attr as keyof typeof race.bonuses]} {attr.substring(0,3)}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">
                                        <span>Escolher</span> <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Spacer for right scroll visual balance */}
                <div className="shrink-0 w-[5vw] md:w-[10vw]"></div>
            </div>
        </div>
    );
};
