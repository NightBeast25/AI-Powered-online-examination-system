import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: {
    question_id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  };
  onSubmit: (selectedOption: string) => void;
  questionNumber: number;
}

export const QuestionCard = ({ question, onSubmit, questionNumber }: QuestionCardProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        setSelected(key);
      } else if (e.key === 'Enter' && selected) {
        onSubmit(selected);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, onSubmit]);

  const options = [
    { id: 'A', text: question.option_a },
    { id: 'B', text: question.option_b },
    { id: 'C', text: question.option_c },
    { id: 'D', text: question.option_d },
  ];

  return (
    <motion.div
      key={question.question_id || question.question_text} // Re-animate on question change
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="p-8 border-t-4 border-t-primary shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] bg-surface/80 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
             📝 Question {questionNumber}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-8 leading-relaxed">
          {question.question_text}
        </h2>
        <div className="space-y-4 mb-8">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 transform active:scale-[0.99] ${
                selected === opt.id 
                ? 'border-primary bg-primary/10 shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)] ring-2 ring-primary/20' 
                : 'border-white/5 hover:border-white/20 hover:bg-white/5 text-textPrimary bg-surface'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  selected === opt.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/40' : 'bg-background text-textMuted'
                }`}>
                  {opt.id}
                </div>
                <span className={`text-lg transition-colors ${selected === opt.id ? 'text-primary font-medium' : ''}`}>
                  {opt.text}
                </span>
                
                {selected === opt.id && (
                  <span className="ml-auto text-xl animate-fade-in">✅</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button 
            size="lg" 
            disabled={!selected} 
            onClick={() => selected && onSubmit(selected)}
            className="w-full sm:w-auto mt-2"
          >
            Submit Answer <span className="ml-2 text-xs opacity-75 hidden sm:inline">(Press Enter ↵)</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
