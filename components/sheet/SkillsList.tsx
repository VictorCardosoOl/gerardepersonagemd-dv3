import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/logic';
import { Target } from 'lucide-react';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div className="h-full flex flex-col">
            <h3 className="font-display font-bold text-white/40 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                <Target size={16} className="text-cyan-400" /> Perícias
            </h3>
           
            <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]" 
                data-lenis-prevent
            >
                {skills.map((skill, i) => (
                    <div 
                        key={skill.name} 
                        className="flex justify-between items-center py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${skill.proficient ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-125' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                            <span className={`text-sm tracking-wide transition-colors ${skill.proficient ? 'text-white font-semibold' : 'text-mystic-500 font-medium group-hover:text-mystic-300'}`}>
                                {translateTerm(skill.name)}
                            </span>
                        </div>
                        
                        <span className={`font-mono text-sm font-bold transition-colors ${skill.proficient ? 'text-cyan-300' : 'text-mystic-700 group-hover:text-mystic-500'}`}>
                            {skill.value >= 0 ? `+${skill.value}` : skill.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};