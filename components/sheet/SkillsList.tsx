import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/logic';
import { Check } from 'lucide-react';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div className="glass-panel rounded-xl p-5 h-full">
            <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-2">Perícias</h3>
            <div className="space-y-1">
                {skills.map(skill => (
                    <div 
                        key={skill.name} 
                        className={`flex justify-between items-center px-3 py-1.5 rounded-lg transition-colors text-sm ${skill.proficient ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${skill.proficient ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-slate-600'}`}>
                                {skill.proficient && <Check size={10} strokeWidth={4} />}
                            </div>
                            <span className={skill.proficient ? 'text-white font-medium' : 'text-slate-400'}>
                                {translateTerm(skill.name)}
                                <span className="text-[10px] text-slate-600 ml-1.5 uppercase tracking-wider">
                                    {translateTerm(skill.attribute).substring(0,3)}
                                </span>
                            </span>
                        </div>
                        <span className={`font-mono font-bold ${skill.proficient ? 'text-cyan-400' : 'text-slate-500'}`}>
                            {skill.value >= 0 ? `+${skill.value}` : skill.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};