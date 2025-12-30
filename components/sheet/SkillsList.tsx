import React from 'react';
import { Skill } from '../../types';
import { translateTerm } from '../../utils/logic';
import { Check, Circle } from 'lucide-react';

interface Props {
    skills: Skill[];
}

export const SkillsList: React.FC<Props> = ({ skills }) => {
    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                 <h3 className="font-serif text-2xl text-stone-800">Perícias</h3>
                 <span className="text-xs text-stone-400 uppercase tracking-widest">Modificadores</span>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {skills.map((skill, i) => (
                    <div 
                        key={skill.name} 
                        className={`flex justify-between items-center px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-stone-200 group ${skill.proficient ? 'bg-emerald-50/50' : 'hover:bg-stone-50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`transition-colors ${skill.proficient ? 'text-emerald-600' : 'text-stone-300 group-hover:text-stone-400'}`}>
                                {skill.proficient ? <Check size={16} strokeWidth={3} /> : <Circle size={12} />}
                            </div>
                            <span className={`text-sm ${skill.proficient ? 'text-emerald-900 font-semibold' : 'text-stone-600'}`}>
                                {translateTerm(skill.name)}
                            </span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider ml-1">
                                ({translateTerm(skill.attribute).substring(0,3)})
                            </span>
                        </div>
                        <span className={`font-mono font-bold text-sm ${skill.proficient ? 'text-emerald-700' : 'text-stone-500'}`}>
                            {skill.value >= 0 ? `+${skill.value}` : skill.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};