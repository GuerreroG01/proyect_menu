type Props = {
    title: string;
    description: string;
    icon: string;
};

export default function FeatureCard({ title, description, icon }: Props) {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-100/80 rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0,03)] hover:shadow-[0_20px_40px_-15px_rgba(0,167,225,0.15)] hover:border-[#00A7E1]/20 transition-all duration-500 ease-out">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:bg-gradient-to-bl group-hover:from-[#00A7E1]/10 group-hover:to-transparent transition-all duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-md flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#00A7E1]/30 transition-all duration-500 ease-out">
                        {icon}
                    </div>

                    <h2 className="text-2xl font-black text-[#002B5B] tracking-tight mb-4 group-hover:text-[#00A7E1] transition-colors duration-300">
                        {title}
                    </h2>

                    <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed mb-8">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-100/80">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 group-hover:text-[#002B5B] transition-colors duration-300">
                        Experiencia Premium
                    </span>
                </div>

            </div>
        </div>
    );
}