import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { createQuestion, getAllQuestions, deleteQuestion } from '../../api/admin';
import toast from 'react-hot-toast';

export const QuestionBank = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  // Form states
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctOption, setCorrectOption] = useState('A');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [difficultyB, setDifficultyB] = useState(0.0);
  const [discriminationA, setDiscriminationA] = useState(1.0);
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');

  const loadQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (err) {
      toast.error('Failed to load global question bank');
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(id);
      toast.success('Question deleted');
      loadQuestions();
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await createQuestion({
        exam_id: null,
        question_text: questionText,
        option_a: options.A,
        option_b: options.B,
        option_c: options.C,
        option_d: options.D,
        correct_option: correctOption,
        difficulty_level: difficultyLevel,
        difficulty_b: difficultyB,
        discrimination_a: discriminationA,
        topic_tag: topic,
        subtopic_tag: subtopic
      });
      toast.success('Question added to Global Bank!');
      // Reset form
      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setDifficultyB(0.0);
      setDiscriminationA(1.0);
      loadQuestions();
    } catch (err) {
      toast.error('Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Global Question Bank</h1>
        <p className="text-textMuted">Upload questions safely. The adaptive engine will automatically fetch matching topics for active exams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 border border-border bg-surface col-span-1 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Upload New Question</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Topic (Match with Exam Subject!)</label>
                  <input
                    type="text" required value={topic} onChange={e => setTopic(e.target.value)}
                    placeholder="Math" className="w-full h-10 px-3 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtopic</label>
                  <input
                    type="text" required value={subtopic} onChange={e => setSubtopic(e.target.value)}
                    placeholder="Algebra" className="w-full h-10 px-3 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <textarea
                required value={questionText} onChange={e => setQuestionText(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
                placeholder="What is 2 + 2?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt}>
                  <label className="block text-sm font-medium mb-1">Option {opt}</label>
                  <input
                    type="text" required value={options[opt as keyof typeof options]}
                    onChange={e => setOptions({ ...options, [opt]: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Correct Option</label>
                <select value={correctOption} onChange={e => setCorrectOption(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                  <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base Difficulty</label>
                <select value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background">
                  <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IRT Difficulty (b)</label>
                <input type="number" step="0.1" required value={difficultyB} onChange={e => setDifficultyB(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-border bg-background"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IRT Discrimination (a)</label>
                <input type="number" step="0.1" required value={discriminationA} onChange={e => setDiscriminationA(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-border bg-background"/>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full md:w-auto px-8">
              Add Question
            </Button>
          </form>
        </Card>

        <Card className="p-6 border border-border bg-surface col-span-1 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Uploaded Questions Archive</h2>
          {questions.length === 0 ? (
            <div className="text-center py-12 text-textMuted">No questions uploaded to the Global Pool yet.</div>
          ) : (
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-border">
                    <th className="pb-3 px-4 font-semibold">ID</th>
                    <th className="pb-3 px-4 font-semibold w-1/3">Question Text</th>
                    <th className="pb-3 px-4 font-semibold">Topic</th>
                    <th className="pb-3 px-4 font-semibold">Params (a, b)</th>
                    <th className="pb-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.question_id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                      <td className="py-3 px-4 font-mono">#{q.question_id}</td>
                      <td className="py-3 px-4">
                        <div className="line-clamp-2 text-sm">{q.question_text}</div>
                        <div className="text-xs text-green-500 font-medium mt-1">Ans: Option {q.correct_option}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">{q.topic_tag}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-textMuted">
                        a={q.discrimination_a.toFixed(1)}, b={q.difficulty_b.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleDelete(q.question_id)} className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
