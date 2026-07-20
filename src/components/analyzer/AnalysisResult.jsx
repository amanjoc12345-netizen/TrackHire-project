import React from 'react';
import { ScoreCard } from './ScoreCard';
import { StrengthCard } from './StrengthCard';
import { WeaknessCard } from './WeaknessCard';
import { KeywordCard } from './KeywordCard';
import { Sparkles, Award, FileText, CheckCircle2, AlertCircle, ArrowLeft, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '../common/Button';

export const AnalysisResult = ({ analysis, onBack }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Analyzer
        </button>
        <span className="text-xs text-slate-450 font-mono">
          Analyzed Resume: {analysis.resumeName || 'uploaded_file.pdf'}
        </span>
      </div>

      {/* Primary Score Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard 
          title="Overall Resume Match Score" 
          score={analysis.matchScore} 
          strokeColor="text-brand-500" 
        />
        <ScoreCard 
          title="ATS Compatibility Score" 
          score={analysis.atsScore} 
          strokeColor="text-amber-500" 
        />
      </div>

      {/* Recommendation and Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Summary Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <FileText className="h-4.5 w-4.5 text-slate-450" />
            Resume Profile Summary
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Final Recommendation Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/35 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-slate-200/55 dark:border-slate-850 pb-3">
              <Award className="h-4.5 w-4.5 text-brand-500" />
              Final Recommendation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-350 mt-3 leading-relaxed font-semibold italic">
              "{analysis.finalRecommendation || 'The resume is a solid match with actionable optimizations.'}"
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider mt-4 block">
            TrackHire Recommendation
          </span>
        </div>

      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthCard strengths={analysis.strengths} />
        <WeaknessCard weaknesses={analysis.weaknesses} />
      </div>

      {/* Skill Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Keywords and Density Card */}
        <div className="lg:col-span-2">
          <KeywordCard 
            skillsFound={analysis.skillsFound} 
            missingSkills={analysis.missingSkills} 
            keywordMatch={analysis.keywordMatch} 
          />
        </div>

        {/* Missing Technologies Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Critical Missing Technologies
          </h4>
          {analysis.missingTechnologies && analysis.missingTechnologies.length > 0 ? (
            <ul className="space-y-3">
              {analysis.missingTechnologies.map((tech, index) => (
                <li key={index} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 items-start font-medium">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-450 dark:text-slate-500 italic">No missing core technologies identified.</p>
          )}
        </div>

      </div>

      {/* Improvement Suggestions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
          <Sparkles className="h-4.5 w-4.5 text-brand-655" />
          Improvement Suggestions
        </h3>
        {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.improvementSuggestions.map((suggestion, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-350 items-start">
                <span className="flex h-5 w-5 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 rounded-full font-bold text-[10px] items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-450 italic">No suggestions required; resume is fully optimized!</p>
        )}
      </div>

      {/* Experience & Education analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Experience Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-slate-400" />
            Experience Assessment
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {analysis.experienceAnalysis || 'Relevant experiences match the target profile requirements.'}
          </p>
        </div>

        {/* Education Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-slate-400" />
            Education & Certifications
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {analysis.educationAnalysis || 'Education records align with the requested background fields.'}
          </p>
        </div>

      </div>

    </div>
  );
};
