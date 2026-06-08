import React, { useState, useEffect } from 'react';
import { Layers, Trash2, Search, Tag } from 'lucide-react';

interface QuestionBankItem {
  id: string;
  title: string;
  type: string;
  options: string | null;
  category: string | null;
}

interface QuestionBankProps {
  token: string;
  onAddQuestion: (q: { title: string; type: string; options: string[] | null; required: boolean }) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  triggerRefresh?: number;
}

export default function QuestionBank({ token, onAddQuestion, showToast, triggerRefresh = 0 }: QuestionBankProps) {
  const [items, setItems] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBank = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/question-bank', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBank();
  }, [token, triggerRefresh]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/question-bank/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Question removed from library', 'success');
        fetchBank();
      } else {
        showToast('Failed to delete question', 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend', 'error');
    }
  };

  const handleUseQuestion = (item: QuestionBankItem) => {
    let optionsList: string[] | null = null;
    if (item.options) {
      try {
        optionsList = JSON.parse(item.options);
      } catch (err) {
        optionsList = String(item.options).split(',').map(o => o.trim()).filter(Boolean);
      }
    }
    
    onAddQuestion({
      title: item.title,
      type: item.type,
      options: optionsList,
      required: false,
    });
    showToast('Question added to builder canvas', 'success');
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(items.map(item => item.category || 'General')))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (item.category || 'General') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="theme-card p-5 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-theme-border-subtle pb-3">
        <Layers size={18} className="text-theme-primary" />
        <span className="font-semibold text-sm text-theme-text-main">Reusable Library</span>
      </div>

      <div className="flex flex-col gap-2 relative w-full">
        <input 
          type="text" 
          placeholder="Search question bank..." 
          className="theme-input pl-9 pr-4 py-2 text-xs w-full" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted" />
      </div>

      {/* Category selector pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[10px] cursor-pointer border transition-all duration-150 whitespace-nowrap
              ${selectedCategory === cat 
                ? 'theme-btn-primary text-white border-transparent' 
                : 'bg-white/3 text-theme-text-muted border-theme-border-subtle hover:text-theme-text-main'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <div className="spinner"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-theme-text-muted text-[11px] text-center p-6">
          {items.length === 0 ? 'No questions saved yet. Click the "Save to Bank" button on questions in the builder.' : 'No matching questions found.'}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="theme-card p-3 cursor-pointer bg-white/1 flex flex-col gap-1.5 relative border border-theme-border-subtle" 
              onClick={() => handleUseQuestion(item)}
            >
              <div className="flex justify-between items-start pr-6">
                <div className="text-xs font-semibold text-theme-text-main line-clamp-2 leading-tight">
                  {item.title}
                </div>
                <button 
                  className="absolute right-2 top-2 p-1 rounded hover:bg-white/5 cursor-pointer" 
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Remove from bank"
                >
                  <Trash2 size={12} className="text-theme-danger" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-theme-text-muted">
                <span className="bg-white/5 px-2 py-0.5 rounded text-[9px]">{item.type}</span>
                <span className="flex items-center gap-1">
                  <Tag size={9} />
                  <span>{item.category || 'General'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
