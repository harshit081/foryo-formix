import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, BarChart2, MessageSquare, Download, Users } from 'lucide-react';
import { fetchFormById, fetchFormAnalytics } from '../functions/forms';

interface FormAnalyticsProps {
  token: string;
  formId: string;
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function FormAnalytics({ token, formId, onBack, showToast }: FormAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [formMeta, setFormMeta] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const formRes = await fetchFormById(formId, token);
      if (formRes.ok) {
        const meta = await formRes.json();
        setFormMeta(meta);
      }

      const analyticsRes = await fetchFormAnalytics(formId, token);
      
      if (analyticsRes.ok) {
        const stats = await analyticsRes.json();
        setData(stats);
      } else {
        const err = await analyticsRes.json();
        showToast(err.error || 'Failed to fetch responses', 'error');
      }
    } catch (err) {
      showToast('Network error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [formId, token]);

  const handleExportCSV = () => {
    if (!data || !data.responses || data.responses.length === 0) {
      showToast('No responses available to export', 'error');
      return;
    }

    try {
      const headers = ['Response ID', 'Timestamp', 'Respondent Email'];
      const qIds = Object.keys(data.questionStats || {});
      
      qIds.forEach(qId => {
        headers.push(data.questionStats[qId].title);
      });

      const csvRows = [headers.join(',')];

      data.responses.forEach((resp: any) => {
        const row = [
          resp.responseId,
          new Date(resp.createTime).toLocaleString(),
          resp.respondentEmail,
        ];

        qIds.forEach(qId => {
          const ans = resp.answers[qId];
          const val = ans ? ans.answerText.join('; ') : '';
          row.push(`"${val.replace(/"/g, '""')}"`);
        });

        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${formMeta?.title || 'form'}_responses.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV downloaded successfully!', 'success');
    } catch (e) {
      showToast('Failed to generate CSV export', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Analytics Header */}
      <div className="flex justify-between items-center gap-4">
        <button className="theme-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Forms</span>
        </button>

        <div className="flex gap-2.5">
          <button className="theme-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
          
          <button className="theme-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer" onClick={handleExportCSV} disabled={loading || !data || data.responseCount === 0}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="spinner !w-10 !h-10"></div>
        </div>
      ) : !data ? (
        <div className="theme-card p-12 text-center flex flex-col justify-center items-center">
          <div className="font-semibold text-sm text-theme-text-muted mb-2">
            Unable to retrieve analytics for this form.
          </div>
          <p className="text-theme-text-muted text-xs">
            Verify the Google Form is still active and has submissions.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <div className="theme-card p-6 flex flex-wrap gap-6 items-center bg-gradient-to-r from-theme-primary/5 to-theme-success/5">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-2xl font-bold font-display text-theme-text-main mb-1">
                {formMeta?.title || 'Form Analytics'}
              </h2>
              <p className="text-theme-text-muted text-xs leading-relaxed">
                {formMeta?.description || 'Response breakdown dashboard'}
              </p>
            </div>

            <div className="theme-card py-4 px-6 flex items-center gap-4 bg-white/2 border border-theme-border-subtle">
              <div className="bg-theme-primary/10 p-2.5 rounded-lg text-theme-primary">
                <Users size={24} />
              </div>
              <div>
                <div className="text-[10px] text-theme-text-muted uppercase tracking-wider font-semibold">Total Responses</div>
                <div className="text-3xl font-extrabold font-display text-theme-text-main leading-none mt-1">
                  {data.responseCount}
                </div>
              </div>
            </div>
          </div>

          {data.responseCount === 0 ? (
            <div className="theme-card p-12 text-center flex flex-col items-center justify-center">
              <BarChart2 size={36} className="text-theme-text-muted mb-3 opacity-50" />
              <div className="font-semibold text-sm text-theme-text-main mb-1.5">No Responses Yet</div>
              <p className="text-theme-text-muted text-xs">Share the Google Form link to start collecting answers.</p>
            </div>
          ) : (
            /* Charts and Responses Breakdown */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(data.questionStats).map(([qId, qStats]: [string, any]) => {
                const total = qStats.totalAnswers;

                return (
                  <div key={qId} className="theme-card p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-4 border-b border-theme-border-subtle pb-3">
                      <span className="font-bold text-xs text-theme-text-main line-clamp-1">{qStats.title}</span>
                      <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-theme-text-muted shrink-0 select-none">
                        {qStats.type} ({total} responses)
                      </span>
                    </div>

                    {/* Render visual bar chart for choice question types */}
                    {qStats.optionCounts ? (
                      <div className="flex flex-col gap-3.5">
                        {Object.entries(qStats.optionCounts).map(([opt, count]: [string, any]) => {
                          const pct = total > 0 ? ((count / total) * 100) : 0;
                          return (
                            <div key={opt} className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-theme-text-main font-medium">{opt}</span>
                                <span className="text-theme-text-muted">{count} ({pct.toFixed(0)}%)</span>
                              </div>
                              <div className="h-2 rounded-full bg-white/5 w-full overflow-hidden border border-theme-border-subtle/20">
                                <div 
                                  className="h-full bg-theme-primary rounded-full transition-all duration-500" 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Render scrollable list for text question types */
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-theme-text-muted font-semibold">
                          <MessageSquare size={11} />
                          <span>Latest answers:</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto border border-theme-border-subtle rounded-lg p-3 bg-black/10">
                          {qStats.textSample && qStats.textSample.map((ans: string, index: number) => (
                            <div key={index} className="text-xs py-1.5 border-b border-theme-border-subtle/50 last:border-b-0 text-theme-text-main">
                              {ans}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
