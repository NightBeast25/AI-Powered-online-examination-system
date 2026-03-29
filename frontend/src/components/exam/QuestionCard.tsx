import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  };
  onSubmit: (selectedOption: string) => void;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, questionNumber }) => {
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
      key={question.question_text} // Re-animate on question change
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-textMuted uppercase tracking-wider">Question {questionNumber}</span>
        </div>
        <h2 className="text-2xl font-medium text-textPrimary mb-8 leading-relaxed">
          {question.question_text}
        </h2>
        <div className="space-y-3 mb-8">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === opt.id 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-border hover:border-textMuted text-textPrimary bg-surface'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${
                  selected === opt.id ? 'bg-primary text-white' : 'bg-background text-textMuted'
                }`}>
                  {opt.id}
                </div>
                <span className="text-lg">{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button 
            size="lg" 
            disabled={!selected} 
            onClick={() => selected && onSubmit(selected)}
            className="w-full sm:w-auto"
          >
            Submit Answer <span className="ml-2 text-xs opacity-75 hidden sm:inline">(Press Enter)</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
