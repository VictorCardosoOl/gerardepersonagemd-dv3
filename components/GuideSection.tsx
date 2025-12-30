import React from 'react';
import { GUIDE_STEPS } from '../constants';
import { Map, Compass, BookOpen } from 'lucide-react';

export const GuideSection: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-magic-100 rounded-full mb-6 animate-float">
                    <Compass size={40} className="text-magic-600" />
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-800 mb-6 tracking-tight">
                    Inicie sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-600 to-fuchsia-600">Jornada</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Criar um herói não precisa ser complicado. Siga os passos arcanos abaixo para moldar sua lenda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-200 to-transparent -z-10"></div>

                {GUIDE_STEPS.map((step, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-magic-400 transition-colors">
                        <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 font-serif font-black select-none group-hover:scale-110 transition-transform duration-700">
                            {idx + 1}
                        </div>
                        <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                            {step.icon}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 group-hover:text-magic-700 transition-colors">
                            {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-magic-500 rounded-full blur-[100px] opacity-20"></div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                        <BookOpen size={48} className="text-magic-300" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-2">Dica do Mestre</h3>
                        <p className="text-slate-300 text-lg">
                            "Não se preocupe em fazer o personagem 'mais forte'. As falhas e fraquezas são o que tornam as histórias memoráveis. Um Mago com baixa Constituição pode ser um herói trágico e incrível."
                        </p>
                    </div>
                 </div>
            </div>
        </div>
    );
};