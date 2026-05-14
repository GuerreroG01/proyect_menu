import { ArrowRight } from "lucide-react";

type Props = {
    title: string;
    description: string;
    icon: string;
};

export default function FeatureCard({ title, description, icon }: Props) {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-[#00A7E1]/10 transition-all duration-500">
        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:bg-[#00A7E1]/5 transition-colors duration-500" />

            <div className="relative z-10">

                <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-lg flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                {icon}
                </div>

                <h2 className="text-2xl font-black text-[#002B5B] mb-4 group-hover:text-[#00A7E1] transition-colors">
                {title}
                </h2>

                <p className="text-slate-500 leading-relaxed mb-8">
                {description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-400">
                    Experiencia Premium
                </span>
                </div>

            </div>
        </div>
    );
}