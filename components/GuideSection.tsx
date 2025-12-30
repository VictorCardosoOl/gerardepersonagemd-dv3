import React from 'react';
import { GUIDE_STEPS } from '../constants';
import { Map, Compass, BookOpen } from 'lucide-react';

export const GuideSection: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-6 animate-float shadow-lg border border-mystic-100">
                    <Compass size={40} className="text-mystic-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-6xl font-display font-black text-void-950 mb-6 tracking-tight">
                    O Caminho do <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-600 to-indigo-600">Aprendiz</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-serif italic">
                    Moldar um herói é uma arte arcana. Siga os passos e descubra seu destino.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {GUIDE_STEPS.map((step, idx) => (
                    <div key={idx} className="glass-panel p-10 rounded-[2rem] relative overflow-hidden group hover:border-mystic-300 transition-all duration-500 hover:-translate-y-2 bg-white/60">
                        <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] font-display font-black select-none text-void-900 group-hover:scale-125 transition-transform duration-700">
                            {idx + 1}
                        </div>
                        <div className="text-4xl mb-6 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm border border-mystic-50 text-mystic-600">
                            {step.icon}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-void-900 mb-3">
                            {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-serif text-lg">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-10 bg-void-950 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-mystic-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-5 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                        <BookOpen size={48} className="text-mystic-300" strokeWidth={1} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-3 text-white">Conselho do Mestre</h3>
                        <p className="text-mystic-100 text-lg leading-relaxed font-serif">
                            "Números altos não fazem um bom personagem. Falhas, medos e desejos são o que tornam as histórias lendárias. Abrace o caos dos dados."
                        </p>
                    </div>
                 </div>
            </div>
        </div>
    );
};