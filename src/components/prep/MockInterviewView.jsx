import React, { useState, useEffect } from 'react';
import { Play, Clock, Award, AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, X } from 'lucide-react';
import { auth } from '../../firebase/config';
import { API_URL } from '../../config/api';
import { useInterviewStore } from '../../store/interviewStore';

export const MockInterviewView = ({ session = {}, onClose }) => {
  const company = session.company || 'General Preparation';
  const { role, experience } = useInterviewStore();

  const [mockTypes, setMockTypes] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [mockType, setMockType] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [report, setReport] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(null);

  // Fetch dynamic mock categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        let idToken = "";
        try {
          if (auth?.currentUser) {
            idToken = await auth.currentUser.getIdToken();
          }
        } catch (_) { }

        const headers = { "Content-Type": "application/json" };
        if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

        const response = await fetch(`${API_URL}/api/mock/categories`, {
          method: "POST",
          headers,
          body: JSON.stringify({ company, role, experience }),
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();
        setMockTypes(data.categories || []);
      } catch (err) {
        console.error("[MockInterview] Failed to fetch categories:", err);
        // Fallback to reasonable defaults based on role
        const roleLower = (role || "").toLowerCase();
        let fallbackCategories;
        if (roleLower.includes("ai") || roleLower.includes("ml") || roleLower.includes("machine learning")) {
          fallbackCategories = [
            { id: "machine-learning", label: "Machine Learning", description: "ML algorithms, models, and concepts" },
            { id: "llm-prompting", label: "LLMs & Prompt Engineering", description: "Transformers, LLMs, prompt techniques" },
            { id: "Behavioral", label: "Behavioral", description: "Behavioral questions using the STAR method" },
          ];
        } else if (roleLower.includes("frontend") || roleLower.includes("react")) {
          fallbackCategories = [
            { id: "react-js", label: "React & JavaScript", description: "React hooks, state management, JS concepts" },
            { id: "css-perf", label: "CSS & Performance", description: "CSS layouts, performance optimization" },
            { id: "Behavioral", label: "Behavioral", description: "Behavioral questions using the STAR method" },
          ];
        } else if (roleLower.includes("backend")) {
          fallbackCategories = [
            { id: "node-api", label: "Node.js & APIs", description: "Node.js, Express, REST, GraphQL" },
            { id: "sys-design", label: "System Design", description: "Backend architecture, scaling, databases" },
            { id: "Behavioral", label: "Behavioral", description: "Behavioral questions using the STAR method" },
          ];
        } else if (roleLower.includes("devops")) {
          fallbackCategories = [
            { id: "docker-k8s", label: "Docker & Kubernetes", description: "Containerization, orchestration, CI/CD" },
            { id: "cloud-arch", label: "Cloud Architecture", description: "Cloud services, infrastructure as code" },
            { id: "Behavioral", label: "Behavioral", description: "Behavioral questions using the STAR method" },
          ];
        } else {
          fallbackCategories = [
            { id: "technical", label: `${role || "Technical"} Fundamentals`, description: `Core concepts for ${role || "the role"}` },
            { id: "system-design", label: "System Design", description: "Architecture and design patterns" },
            { id: "Behavioral", label: "Behavioral", description: "Behavioral questions using the STAR method" },
          ];
        }
        setMockTypes(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [company, role, experience]);

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

  const handleFinishMock = async () => {
    setSessionActive(false);
    setEvaluating(true);
    setEvalError(null);

    // Collect all answers by saving the current answer first
    const allAnswers = { ...answers, [currentIdx]: currentAnswer };
    // Use dynamically generated questions based on the selected mock type
    const questions = mockQuestions[mockType?.id] || mockQuestions[mockTypes?.[0]?.id] || [];
    const questionsArr = questions;
    const answersArr = questionsArr.map((_, i) => allAnswers[i] || "");

    try {
      let idToken = "";
      try {
        if (auth?.currentUser) {
          idToken = await auth.currentUser.getIdToken();
        }
      } catch (_) { }

      const headers = { "Content-Type": "application/json" };
      if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

      const response = await fetch(`${API_URL}/api/mock/evaluate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          questions: questionsArr,
          answers: answersArr,
          mockType: mockType?.label || mockType?.id,
          company,
          role,
          experience,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "Evaluation failed (" + response.status + ")");
      }

      const data = await response.json();

      const results = {
        score: data.score,
        duration: Math.round((2700 - timeLeft) / 60),
        strong: data.strengths || [],
        weak: data.weaknesses || [],
        analysis: data.feedback || "No feedback provided.",
        idealAnswer: data.idealAnswer || "",
        confidence: data.confidence || "Medium",
      };
      setReport(results);
    } catch (err) {
      console.error("[MockInterview] Evaluation error:", err);
      setEvalError(err.message);
      // Show a basic report to avoid a blank screen
      setReport({
        score: 0,
        duration: Math.round((2700 - timeLeft) / 60),
        strong: [],
        weak: ["Evaluation failed"],
        analysis: `Error: ${err.message}. Please try again.`,
        idealAnswer: "",
        confidence: "Low",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Generate questions dynamically for each mock type
  const generateQuestionsForType = (typeId, typeLabel) => {
    const label = (typeLabel || typeId || "").toLowerCase();
    if (label.includes("machine learning") || label.includes("ml")) {
      return [
        "Explain the bias-variance tradeoff in machine learning models.",
        "How does gradient descent work? Explain different variants.",
        "What is the difference between bagging and boosting?",
        "Explain how transformers work in NLP.",
        "What is regularization and why is it important?",
        "How do you handle imbalanced datasets?",
        "Explain the concept of attention mechanisms.",
        "What is cross-validation and why is it used?",
        "How does a CNN differ from an RNN?",
        "Explain the concept of transfer learning."
      ];
    }
    if (label.includes("llm") || label.includes("prompt")) {
      return [
        "Explain how large language models are trained.",
        "What is few-shot prompting?",
        "How does prompt engineering improve LLM outputs?",
        "Explain the transformer architecture in detail.",
        "What are embeddings and how are they used in LLMs?",
        "How do you evaluate the performance of an LLM?",
        "What is RAG (Retrieval-Augmented Generation)?",
        "Explain fine-tuning vs pre-training.",
        "How do you handle hallucinations in LLMs?",
        "What are the ethical considerations in deploying LLMs?"
      ];
    }
    if (label.includes("react") || label.includes("frontend") || label.includes("javascript") || label.includes("js")) {
      return [
        "Explain the virtual DOM and how React uses it.",
        "What is the difference between state and props in React?",
        "Explain React hooks: useState, useEffect, useMemo, useCallback.",
        "How do you manage state in large React applications?",
        "What are React keys and why are they important?",
        "Explain JavaScript closures and their practical uses.",
        "What is event delegation in the DOM?",
        "How does the browser render a webpage?",
        "Explain CSS specificity and the cascade.",
        "How do you optimize React application performance?"
      ];
    }
    if (label.includes("css") || label.includes("performance")) {
      return [
        "Explain the CSS box model in detail.",
        "What is the difference between Flexbox and CSS Grid?",
        "How do you optimize website loading performance?",
        "Explain critical rendering path optimization.",
        "What are CSS preprocessors and their benefits?",
        "How does browser caching work?",
        "Explain responsive design principles.",
        "What is the difference between em, rem, px, and vh/vw?",
        "How do you handle CSS animations efficiently?",
        "Explain lazy loading and code splitting."
      ];
    }
    if (label.includes("node") || label.includes("api")) {
      return [
        "Explain the Node.js event loop.",
        "How does middleware work in Express.js?",
        "What is the difference between REST and GraphQL?",
        "Explain how you would design a RESTful API.",
        "What is the difference between SQL and NoSQL databases?",
        "How do you handle authentication in Node.js?",
        "Explain caching strategies for APIs.",
        "How do you handle errors in Node.js applications?",
        "What is WebSocket and when would you use it?",
        "Explain microservices architecture."
      ];
    }
    if (label.includes("system design") || label.includes("sys design")) {
      return [
        "Design a URL shortener like TinyURL.",
        "How would you design a rate limiter?",
        "Design a real-time chat application.",
        "How would you design a distributed cache?",
        "Design a news feed system like Facebook.",
        "Explain consistent hashing in distributed systems.",
        "How would you design a scalable video streaming platform?",
        "Design a task scheduling system.",
        "Explain database sharding strategies.",
        "Design a recommendation system."
      ];
    }
    if (label.includes("docker") || label.includes("kubernetes")) {
      return [
        "Explain the difference between Docker and virtual machines.",
        "How does Kubernetes handle container orchestration?",
        "What is a Dockerfile and how do you optimize it?",
        "Explain Kubernetes pods, deployments, and services.",
        "How do you handle secrets management in Kubernetes?",
        "What is the difference between Docker Compose and Kubernetes?",
        "Explain CI/CD pipeline design.",
        "How do you monitor containerized applications?",
        "What is the role of a service mesh?",
        "Explain Kubernetes auto-scaling."
      ];
    }
    if (label.includes("cloud")) {
      return [
        "Explain the difference between IaaS, PaaS, and SaaS.",
        "How do you design for high availability in the cloud?",
        "Explain infrastructure as code principles.",
        "What is the difference between scalability and elasticity?",
        "How do you handle disaster recovery in cloud architecture?",
        "Explain cloud security best practices.",
        "What is serverless computing and its use cases?",
        "How do you optimize cloud costs?",
        "Explain multi-region deployment strategies.",
        "What is the difference between load balancers and API gateways?"
      ];
    }
    // Behavioral default
    return [
      "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?",
      "Describe a challenging project you worked on. How did you overcome obstacles?",
      "Tell me about a time you failed. What did you learn from it?",
      "How do you prioritize tasks when working on multiple projects?",
      "Describe a situation where you had to learn a new technology quickly.",
      "Tell me about a time you improved a process or system.",
      "How do you handle feedback and criticism?",
      "Describe a situation where you had to work with a difficult stakeholder.",
      "Tell me about a time you went above and beyond for a project.",
      "How do you stay updated with the latest technologies and trends?"
    ];
  };

  // Store generated questions per mock type
  const mockQuestions = {};
  if (mockTypes) {
    mockTypes.forEach((type) => {
      mockQuestions[type.id] = generateQuestionsForType(type.id, type.label);
    });
  }

  // 1. Selector view (loading or showing categories)
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

        {loadingCategories ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex gap-1 mb-4">
              <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Generating mock interview categories for {role}...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(mockTypes || []).map(type => (
              <div
                key={type.id}
                className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 p-5 rounded-xl flex flex-col justify-between items-start gap-4 hover:border-brand-500 transition-custom shadow-3xs"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{type.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{type.description}</p>
                </div>
                <button
                  onClick={() => handleStartMock(type)}
                  className="w-full py-2 text-xs font-semibold bg-slate-50 hover:bg-brand-600 hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Start Mock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Active Session View
  if (sessionActive) {
    const questions = mockQuestions[mockType?.id] || [];
    const currentQuestion = questions[currentIdx];

    if (!currentQuestion) {
      return (
        <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs animate-in zoom-in-95 duration-150">
          <p className="text-sm text-slate-500">No questions available for this category.</p>
          <button onClick={() => { setMockType(null); setSessionActive(false); }}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Back to Categories
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs animate-in zoom-in-95 duration-150">

        {/* Top Header details */}
        <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-slate-855">
          <span className="text-xs font-bold text-slate-805 dark:text-white bg-slate-105 dark:bg-slate-800 px-3 py-1 rounded">
            {mockType?.label || mockType?.id} Mock Session
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
            <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5 font-medium">Performance summary calculated for the {mockType?.label || mockType?.id} round.</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => { setMockType(null); setReport(null); }}
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

