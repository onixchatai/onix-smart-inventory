
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Edit3, FileText, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
    {
        icon: Camera,
        title: "1. Capture Your Belongings",
        description: "Take clear, well-lit photos of your items. Capture details like brand names, serial numbers, and any unique features for the most accurate analysis."
    },
    {
        icon: Upload,
        title: "2. Upload & Let AI Work",
        description: "Upload your images. Our advanced AI 'sees' the content, recognizes objects, and extracts key data like brand, model, and condition."
    },
    {
        icon: Edit3,
        title: "3. Review & Refine",
        description: "The AI generates a preliminary inventory list. You can easily review, edit, and add details like purchase date and value to ensure complete accuracy."
    },
    {
        icon: FileText,
        title: "4. Generate Your Report",
        description: "With one click, create a structured, professional report. This detailed inventory is ready to be sent to your insurance adjuster, saving time and ensuring a fair assessment."
    }
];

export default function HowItWorks() {
    return (
        <div className="mt-20 py-20 bg-gradient-to-b from-white/50 to-blue-50/50 dark:from-slate-950/50 dark:to-blue-900/20 rounded-t-3xl">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-100/60 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        The Magic Behind the Scenes
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        Transforming photos into professional insurance documentation in four simple steps.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                        >
                            <Card className="h-full border-0 shadow-lg hover:shadow-xl dark:shadow-slate-950/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
