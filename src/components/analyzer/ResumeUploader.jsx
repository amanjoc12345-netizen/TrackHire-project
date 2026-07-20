import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ResumeUploader = ({ onTextExtracted, onClear }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    setError(null);
    setSuccess(false);
    setFileName(file.name);

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      setFileName('');
      return;
    }

    // Validate type
    const fileType = file.name.split('.').pop().toLowerCase();
    if (fileType !== 'pdf' && fileType !== 'docx') {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      setFileName('');
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        let extractedText = '';

        if (fileType === 'pdf') {
          // Verify PDF.js global exists
          if (!window.pdfjsLib) {
            throw new Error('PDF.js library is not loaded. Please reload the page.');
          }

          // Configure worker
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let textParts = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            textParts.push(pageText);
          }

          extractedText = textParts.join('\n');
        } else if (fileType === 'docx') {
          // Verify Mammoth global exists
          if (!window.mammoth) {
            throw new Error('Mammoth.js library is not loaded. Please reload the page.');
          }

          const result = await window.mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value || '';
        }

        if (!extractedText.trim()) {
          throw new Error('Could not extract any readable text from this document.');
        }

        setSuccess(true);
        onTextExtracted(extractedText, file.name);
      } catch (err) {
        console.error('File parsing error:', err);
        setError(err.message || 'Failed to parse file. Ensure it is not corrupted.');
        setFileName('');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file from disk.');
      setLoading(false);
      setFileName('');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFileName('');
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-705 dark:text-slate-300 mb-2">
        Upload Resume *
      </label>

      {fileName ? (
        /* File Uploaded view */
        <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
              <File className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {fileName}
              </p>
              {loading ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <svg className="animate-spin h-3 w-3 text-brand-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Extracting text...
                </p>
              ) : success ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Text extracted successfully
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-450 hover:text-red-650 dark:hover:text-red-400 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Remove File"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 min-h-[160px] ${
            dragActive 
              ? 'border-brand-550 bg-brand-50/30 dark:bg-brand-950/10' 
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleChange}
          />
          <UploadCloud className="h-9 w-9 text-slate-400 mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Drag & drop your resume here, or <span className="text-brand-600 dark:text-brand-400">browse</span>
          </p>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
            Supports PDF and DOCX files (Max 5MB)
          </p>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mt-3 rounded-md bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 text-red-505 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
