import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, ExternalLink, BarChart3, CloudLightning, Check, AlertTriangle, Download, X, FileSpreadsheet } from 'lucide-react';
import ExcelImporter from './ExcelImporter';

interface Form {
  id: string;
  title: string;
  description: string | null;
  googleFormId: string | null;
  googleResponderUri: string | null;
  isQuiz: boolean;
  questions: any[];
  updatedAt: string;
}

interface FormManagerProps {
  token: string;
  showToast: (msg: string, type: 'success' | 'error') => void;
  onEditForm: (form: Form) => void;
  onViewAnalytics: (formId: string) => void;
  onImportToBuilder: (questions: any[], title: string) => void;
}

export default function FormManager({ token, showToast, onEditForm, onViewAnalytics, onImportToBuilder }: FormManagerProps) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Excel Import state
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Google Form Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrlOrId, setImportUrlOrId] = useState('');
  const [importing, setImporting] = useState(false);

  // Google Form Delete state
  const [deleteTargetForm, setDeleteTargetForm] = useState<Form | null>(null);
  const [deleting, setDeleting] = useState(false);

  const executeDelete = async (id: string, deleteFromDrive: boolean) => {
    setDeleting(true);
    try {
      const url = `http://localhost:5000/api/forms/${id}?deleteFromDrive=${deleteFromDrive}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast(
          deleteFromDrive 
            ? 'Form successfully trashed on Google Drive and deleted from platform' 
            : 'Form removed from platform', 
          'success'
        );
        setDeleteTargetForm(null);
        fetchForms();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to delete form', 'error');
      }
    } catch (err) {
      showToast('Network error deleting form', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleImportSubmit = async () => {
    if (!importUrlOrId.trim()) return;
    setImporting(true);
    try {
      const res = await fetch('http://localhost:5000/api/forms/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ googleFormUrlOrId: importUrlOrId.trim() }),
      });

      if (res.ok) {
        const importedForm = await res.json();
        showToast(`Successfully imported form "${importedForm.title}"!`, 'success');
        setShowImportModal(false);
        setImportUrlOrId('');
        fetchForms();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to import Google Form', 'error');
      }
    } catch (err) {
      showToast('Network error during Google Form import', 'error');
    } finally {
      setImporting(false);
    }
  };

  const fetchForms = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/forms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (err) {
      showToast('Error loading forms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [token]);



  const handleExport = async (id: string) => {
    setExportingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/forms/${id}/export`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('Successfully exported to Google Forms!', 'success');
        fetchForms(); // Refresh forms to get Google Links
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to export to Google Forms', 'error');
      }
    } catch (err) {
      showToast('Network error during export', 'error');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold font-display tracking-tight text-theme-text-main">My Forms</h2>
          <p className="text-theme-text-muted text-sm">Manage forms saved in your database, deploy them to Google Forms, and view analytics.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setShowExcelModal(true)}
            className="theme-btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm animate-fade-in"
          >
            <FileSpreadsheet size={14} />
            <span>Import from Sheet</span>
          </button>
          
          <button 
            onClick={() => setShowImportModal(true)}
            className="theme-btn-primary px-4 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md animate-fade-in"
          >
            <Download size={14} />
            <span>Import from Google</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-14">
          <div className="spinner !w-10 !h-10"></div>
        </div>
      ) : forms.length === 0 ? (
        <div className="theme-card p-12 text-center flex flex-col justify-center items-center">
          <div className="text-sm font-semibold text-theme-text-muted mb-2">
            No forms found in the database.
          </div>
          <p className="text-theme-text-muted text-xs mb-5">
            Get started by creating a form in the builder or importing questions from a spreadsheet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form.id} className="theme-card p-6 flex flex-col justify-between min-h-[220px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base font-bold font-display text-theme-text-main line-clamp-1 flex-1 leading-tight">{form.title}</h3>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer" onClick={() => onEditForm(form)} title="Edit Form">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/5 text-theme-text-muted hover:text-theme-text-main cursor-pointer" onClick={() => setDeleteTargetForm(form)} title="Delete Form">
                      <Trash2 size={14} className="text-theme-danger" />
                    </button>
                  </div>
                </div>
                
                <p className="text-theme-text-muted text-xs line-clamp-2 leading-relaxed min-h-[32px]">{form.description || 'No description provided'}</p>
                
                <div className="flex items-center gap-2 text-[10px] text-theme-text-muted mt-1">
                  <span>Questions: {form.questions.length}</span>
                  <span>•</span>
                  <span>{form.isQuiz ? 'Quiz Mode' : 'Standard'}</span>
                  <span>•</span>
                  <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-theme-border-subtle mt-4">
                {form.googleFormId ? (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-1.5 text-xs text-theme-success font-semibold">
                      <Check size={14} />
                      <span>Live on Google Forms</span>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <a 
                        href={`https://docs.google.com/forms/d/${form.googleFormId}/edit`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="theme-btn-secondary px-3 py-1.5 text-xs flex-1 flex justify-center items-center gap-1.5 cursor-pointer text-center"
                      >
                        <Edit3 size={11} />
                        <span>Edit Google</span>
                      </a>
                      
                      <a 
                        href={form.googleResponderUri || ''} 
                        target="_blank" 
                        rel="noreferrer"
                        className="theme-btn-secondary px-3 py-1.5 text-xs flex-1 flex justify-center items-center gap-1.5 cursor-pointer text-center"
                      >
                        <ExternalLink size={11} />
                        <span>View</span>
                      </a>

                      <button
                        onClick={() => onViewAnalytics(form.id)}
                        className="theme-btn-primary px-3 py-1.5 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                      >
                        <BarChart3 size={11} />
                        <span>Analytics</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2 w-full">
                    <span className="text-[11px] text-theme-text-muted flex items-center gap-1">
                      <AlertTriangle size={13} className="text-theme-warning" />
                      <span>Not exported to Google</span>
                    </span>

                    <button 
                      className="theme-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
                      onClick={() => handleExport(form.id)}
                      disabled={exportingId === form.id}
                    >
                      {exportingId === form.id ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <CloudLightning size={13} />
                          <span>Export to Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="theme-card max-w-md w-full p-6 relative flex flex-col gap-4 shadow-2xl border border-white/10">
            <button 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-theme-text-muted hover:text-theme-text-main transition-colors cursor-pointer"
              onClick={() => {
                setShowImportModal(false);
                setImportUrlOrId('');
              }}
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold font-display text-theme-text-main">Import Google Form</h3>
              <p className="text-xs text-theme-text-muted leading-relaxed">
                Import any form you own or have read access to. Questions, options, point values, and correct answers will be synchronized.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold text-theme-text-main">Google Form URL or ID</label>
              <input 
                type="text" 
                value={importUrlOrId}
                onChange={(e) => setImportUrlOrId(e.target.value)}
                placeholder="https://docs.google.com/forms/d/..."
                className="theme-input px-3 py-2 w-full text-xs"
                disabled={importing}
              />
              <p className="text-[10px] text-theme-text-muted mt-1 leading-snug">
                Accepts full Edit URLs, Viewform URLs, or raw Form IDs. Make sure you are authenticated with Google in Setup.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="theme-btn-secondary px-4 py-2 text-xs cursor-pointer"
                onClick={() => {
                  setShowImportModal(false);
                  setImportUrlOrId('');
                }}
                disabled={importing}
              >
                Cancel
              </button>
              <button 
                className="theme-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                onClick={handleImportSubmit}
                disabled={importing || !importUrlOrId.trim()}
              >
                {importing ? (
                  <>
                    <div className="spinner !w-3 !h-3"></div>
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    <span>Import Form</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTargetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="theme-card max-w-md w-full p-6 relative flex flex-col gap-4 shadow-2xl border border-white/10">
            <button 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-theme-text-muted hover:text-theme-text-main transition-colors cursor-pointer"
              onClick={() => setDeleteTargetForm(null)}
              disabled={deleting}
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold font-display text-theme-text-main">Delete Form</h3>
              <p className="text-xs text-theme-text-muted">
                Choose how you want to delete <span className="font-semibold text-theme-text-main">"{deleteTargetForm.title}"</span>.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {/* Option 1: Remove from Platform only */}
              <button
                onClick={() => executeDelete(deleteTargetForm.id, false)}
                disabled={deleting}
                className="w-full text-left p-3.5 rounded-lg border border-theme-border-subtle hover:border-theme-primary bg-white/2 hover:bg-theme-primary/5 cursor-pointer transition-all duration-200 group flex flex-col gap-1"
              >
                <span className="text-xs font-bold text-theme-text-main group-hover:text-theme-primary transition-colors flex items-center gap-1.5">
                  Remove from Platform
                </span>
                <span className="text-[10px] text-theme-text-muted leading-relaxed">
                  Deletes local configuration and analytics. The form will remain active and intact on Google Forms/Google Drive.
                </span>
              </button>

              {/* Option 2: Delete from Google Drive & Platform */}
              <button
                onClick={() => executeDelete(deleteTargetForm.id, true)}
                disabled={deleting || !deleteTargetForm.googleFormId}
                className={`w-full text-left p-3.5 rounded-lg border flex flex-col gap-1 transition-all duration-200 group ${
                  deleteTargetForm.googleFormId 
                    ? 'border-theme-border-subtle hover:border-theme-danger bg-white/2 hover:bg-theme-danger/5 cursor-pointer' 
                    : 'opacity-50 border-white/5 bg-transparent cursor-not-allowed'
                }`}
              >
                <span className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  deleteTargetForm.googleFormId ? 'text-theme-text-main group-hover:text-theme-danger' : 'text-theme-text-muted'
                }`}>
                  {deleting ? (
                    <>
                      <div className="spinner !w-3 !h-3"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete from Drive & Platform</span>
                  )}
                </span>
                <span className="text-[10px] text-theme-text-muted leading-relaxed">
                  {deleteTargetForm.googleFormId 
                    ? "Trash the form file from your Google Drive and remove all local platform data."
                    : "Not available (this form has not been exported to Google Forms yet)."
                  }
                </span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button 
                className="theme-btn-secondary px-4 py-2 text-xs cursor-pointer"
                onClick={() => setDeleteTargetForm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="theme-card max-w-4xl w-full p-6 relative flex flex-col gap-4 shadow-2xl border border-white/10 my-8">
            <button 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-theme-text-muted hover:text-theme-text-main transition-colors cursor-pointer"
              onClick={() => setShowExcelModal(false)}
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-1.5 mb-2">
              <h3 className="text-lg font-bold font-display text-theme-text-main">Import from Spreadsheet</h3>
              <p className="text-xs text-theme-text-muted">
                Parse a spreadsheet file and import the parsed questions into the Form Builder canvas.
              </p>
            </div>

            <ExcelImporter 
              token={token} 
              showToast={showToast} 
              onImportToBuilder={(questions, title) => {
                onImportToBuilder(questions, title);
                setShowExcelModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
