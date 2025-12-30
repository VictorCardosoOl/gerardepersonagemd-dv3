import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/logic';
import { Target } from 'lucide-react';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div className="h-full">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                 <div className="p-2 bg-white/5 rounded-lg text-mystic-300">
                    <Target size={20} />
                 </div>
                 <div>
                    <h3 className="font-display font-bold text-xl text-white tracking-wide">Matriz de Perícias</h3>
                    <p className="text-xs text-mystic-500 font-mono">Competências e Talentos Naturais</p>
                 </div>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1">
                {skills.map((skill, i) => (
                    <div 
                        key={skill.name} 
                        className={`
                            flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-300 border border-transparent group
                            ${skill.proficient ? 'bg-accent-cyan/5 border-accent-cyan/20' : 'hover:bg-white/5 hover:border-white/5'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            {/* Neon Indicator */}
                            <div className={`
                                w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-300
                                ${skill.proficient ? 'bg-accent-cyan text-accent-cyan' : 'bg-void-800 text-transparent group-hover:bg-white/30'}
                            `}></div>
                            
                            <span className={`text-sm tracking-wide ${skill.proficient ? 'text-white font-bold' : 'text-mystic-400 group-hover:text-mystic-200'}`}>
                                {translateTerm(skill.name)}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-white/20 uppercase font-mono tracking-wider group-hover:text-white/40">
                                {translateTerm(skill.attribute).substring(0,3)}
                            </span>
                            <span className={`font-mono font-bold text-sm min-w-[24px] text-right ${skill.proficient ? 'text-accent-cyan' : 'text-mystic-500 group-hover:text-white'}`}>
                                {skill.value >= 0 ? `+${skill.value}` : skill.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};