import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/formatters';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div 
            className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2 h-[450px]" 
            data-lenis-prevent
        >
            {skills.map((skill, i) => (
                <div 
                    key={skill.name} 
                    className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/5"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${skill.proficient ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-white/5 group-hover:bg-white/20'}`}></div>
                        <span className={`text-sm tracking-wide transition-colors font-body ${skill.proficient ? 'text-white font-medium' : 'text-mystic-500/70 font-light group-hover:text-mystic-300'}`}>
                            {translateTerm(skill.name)}
                        </span>
                    </div>
                    
                    <span className={`font-mono text-xs font-bold transition-colors ${skill.proficient ? 'text-cyan-300' : 'text-mystic-700 group-hover:text-mystic-500'}`}>
                        {skill.value >= 0 ? `+${skill.value}` : skill.value}
                    </span>
                </div>
            ))}
        </div>
    );
};