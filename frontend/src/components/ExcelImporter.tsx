import React, { useState, useRef } from 'react';
import { FileUp, Trash2, ArrowRight, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { uploadExcelSpreadsheet } from '../functions/parser';

interface ParsedQuestion {
  id: string;
  title: string;
  type: string;
  options: string | null;
  required: boolean;
  points: number;
  correctAnswers: string | null; // Comma-separated correct answers
  order: number;
}

interface ExcelImporterProps {
  token: string;
  showToast: (msg: string, type: 'success' | 'error') => void;
  onImportToBuilder: (questions: any[], title: string) => void;
}

export default function ExcelImporter({ token, showToast, onImportToBuilder }: ExcelImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExt || '')) {
      showToast('Please upload only .xlsx, .xls or .csv files', 'error');
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await uploadExcelSpreadsheet(formData, token);

      if (res.ok) {
        const data = await res.json();
        const processed = data.questions.map((q: any) => {
          let correctStr = '';
          if (q.correctAnswers) {
            try {
              const arr = JSON.parse(q.correctAnswers);
              correctStr = Array.isArray(arr) ? arr.join(', ') : String(arr);
            } catch (e) {
              correctStr = String(q.correctAnswers);
            }
          }
          return {
            ...q,
            correctAnswers: correctStr || null,
          };
        });
        setQuestions(processed);
        showToast('Spreadsheet parsed successfully!', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to parse sheet file', 'error');
        setFile(null);
      }
    } catch (err) {
      showToast('Network error uploading file', 'error');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleUpdateTitle = (id: string, val: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, title: val } : q)));
  };

  const handleUpdateType = (id: string, val: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id !== id) return q;
        const needsOptions = ['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(val);
        return {
          ...q,
          type: val,
          options: needsOptions ? (q.options || 'Option 1, Option 2') : null,
          correctAnswers: null,
        };
      })
    );
  };

  const handleUpdateOptions = (id: string, val: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, options: val } : q)));
  };

  const handleUpdatePoints = (id: string, val: number) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, points: val } : q)));
  };

  const handleUpdateCorrectAnswers = (id: string, val: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, correctAnswers: val } : q)));
  };

  const handleToggleRequired = (id: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, required: !q.required } : q)));
  };

  const handleImport = () => {
    if (questions.length === 0) {
      showToast('No questions to import', 'error');
      return;
    }

    const mappedQuestions = questions.map(q => {
      let optsArray: string[] | null = null;
      if (q.options) {
        if (q.options.startsWith('[')) {
          try {
            optsArray = JSON.parse(q.options);
          } catch (e) {
            optsArray = q.options.split(',').map(o => o.trim()).filter(Boolean);
          }
        } else {
          optsArray = q.options.split(',').map(o => o.trim()).filter(Boolean);
        }
      }

      let correctArray: string[] | null = null;
      if (q.correctAnswers) {
        correctArray = q.correctAnswers.split(',').map(o => o.trim()).filter(Boolean);
      }

      return {
        id: q.id,
        title: q.title,
        type: q.type,
        options: optsArray,
        required: q.required,
        points: q.points,
        correctAnswers: correctArray,
      };
    });

    const formTitle = file ? file.name.replace(/\.[^/.]+$/, "") : "Imported Quiz Form";
    onImportToBuilder(mappedQuestions, formTitle);
    showToast('Loaded into Form Builder canvas', 'success');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="theme-card p-7">
        <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
          <div>
            <h2 className="text-xl font-bold font-display text-theme-text-main">Excel / CSV Importer</h2>
            <p className="text-theme-text-muted text-sm mt-1">
              Upload a spreadsheet to instantly map questions, choice answers, correct keys, and points.
            </p>
          </div>
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="theme-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-sm"
          >
            <HelpCircle size={13} />
            <span>{showHelp ? 'Hide Guide' : 'Column Guide'}</span>
          </button>
        </div>

        {showHelp && (
          <div className="p-4 rounded-xl border border-theme-border-subtle bg-white/2 my-4 animate-fade-in text-left flex flex-col gap-2">
            <div className="font-semibold text-xs text-theme-text-main">Expected Spreadsheet Columns</div>
            <p className="text-[11px] text-theme-text-muted leading-relaxed">
              Ensure your columns have the following exact headings:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-1">
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Question / Title</span>
                <span className="text-[10px] text-theme-text-muted">Text description of the question.</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Type</span>
                <span className="text-[10px] text-theme-text-muted">TEXT, MULTIPLE_CHOICE, CHECKBOXES, DROPDOWN.</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Choices / Options</span>
                <span className="text-[10px] text-theme-text-muted">Comma-separated choices list.</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Score / Points</span>
                <span className="text-[10px] text-theme-text-muted">Point value (integer).</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Key / Correct Answer</span>
                <span className="text-[10px] text-theme-text-muted">Match choices exactly.</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-theme-text-main">Required</span>
                <span className="text-[10px] text-theme-text-muted">Yes/No or True/False.</span>
              </div>
            </div>
          </div>
        )}

        {!file ? (
          <div 
            className="border-2 border-dashed border-theme-border-subtle hover:border-theme-primary rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer bg-white/1 hover:bg-theme-primary/1 transition-all duration-200"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept=".xlsx,.xls,.csv"
            />
            <FileUp size={40} className="text-theme-text-muted group-hover:text-theme-primary transition-colors" />
            <div className="font-semibold text-sm text-theme-text-main">Drag & drop your Excel/CSV sheet here</div>
            <div className="text-theme-text-muted text-xs">Supports XLSX, XLS, and CSV files</div>
            <button className="theme-btn-secondary px-4 py-2 text-xs mt-2 cursor-pointer">Browse Files</button>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-white/2 border border-theme-border-subtle rounded-lg">
            <FileSpreadsheet size={32} className="text-theme-success" />
            <div>
              <div className="font-semibold text-sm text-theme-text-main">{file.name}</div>
              <div className="text-theme-text-muted text-xs">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button 
              className="theme-btn-secondary px-4 py-2 text-xs ml-auto cursor-pointer" 
              onClick={() => { setFile(null); setQuestions([]); }}
              disabled={loading}
            >
              Clear File
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center p-12">
          <div className="spinner !w-9 !h-9"></div>
        </div>
      )}

      {questions.length > 0 && !loading && (
        <div className="theme-card p-6">
          <div className="flex justify-between items-center mb-5 gap-4">
            <h3 className="text-base font-bold text-theme-text-main">Parsed Questions Preview ({questions.length})</h3>
            <button className="theme-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer" onClick={handleImport}>
              <span>Import to Builder</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-theme-border-subtle">
            <table className="w-full border-collapse text-left text-xs text-theme-text-main">
              <thead>
                <tr className="bg-white/3 border-b border-theme-border-subtle">
                  <th className="p-3 font-semibold text-theme-text-main" style={{ width: '30%' }}>Question Title</th>
                  <th className="p-3 font-semibold text-theme-text-main" style={{ width: '15%' }}>Type</th>
                  <th className="p-3 font-semibold text-theme-text-main" style={{ width: '20%' }}>Options (Comma-separated)</th>
                  <th className="p-3 font-semibold text-theme-text-main text-center" style={{ width: '10%' }}>Points</th>
                  <th className="p-3 font-semibold text-theme-text-main" style={{ width: '15%' }}>Correct Key</th>
                  <th className="p-3 font-semibold text-theme-text-main text-center" style={{ width: '5%' }}>Req</th>
                  <th className="p-3 font-semibold text-theme-text-main" style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border-subtle">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-white/1 transition-colors">
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={q.title} 
                        onChange={e => handleUpdateTitle(q.id, e.target.value)} 
                        className="theme-input px-2.5 py-1.5 w-full" 
                      />
                    </td>
                    <td className="p-3">
                      <select 
                        value={q.type} 
                        onChange={e => handleUpdateType(q.id, e.target.value)}
                        className="theme-input px-2 py-1.5 cursor-pointer w-full"
                      >
                        <option value="TEXT">Short Answer</option>
                        <option value="PARAGRAPH">Paragraph</option>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="CHECKBOXES">Checkboxes</option>
                        <option value="DROPDOWN">Dropdown</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(q.type) ? (
                        <input 
                          type="text" 
                          value={q.options || ''} 
                          onChange={e => handleUpdateOptions(q.id, e.target.value)} 
                          className="theme-input px-2.5 py-1.5 w-full" 
                          placeholder="Opt 1, Opt 2"
                        />
                      ) : (
                        <span className="text-theme-text-muted text-[11px] italic">N/A (Text input)</span>
                      )}
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        min="0"
                        value={q.points || 0} 
                        onChange={e => handleUpdatePoints(q.id, parseInt(e.target.value, 10) || 0)} 
                        className="theme-input px-1 py-1.5 text-center w-full" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={q.correctAnswers || ''} 
                        onChange={e => handleUpdateCorrectAnswers(q.id, e.target.value)} 
                        className="theme-input px-2.5 py-1.5 w-full" 
                        placeholder={['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(q.type) ? "e.g. Opt 1" : "Answer key"}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={q.required} 
                        onChange={() => handleToggleRequired(q.id)}
                        className="cursor-pointer accent-theme-primary"
                      />
                    </td>
                    <td className="p-3">
                      <button className="p-1 rounded hover:bg-white/5 cursor-pointer" onClick={() => handleRemoveQuestion(q.id)}>
                        <Trash2 size={13} className="text-theme-danger" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
