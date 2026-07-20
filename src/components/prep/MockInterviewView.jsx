import React, { useState, useEffect } from 'react';
import { Play, Clock, Award, AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, X } from 'lucide-react';

const MOCK_QUESTIONS = {
  Frontend: [
    'Explain the differences between SSR (Server-Side Rendering) and static site generation (SSG).',
    'How do you manage deep prop drilling issues in large application trees?',
    'What are browser request animation frame hooks and when would you select them?',
    'How do closures affect memory retention in nested JavaScript callback states?',
    'Explain core differences between grid layout patterns and flex alignment frameworks.'
  ],
  SystemDesign: [
    'How would you design a rate limiter for a public developer API?',
    'Explain optimistic concurrency control vs pessimistic locking in databases.',
    'How do you handle data replication sync lag across multiple cloud regions?',
    'Explain how CDN edge caching behaves during frequent cache-invalidation cycles.'
  ],
  Behavioral: [
    'Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?',
    'How do you manage deadlines when project specifications shift mid-cycle?',
    'Describe a scenario where you failed to ship a feature on schedule. What did you learn?'
  ]
};

export const MockInterviewView = ({ session = {}, onClose }) => {
  const company = session.company || 'General Preparation';
  
  const [mockType, setMockType] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [report, setReport] = useState(null);

  // Timer loop
  useEffect(() => {
    if (!sessionActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleFinishMock();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleStartMock = (type) => {
    setMockType(type);
    setAnswers({});
    setCurrentIdx(0);
    setCurrentAnswer('');
    setTimeLeft(2700);
    setReport(null);
    setSessionActive(true);
  };

  const handleNextQuestion = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: currentAnswer }));
    setCurrentAnswer(answers[currentIdx + 1] || '');
    setCurrentIdx(prev => prev + 1);
  };

  const handlePrevQuestion = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: currentAnswer }));
    setCurrentAnswer(answers[currentIdx - 1] || '');
    setCurrentIdx(prev => prev - 1);
  };

  const handleFinishMock = () => {
    setSessionActive(false);
    
    // Simulate grading report computation
    const finalScore = Math.floor(Math.random() * 20) + 72; // score between 72 and 92
    const results = {
      score: finalScore,
      duration: Math.round((2700 - timeLeft) / 60),
      strong: mockType === 'Frontend' ? ['React Lifecycle Knowledge', 'CSS Layout positioning'] : ['Architecture patterns', 'Analytical thinking'],
      weak: mockType === 'Frontend' ? ['Time Complexity limits', 'Memory closures retention'] : ['Scalability edge cases', 'Detailing recovery bounds'],
      analysis: `You demonstrated strong communication skills and detailed explanation structures. Your answers for theoretical structures were solid, but you should practice writing precise complexities or code configurations to secure top marks in ${company} evaluations.`
    };
    setReport(results);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // 1. Selector view
  if (!mockType && !report) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 md:p-8 rounded-xl shadow-3xs">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mock Interview Simulator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose a mock category to begin a timed interactive simulation tailored for {company} formats.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Return to Workspace"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'Frontend', label: 'Frontend Engineering', desc: 'React, JS, state sync, Web APIs, CSS layouts.' },
            { id: 'SystemDesign', label: 'System Design', desc: 'Caching, CDNs, DB replicates, scale metrics.' },
            { id: 'Behavioral', label: 'Behavioral (STAR Method)', desc: 'Situational, teamwork, leadership, failure analysis.' }
          ].map(type => (
            <div 
              key={type.id}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 p-5 rounded-xl flex flex-col justify-between items-start gap-4 hover:border-brand-500 transition-custom shadow-3xs"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{type.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{type.desc}</p>
              </div>
              <button
                onClick={() => handleStartMock(type.id)}
                className="w-full py-2 text-xs font-semibold bg-slate-50 hover:bg-brand-600 hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Start Mock
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Active Session View
  if (sessionActive) {
    const questions = MOCK_QUESTIONS[mockType] || MOCK_QUESTIONS.Frontend;
    const currentQuestion = questions[currentIdx];

    return (
      <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs animate-in zoom-in-95 duration-150">
        
        {/* Top Header details */}
        <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-slate-855">
          <span className="text-xs font-bold text-slate-805 dark:text-white bg-slate-105 dark:bg-slate-800 px-3 py-1 rounded">
            {mockType} Mock Session
          </span>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-655 dark:text-slate-350">
              <Clock className="h-4 w-4 text-slate-400" />
              {formatTime(timeLeft)}
            </span>
            <button
              onClick={handleFinishMock}
              className="px-3 py-1 bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400 font-bold rounded hover:bg-red-100 transition-colors cursor-pointer"
            >
              Finish Mock
            </button>
          </div>
        </div>

        {/* Question Area */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>
          
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestion}
          </h3>

          <textarea
            rows={8}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your detailed response here. Explain variables, frameworks, edge cases, and runtime tradeoffs..."
            className="w-full px-4 py-3 text-xs border border-slate-300 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 placeholder-slate-400 dark:placeholder-slate-550 leading-relaxed resize-none"
          />
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={currentIdx === 0}
            onClick={handlePrevQuestion}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1 text-slate-605 dark:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous Question
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleFinishMock}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 dark:bg-white dark:text-slate-950 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Submit Mock Answers
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 text-slate-605 dark:text-slate-300"
            >
              Next Question <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

      </div>
    );
  }

  // 3. Completed grading report
  if (report) {
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-205 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-xl shadow-3xs">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mock Evaluation Report</h2>
            <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5 font-medium">Performance summary calculated for the {mockType} round.</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setReport(null)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 text-slate-605 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Start New Mock
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold rounded-lg text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Return to Workspace
            </button>
          </div>
        </div>

        {/* Scorecard block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-3xs flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 flex items-center justify-center font-bold text-lg">
              {report.score}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-555 tracking-wider">Evaluation Score</span>
              <span className="block text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {report.score >= 80 ? 'Excellent match' : 'Satisfactory result'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-3xs flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-555 tracking-wider">Time Duration</span>
              <span className="block text-xs font-bold text-slate-900 dark:text-white mt-0.5">{report.duration} mins used</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-3xs flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-555 tracking-wider">Estimated Grade</span>
              <span className="block text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {report.score >= 85 ? 'Grade: L5/Senior' : 'Grade: L4/Intermediate'}
              </span>
            </div>
          </div>

        </div>

        {/* Detailed lists: Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-3.5">
            <span className="font-bold text-slate-905 dark:text-white uppercase tracking-wider block">Identified Strengths</span>
            <div className="space-y-2">
              {report.strong.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center text-slate-655 dark:text-slate-350">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-3.5">
            <span className="font-bold text-slate-905 dark:text-white uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Focus for Improvement
            </span>
            <div className="space-y-2">
              {report.weak.map((w, idx) => (
                <div key={idx} className="flex gap-2 items-center text-slate-655 dark:text-slate-350">
                  <span className="h-2 w-2 rounded-full bg-amber-550 flex-shrink-0" />
                  <span className="font-medium">{w}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Written Review Feedback */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs space-y-3.5">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs block">AI Evaluation Insights</span>
          <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed text-justify">
            {report.analysis}
          </p>
        </div>

      </div>
    );
  }

  return null;
};
