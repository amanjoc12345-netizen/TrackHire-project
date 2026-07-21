import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAnalyzerStore } from '../store/analyzerStore';
import { ResumeUploader } from '../components/analyzer/ResumeUploader';
import { JobDescriptionInput } from '../components/analyzer/JobDescriptionInput';
import { AnalysisResult } from '../components/analyzer/AnalysisResult';
import { HistoryCard } from '../components/analyzer/HistoryCard';
import { AlertCircle, Brain, Play } from 'lucide-react';
import { Button } from '../components/common/Button';
import { API_URL } from '../config/api';

export const ResumeAnalyzer = () => {
  const { user } = useAuthStore();
  const { history, fetchHistory, saveAnalysis, deleteAnalysis } = useAnalyzerStore();

  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.uid) {
      fetchHistory(user.uid);
    }
  }, [user?.uid, fetchHistory]);

  const handleTextExtracted = (text, name) => {
    setResumeText(text);
    setResumeName(name);
  };

  const handleClearResume = () => {
    setResumeText('');
    setResumeName('');
  };

  const handleDetailsChange = (key, value) => {
    if (key === 'company') setCompany(value);
    if (key === 'position') setPosition(value);
  };

  const handleSelectHistory = (record) => {
    // Reopen previous analysis directly from Firestore JSON record
    setActiveAnalysis({
      ...record.analysisData,
      id: record.id,
      resumeName: record.resumeName,
      company: record.company,
      jobTitle: record.jobTitle
    });
  };

  const handleDeleteHistory = async (id) => {
    if (window.confirm('Delete this analysis from your history?')) {
      try {
        await deleteAnalysis(id);
        if (activeAnalysis && activeAnalysis.id === id) {
          setActiveAnalysis(null);
        }
        setToast({ type: 'success', message: 'Analysis record deleted successfully.' });
      } catch (err) {
        console.error('Failed to delete history record:', err);
        setToast({ type: 'error', message: err.message || 'Failed to delete analysis record.' });
      }
    }
  };

  const runAnalysis = async () => {
    setError(null);
    if (!resumeText.trim()) {
      setError('Please upload a resume file first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeText,
          jobDescription
        })
      });

      if (!response.ok) {
        let errDetails = `Server returned error code ${response.status}`;
        try {
          const errData = await response.json();
          console.error('Express server error response:', errData);
          if (errData?.error?.message) {
            errDetails = errData.error.message;
          }
        } catch (_) { }
        throw new Error(errDetails);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error('AI returned an empty analysis result.');
      }

      // Robust JSON Extraction
      let parsedAnalysis;
      try {
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : rawText;
        parsedAnalysis = JSON.parse(jsonString.trim());
      } catch (jsonErr) {
        console.error('JSON parsing failed. Raw response was:', rawText);
        throw new Error('Failed to parse AI response into structured data. Please try again.');
      }

      // Sync to Firestore
      const targetCompany = company.trim() || 'Unknown Company';
      const targetRole = position.trim() || 'Specified Role';

      const record = {
        userId: user.uid,
        resumeName,
        jobTitle: targetRole,
        company: targetCompany,
        matchScore: Number(parsedAnalysis.matchScore || 0),
        atsScore: Number(parsedAnalysis.atsScore || 0),
        summary: parsedAnalysis.summary || 'Summary unavailable',
        analysisData: parsedAnalysis,
        createdAt: new Date().toISOString()
      };

      const savedRecord = await saveAnalysis(record);

      // Set active visual state
      setActiveAnalysis({
        ...parsedAnalysis,
        id: savedRecord.id,
        resumeName,
        company: targetCompany,
        jobTitle: targetRole
      });

      // Clear input fields on success
      setCompany('');
      setPosition('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected analysis error occurred.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full flex flex-col gap-6 transition-colors duration-200">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Brain className="h-7 w-7 text-brand-600" />
          AI Resume Analyzer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Optimize your resume for specific applicant tracking systems and role requirements.
        </p>
      </div>

      {activeAnalysis ? (
        /* Results View */
        <AnalysisResult
          analysis={activeAnalysis}
          onBack={() => setActiveAnalysis(null)}
        />
      ) : (
        /* Input & History grid layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Main upload forms */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-6">

            {/* Resume File */}
            <ResumeUploader
              onTextExtracted={handleTextExtracted}
              onClear={handleClearResume}
            />

            {/* Job Description Text */}
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              company={company}
              position={position}
              onDetailsChange={handleDetailsChange}
            />

            {/* Error alerts */}
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-955/20 border border-red-105 dark:border-red-900/50 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze button actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="primary"
                onClick={runAnalysis}
                isLoading={analyzing}
                disabled={analyzing}
                className="w-full sm:w-auto px-6 cursor-pointer"
              >
                {!analyzing && <Play className="h-4 w-4 mr-2 fill-current" />}
                {analyzing ? 'Analyzing Resume...' : 'Analyze Match Score'}
              </Button>
            </div>

          </div>

          {/* Sidebar analysis history */}
          <div className="space-y-6">
            <HistoryCard
              history={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
            />
          </div>

        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg z-50 animate-in slide-in-from-bottom-5 duration-350
            ${toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-955/90 dark:text-emerald-355 border-emerald-200 dark:border-emerald-900/50'
              : 'bg-red-50 dark:bg-red-955/90 text-red-800 dark:text-red-350 border-red-200 dark:border-red-900/50'
            }`}
        >
          {toast.type === 'success' ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold text-xs">!</div>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};
