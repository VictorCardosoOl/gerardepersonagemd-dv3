
import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/formatters';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div 
            className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-3 h-[450px]" 
            data-lenis-prevent
        >
            {skills.map((skill, i) => (
                <div 
                    key={skill.name} 
                    className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${skill.proficient ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-110' : 'bg-white/10 group-hover:bg-white/30'}`}></div>
                        <span className={`text-sm tracking-wide transition-colors font-body ${skill.proficient ? 'text-white font-medium' : 'text-mystic-400 font-light group-hover:text-mystic-200'}`}>
                            {translateTerm(skill.name)}
                        </span>
                    </div>
                    
                    <span className={`font-mono text-sm font-bold transition-colors ${skill.proficient ? 'text-cyan-300' : 'text-mystic-600 group-hover:text-mystic-400'}`}>
                        {skill.value >= 0 ? `+${skill.value}` : skill.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
