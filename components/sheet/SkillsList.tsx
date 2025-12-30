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
            <h3 className="font-display text-white/50 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target size={14} /> Perícias
            </h3>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[300px] md:max-h-none" data-lenis-prevent>
                {skills.map((skill, i) => (
                    <div 
                        key={skill.name} 
                        className="flex justify-between items-center py-2 border-b border-white/5 group hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${skill.proficient ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-white/10'}`}></div>
                            <span className={`text-sm ${skill.proficient ? 'text-white font-medium' : 'text-mystic-500 font-light'}`}>
                                {translateTerm(skill.name)}
                            </span>
                        </div>
                        
                        <span className={`font-mono text-sm ${skill.proficient ? 'text-cyan-400' : 'text-mystic-600'}`}>
                            {skill.value >= 0 ? `+${skill.value}` : skill.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};