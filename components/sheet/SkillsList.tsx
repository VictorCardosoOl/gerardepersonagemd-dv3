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
            <h3 className="font-display text-white/50 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                <Target size={14} className="text-emerald-400" /> Perícias
            </h3>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px] md:max-h-none" data-lenis-prevent>
                {skills.map((skill, i) => (
                    <div 
                        key={skill.name} 
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${skill.proficient ? 'bg-cyan-400 text-cyan-400' : 'bg-white/5 text-transparent'}`}></div>
                            <span className={`text-sm tracking-wide ${skill.proficient ? 'text-white font-semibold' : 'text-mystic-500 font-light'}`}>
                                {translateTerm(skill.name)}
                            </span>
                        </div>
                        
                        <span className={`font-mono text-sm ${skill.proficient ? 'text-cyan-300' : 'text-mystic-700'}`}>
                            {skill.value >= 0 ? `+${skill.value}` : skill.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};