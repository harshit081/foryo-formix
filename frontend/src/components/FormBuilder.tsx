import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Sparkles, PlusCircle, GripVertical, ChevronsUp, ChevronsDown } from 'lucide-react';
import QuestionBank from './QuestionBank';
import { saveQuestionToBank } from '../functions/questionBank';
import { saveForm, updateForm } from '../functions/forms';

interface Question {
  id: string;
  title: string;
  type: string; // TEXT, PARAGRAPH, MULTIPLE_CHOICE, CHECKBOXES, DROPDOWN
  options: string[] | null;
  required: boolean;
  points?: number;
  correctAnswers?: string[] | null;
}

interface FormBuilderProps {
  token: string;
  user: any;
  showToast: (msg: string, type: 'success' | 'error') => void;
  initialForm?: { id: string; title: string; description: string; isQuiz: boolean; questions: any[] } | null;
  onSaveSuccess?: () => void;
}

export default function FormBuilder({ token, user, showToast, initialForm, onSaveSuccess }: FormBuilderProps) {
  const [title, setTitle] = useState(initialForm?.title || 'Untitled Form');
  const [description, setDescription] = useState(initialForm?.description || '');
  const [isQuiz, setIsQuiz] = useState(initialForm?.isQuiz || false);
  const [questions, setQuestions] = useState<Question[]>(
    initialForm?.questions.map(q => ({
      id: q.id,
      title: q.title,
      type: q.type,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      required: q.required,
      points: q.points || 0,
      correctAnswers: typeof q.correctAnswers === 'string' ? JSON.parse(q.correctAnswers) : (q.correctAnswers || null),
    })) || [
      {
        id: 'q-init-1',
        title: 'Sample Question',
        type: 'TEXT',
        options: null,
        required: true,
        points: 0,
        correctAnswers: null,
      },
    ]
  );
  
  const [saving, setSaving] = useState(false);
  const [bankTrigger, setBankTrigger] = useState(0);
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(null);

  // Refs for drag auto-scroll loop
  const dragYRef = React.useRef<number | null>(null);
  const scrollIntervalRef = React.useRef<any>(null);

  const stopScrollLoop = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    dragYRef.current = null;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    e.dataTransfer.dropEffect = 'move';
    dragYRef.current = e.clientY;

    if (draggedIndex !== index) {
      setDragOverIndex(index);
      setDragDirection(draggedIndex < index ? 'down' : 'up');
    } else {
      setDragOverIndex(null);
      setDragDirection(null);
    }

    // Start auto-scroll loop if not active
    if (!scrollIntervalRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (dragYRef.current === null) return;
        const clientY = dragYRef.current;
        const threshold = 160;
        const viewportHeight = window.innerHeight;

        if (clientY < threshold) {
          // Scroll up (speed proportional to proximity to edge)
          const speed = Math.max(6, Math.min(25, ((threshold - clientY) / threshold) * 30));
          window.scrollBy(0, -speed);
        } else if (clientY > viewportHeight - threshold) {
          // Scroll down
          const distFromBottom = viewportHeight - clientY;
          const speed = Math.max(6, Math.min(25, ((threshold - distFromBottom) / threshold) * 30));
          window.scrollBy(0, speed);
        }
      }, 50);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragDirection(null);
    stopScrollLoop();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    stopScrollLoop();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...questions];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setQuestions(list);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragDirection(null);
  };

  // Sync state if initialForm changes
  React.useEffect(() => {
    if (initialForm) {
      setTitle(initialForm.title);
      setDescription(initialForm.description || '');
      setIsQuiz(initialForm.isQuiz || false);
      const mapped = initialForm.questions.map(q => ({
        id: q.id,
        title: q.title,
        type: q.type,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        required: q.required,
        points: q.points || 0,
        correctAnswers: typeof q.correctAnswers === 'string' ? JSON.parse(q.correctAnswers) : (q.correctAnswers || null),
      }));
      setQuestions(mapped);
      if (mapped.length > 0) {
        setFocusedQuestionId(mapped[0].id);
      }
    } else {
      setFocusedQuestionId('q-init-1');
    }
  }, [initialForm]);

  const addQuestion = (type = 'TEXT') => {
    const newId = `q-temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newQ: Question = {
      id: newId,
      title: 'New Question',
      type,
      options: ['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(type) ? ['Option 1', 'Option 2'] : null,
      required: false,
      points: 0,
      correctAnswers: null,
    };
    setQuestions([...questions, newQ]);
    setFocusedQuestionId(newId);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) {
      showToast('Form must have at least one question', 'error');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionTitle = (id: string, newTitle: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, title: newTitle } : q)));
  };

  const updateQuestionType = (id: string, newType: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== id) return q;
        const needsOptions = ['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(newType);
        return {
          ...q,
          type: newType,
          options: needsOptions ? (q.options || ['Option 1', 'Option 2']) : null,
          correctAnswers: null, // Clear correct answers when type changes
        };
      })
    );
  };

  const toggleRequired = (id: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, required: !q.required } : q)));
  };

  const updateQuestionPoints = (id: string, pts: number) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, points: pts } : q)));
  };

  const toggleCorrectAnswer = (qId: string, value: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== qId) return q;
        let correct = q.correctAnswers ? [...q.correctAnswers] : [];
        if (q.type === 'CHECKBOXES') {
          if (correct.includes(value)) {
            correct = correct.filter(c => c !== value);
          } else {
            correct.push(value);
          }
        } else {
          if (correct.includes(value)) {
            correct = [];
          } else {
            correct = [value];
          }
        }
        return { ...q, correctAnswers: correct.length > 0 ? correct : null };
      })
    );
  };

  const updateTextCorrectAnswer = (qId: string, val: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== qId) return q;
        return { ...q, correctAnswers: val.trim() ? [val.trim()] : null };
      })
    );
  };

  const addOption = (qId: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== qId) return q;
        const opts = q.options ? [...q.options] : [];
        opts.push(`Option ${opts.length + 1}`);
        return { ...q, options: opts };
      })
    );
  };

  const updateOptionText = (qId: string, optIdx: number, val: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== qId) return q;
        const oldOptVal = q.options ? q.options[optIdx] : '';
        const opts = q.options ? [...q.options] : [];
        opts[optIdx] = val;
        
        let correct = q.correctAnswers ? [...q.correctAnswers] : null;
        if (correct && correct.includes(oldOptVal)) {
          correct = correct.map(c => (c === oldOptVal ? val : c));
        }
        return { ...q, options: opts, correctAnswers: correct };
      })
    );
  };

  const removeOption = (qId: string, optIdx: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== qId) return q;
        const oldOptVal = q.options ? q.options[optIdx] : '';
        const opts = q.options ? [...q.options] : [];
        if (opts.length <= 1) {
          showToast('Choice questions must have at least 1 option', 'error');
          return q;
        }
        opts.splice(optIdx, 1);
        
        let correct = q.correctAnswers ? [...q.correctAnswers] : null;
        if (correct && correct.includes(oldOptVal)) {
          correct = correct.filter(c => c !== oldOptVal);
        }
        return { ...q, options: opts, correctAnswers: correct && correct.length > 0 ? correct : null };
      })
    );
  };

  const moveQuestion = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === questions.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newQuestions = [...questions];
    const temp = newQuestions[idx];
    newQuestions[idx] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;
    setQuestions(newQuestions);
  };

  const moveQuestionToExtreme = (idx: number, target: 'top' | 'bottom') => {
    if (target === 'top' && idx === 0) return;
    if (target === 'bottom' && idx === questions.length - 1) return;

    const newQuestions = [...questions];
    const item = newQuestions[idx];
    newQuestions.splice(idx, 1);
    if (target === 'top') {
      newQuestions.unshift(item);
    } else {
      newQuestions.push(item);
    }
    setQuestions(newQuestions);
    
    // Focus the moved question at its new index and scroll window to extremes
    setTimeout(() => {
      setFocusedQuestionId(item.id);
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    }, 50);
  };

  const saveToQuestionBank = async (q: Question) => {
    if (!token) {
      showToast('Please sign in to Google first to save templates', 'error');
      return;
    }
    try {
      const res = await saveQuestionToBank({
        title: q.title,
        type: q.type,
        options: q.options,
        points: q.points || 0,
        correctAnswers: q.correctAnswers,
        category: 'Custom',
      }, token);

      if (res.ok) {
        showToast('Saved to your Question Bank!', 'success');
        setBankTrigger(prev => prev + 1); // Refresh bank list
      } else {
        showToast('Failed to save to Question Bank', 'error');
      }
    } catch (err) {
      showToast('Network error saving question', 'error');
    }
  };

  const handleAddFromBank = (bankQ: any) => {
    const newId = `q-temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newQ: Question = {
      id: newId,
      title: bankQ.title,
      type: bankQ.type,
      options: bankQ.options,
      required: bankQ.required || false,
      points: bankQ.points || 0,
      correctAnswers: typeof bankQ.correctAnswers === 'string' ? JSON.parse(bankQ.correctAnswers) : (bankQ.correctAnswers || null),
    };
    setQuestions([...questions, newQ]);
    setFocusedQuestionId(newId);
  };

  const handleSaveForm = async () => {
    if (!title.trim()) {
      showToast('Form title is required', 'error');
      return;
    }
    if (!token) {
      showToast('You must be connected to Google to save forms', 'error');
      return;
    }

    setSaving(true);
    try {
      const isEditing = !!initialForm && !!initialForm.id;
      const formPayload = {
        title,
        description,
        isQuiz,
        questions,
      };

      const res = isEditing
        ? await updateForm(initialForm.id, formPayload, token)
        : await saveForm(formPayload, token);

      if (res.ok) {
        showToast(isEditing ? 'Form updated successfully!' : 'Form saved successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to save form', 'error');
      }
    } catch (error) {
      showToast('Network error saving form', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Left side: Canvas Editor */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Form Title Card */}
        <div className="theme-card p-6 border-l-[6px] border-l-theme-primary">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                className="theme-input px-0 py-1 text-2xl font-bold font-display bg-transparent border-0 border-b border-transparent focus:border-theme-border-subtle rounded-none w-full"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Form Title"
              />
            </div>
            
            <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all duration-150 shrink-0 text-sm font-semibold
              ${isQuiz ? 'bg-theme-primary/10 border-theme-primary text-theme-primary' : 'border-theme-border-subtle text-theme-text-muted'}
            ">
              <input
                type="checkbox"
                checked={isQuiz}
                onChange={() => setIsQuiz(!isQuiz)}
                className="cursor-pointer"
              />
              <span>Quiz Mode</span>
            </label>
          </div>
          
          <div className="flex flex-col gap-1 w-full">
            <textarea
              className="theme-input px-0 py-1 text-sm bg-transparent border-0 resize-none min-h-[60px] w-full"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Form description (optional)"
            />
          </div>

          {isQuiz && (
            <div className="flex gap-2.5 mt-4 pt-4 border-t border-theme-border-subtle/40 text-xs items-center animate-fade-in">
              <span className="text-theme-text-muted font-bold uppercase tracking-wider text-[9px]">Bulk Actions:</span>
              <button
                type="button"
                className="theme-btn-secondary px-2.5 py-1 text-[10px] font-semibold cursor-pointer shadow-sm hover:border-theme-primary/30"
                onClick={() => setQuestions(questions.map(q => ({ ...q, required: true })))}
              >
                Make All Required
              </button>
              <button
                type="button"
                className="theme-btn-secondary px-2.5 py-1 text-[10px] font-semibold cursor-pointer shadow-sm hover:border-theme-primary/30"
                onClick={() => setQuestions(questions.map(q => ({ ...q, required: false })))}
              >
                Make All Optional
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        {questions.map((q, idx) => {
          const isFocused = q.id === focusedQuestionId;
          const isDragged = draggedIndex === idx;
          const isOver = dragOverIndex === idx;

          const dragClass = isDragged 
            ? 'opacity-25 scale-[0.97] border-dashed border-theme-primary/50 rotate-[-0.5deg]' 
            : isOver 
              ? (dragDirection === 'down' ? 'translate-y-2.5 scale-[0.99] border-theme-primary/30 shadow-md' : '-translate-y-2.5 scale-[0.99] border-theme-primary/30 shadow-md')
              : '';

          if (!isFocused) {
            return (
              <React.Fragment key={q.id}>
                {isOver && dragDirection === 'up' && (
                  <div className="h-1 bg-gradient-to-r from-theme-primary/70 to-theme-warning/70 rounded-full shadow-[0_0_8px_var(--theme-primary)] animate-pulse my-2 transition-all duration-300" />
                )}
                <div 
                  onClick={() => setFocusedQuestionId(q.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`theme-card p-4 flex justify-between items-center gap-4 cursor-pointer hover:border-theme-primary/45 bg-white/2 hover:bg-white/3 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                    ${dragClass}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical size={14} className="text-theme-text-muted cursor-grab active:cursor-grabbing shrink-0" />
                    <span className="text-xs font-semibold text-theme-text-muted shrink-0 w-5">
                      {idx + 1}.
                    </span>
                    <span className="text-xs font-bold text-theme-text-main truncate">
                      {q.title || 'Untitled Question'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-theme-text-muted select-none border border-theme-border-subtle uppercase tracking-wider font-bold">
                      {q.type.replace('_', ' ')}
                    </span>
                    
                    {isQuiz && q.points !== undefined && q.points > 0 && (
                      <span className="text-[9px] bg-theme-primary/10 text-theme-primary px-2 py-0.5 rounded font-bold border border-theme-primary/15">
                        {q.points} pt{q.points !== 1 ? 's' : ''}
                      </span>
                    )}
                    
                    {q.required && (
                      <span className="text-[9px] text-theme-danger font-semibold bg-theme-danger/5 px-1.5 py-0.5 rounded border border-theme-danger/10">
                        Req
                      </span>
                    )}
                  </div>
                </div>
                {isOver && dragDirection === 'down' && (
                  <div className="h-1 bg-gradient-to-r from-theme-primary/70 to-theme-warning/70 rounded-full shadow-[0_0_8px_var(--theme-primary)] animate-pulse my-2 transition-all duration-300" />
                )}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={q.id}>
              {isOver && dragDirection === 'up' && (
                <div className="h-1 bg-gradient-to-r from-theme-primary/70 to-theme-warning/70 rounded-full shadow-[0_0_8px_var(--theme-primary)] animate-pulse my-2 transition-all duration-300" />
              )}
              <div 
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                className={`theme-card p-6 flex flex-col gap-5 relative border-l-4 border-l-theme-primary animate-fade-in shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${dragClass}
                `}
              >
                {/* Question Header */}
                <div 
                  className="flex justify-between items-center cursor-grab active:cursor-grabbing py-1"
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-theme-primary shrink-0" />
                    <span className="text-xs font-bold text-theme-primary uppercase tracking-wider">
                      Editing Question {idx + 1}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse"></div>
                </div>

              {/* Title & Type */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
                <input
                  type="text"
                  className="theme-input px-3.5 py-2.5 text-sm font-semibold flex-1"
                  value={q.title}
                  onChange={e => updateQuestionTitle(q.id, e.target.value)}
                  placeholder="Question text"
                />

                <select
                  className="theme-input px-3 py-2 text-sm cursor-pointer w-full sm:w-[160px] font-medium"
                  value={q.type}
                  onChange={e => updateQuestionType(q.id, e.target.value)}
                >
                  <option value="TEXT">Short Answer</option>
                  <option value="PARAGRAPH">Paragraph</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="CHECKBOXES">Checkboxes</option>
                  <option value="DROPDOWN">Dropdown</option>
                </select>
              </div>

              {/* Choice Options */}
              {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(q.type) && q.options && (
                <div className="flex flex-col gap-2.5 pl-2.5 border-l border-theme-border-subtle">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctAnswers?.includes(opt) || false;
                    return (
                      <div key={optIdx} className="flex items-center gap-3 w-full group/opt">
                        {isQuiz ? (
                          <button
                            type="button"
                            onClick={() => toggleCorrectAnswer(q.id, opt)}
                            className={`w-5 h-5 flex items-center justify-center rounded-full border text-[10px] font-bold cursor-pointer shrink-0 transition-all duration-150
                              ${isCorrect 
                                ? 'bg-theme-success/15 border-theme-success text-theme-success' 
                                : 'border-theme-border-subtle text-theme-text-muted hover:border-theme-text-main'
                              }
                            `}
                            title={isCorrect ? "Correct Option" : "Mark as Correct"}
                          >
                            {isCorrect ? '✓' : ''}
                          </button>
                        ) : (
                          <div className={`w-4 h-4 border border-theme-text-muted shrink-0
                            ${q.type === 'CHECKBOXES' ? 'rounded-sm' : 'rounded-full'}
                          `}></div>
                        )}
                        
                        <input
                          type="text"
                          className="theme-input px-3 py-1.5 text-xs flex-1 border-transparent hover:border-theme-border-subtle focus:border-theme-primary bg-transparent hover:bg-white/1 focus:bg-white/2 rounded"
                          value={opt}
                          onChange={e => updateOptionText(q.id, optIdx, e.target.value)}
                        />
                        
                        <button 
                          className="p-1.5 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer opacity-0 group-hover/opt:opacity-100 transition-opacity" 
                          onClick={() => removeOption(q.id, optIdx)}
                        >
                          <Trash2 size={13} className="text-theme-danger" />
                        </button>
                      </div>
                    );
                  })}
                  
                  <button
                    className="theme-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 self-start mt-1 cursor-pointer font-semibold shadow-sm"
                    onClick={() => addOption(q.id)}
                  >
                    <PlusCircle size={13} />
                    <span>Add Option</span>
                  </button>
                </div>
              )}

              {/* Text Quiz Key */}
              {isQuiz && ['TEXT', 'PARAGRAPH'].includes(q.type) && (
                <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-l-theme-success">
                  <label className="text-xs font-bold text-theme-success">Correct Answer Key</label>
                  <input
                    type="text"
                    className="theme-input px-3.5 py-2 text-xs"
                    value={q.correctAnswers ? q.correctAnswers[0] : ''}
                    onChange={e => updateTextCorrectAnswer(q.id, e.target.value)}
                    placeholder="Type the exact correct answer"
                  />
                </div>
              )}

              {/* Footer controls */}
              <div className="flex justify-between items-center pt-4 border-t border-theme-border-subtle mt-2 flex-wrap gap-3">
                <div className="flex gap-1 items-center">
                  <button 
                    type="button"
                    className="p-1 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" 
                    onClick={() => moveQuestionToExtreme(idx, 'top')} 
                    disabled={idx === 0}
                    title="Move to Top Extreme"
                  >
                    <ChevronsUp size={14} />
                  </button>
                  <button 
                    type="button"
                    className="p-1 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" 
                    onClick={() => moveQuestion(idx, 'up')} 
                    disabled={idx === 0}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    type="button"
                    className="p-1 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" 
                    onClick={() => moveQuestion(idx, 'down')} 
                    disabled={idx === questions.length - 1}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button 
                    type="button"
                    className="p-1 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed" 
                    onClick={() => moveQuestionToExtreme(idx, 'bottom')} 
                    disabled={idx === questions.length - 1}
                    title="Move to Bottom Extreme"
                  >
                    <ChevronsDown size={14} />
                  </button>
                  <button 
                    className="theme-btn-secondary px-2.5 py-1.5 text-[10px] flex items-center gap-1 cursor-pointer font-semibold shadow-sm"
                    onClick={() => saveToQuestionBank(q)}
                  >
                    <Sparkles size={11} className="text-theme-warning animate-pulse-subtle" />
                    <span>Save to Bank</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {isQuiz && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-theme-text-muted">Points:</span>
                      <input
                        type="number"
                        min="0"
                        className="theme-input w-[55px] px-1.5 py-1 text-xs text-center"
                        value={q.points || 0}
                        onChange={e => updateQuestionPoints(q.id, parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  )}
                  
                  <label className="flex items-center gap-2 text-xs text-theme-text-muted cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={() => toggleRequired(q.id)}
                      className="cursor-pointer"
                    />
                    <span>Required</span>
                  </label>
                  
                  <button className="p-1.5 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer" onClick={() => removeQuestion(q.id)} title="Delete Question">
                    <Trash2 size={15} className="text-theme-danger" />
                  </button>
                </div>
              </div>
              {isOver && dragDirection === 'down' && (
                <div className="h-1 bg-gradient-to-r from-theme-primary/70 to-theme-warning/70 rounded-full shadow-[0_0_8px_var(--theme-primary)] animate-pulse my-2 transition-all duration-300" />
              )}
            </div>
          </React.Fragment>
        );
        })}

        {/* Builder bottom controls */}
        <div className="flex gap-4 mt-2">
          <button className="theme-btn-secondary py-3 flex-1 flex justify-center items-center gap-2 cursor-pointer font-semibold" onClick={() => addQuestion('TEXT')}>
            <Plus size={16} />
            <span>Add Question</span>
          </button>
          
          <button className="theme-btn-primary py-3 flex-1 flex justify-center items-center gap-2 cursor-pointer font-semibold shadow-md" onClick={handleSaveForm} disabled={saving}>
            {saving ? (
              <div className="spinner"></div>
            ) : (
              <>
                <Save size={16} />
                <span>{initialForm && initialForm.id ? 'Update Form' : 'Save Form'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right side: Reusable question bank + Live View Preview */}
      <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
        {token && (
          <QuestionBank
            token={token}
            onAddQuestion={handleAddFromBank}
            showToast={showToast}
            triggerRefresh={bankTrigger}
          />
        )}

        {/* Live Device Preview chassis */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider select-none">
            Live Device Preview
          </div>
          
          <div className="w-full max-w-[320px] aspect-[9/18.5] border-[10px] border-[#1c1c1e] bg-[#0b0c10] rounded-[38px] shadow-2xl overflow-hidden relative flex flex-col ring-1 ring-white/10">
            {/* Phone notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1c1c1e] rounded-full z-30 flex items-center justify-center">
              <div className="w-8 h-1 bg-white/20 rounded-full"></div>
            </div>
            
            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto pt-7 pb-6 px-3.5 flex flex-col gap-4 select-none scrollbar-none">
              {/* Form title */}
              <div className="flex flex-col gap-1 text-left pb-3 border-b border-white/5 mt-1.5">
                <span className="text-[13px] font-bold text-white font-display line-clamp-1">{title || 'Untitled Form'}</span>
                <span className="text-[9px] text-white/50 line-clamp-2 leading-relaxed">{description || 'No description provided.'}</span>
              </div>
              
              {/* Live Preview Questions */}
              <div className="flex flex-col gap-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex flex-col gap-2.5 text-left">
                    <div className="flex justify-between items-start gap-2 text-[10px] font-semibold text-white">
                      <div className="line-clamp-2">
                        <span>{idx + 1}. {q.title || 'Question'}</span>
                        {q.required && <span className="text-theme-danger ml-0.5">*</span>}
                      </div>
                      {isQuiz && q.points !== undefined && (
                        <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/45 shrink-0 select-none">
                          {q.points} pt{q.points !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Form fields */}
                    {q.type === 'TEXT' && (
                      <div className="h-7 w-full border border-white/10 bg-white/2 rounded-md px-2.5 flex items-center text-[9px] text-white/30 italic">
                        Short answer text
                      </div>
                    )}

                    {q.type === 'PARAGRAPH' && (
                      <div className="h-14 w-full border border-white/10 bg-white/2 rounded-md px-2.5 py-1.5 text-[9px] text-white/30 italic">
                        Long answer text
                      </div>
                    )}

                    {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(q.type) && q.options && (
                      <div className="flex flex-col gap-2">
                        {q.type === 'DROPDOWN' ? (
                          <div className="h-7 w-full border border-white/10 bg-[#14151a] rounded-md px-2.5 flex justify-between items-center text-[9px] text-white/60">
                            <span>Select option...</span>
                            <span className="text-white/40">▼</span>
                          </div>
                        ) : (
                          q.options.map((opt, optIdx) => {
                            const isCorrect = isQuiz && q.correctAnswers?.includes(opt);
                            return (
                              <div key={optIdx} className="flex items-center gap-2.5 text-[9px] leading-none">
                                <div className={`w-3.5 h-3.5 border border-white/25 flex items-center justify-center shrink-0
                                  ${q.type === 'CHECKBOXES' ? 'rounded-sm' : 'rounded-full'}
                                  ${isCorrect ? 'bg-theme-success/20 border-theme-success text-theme-success font-bold text-[7px]' : ''}
                                `}>
                                  {isCorrect ? '✓' : ''}
                                </div>
                                <span className={`
                                  ${isCorrect ? 'text-theme-success font-semibold' : 'text-white/60'}
                                `}>
                                  {opt}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                    {/* Text quiz correct answer key */}
                    {isQuiz && ['TEXT', 'PARAGRAPH'].includes(q.type) && q.correctAnswers && q.correctAnswers[0] && (
                      <div className="text-[8px] text-[#30d158] bg-[#30d158]/5 px-2 py-0.5 rounded border border-[#30d158]/10 self-start">
                        Key: {q.correctAnswers[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="h-4 w-full flex items-center justify-center bg-transparent z-30 pb-1.5 shrink-0">
              <div className="w-20 h-1 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
