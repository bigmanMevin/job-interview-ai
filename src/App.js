import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, Building2, Briefcase, RefreshCw, Zap, Copy, Clock, History, Moon, Sun, Play, Pause, CheckCircle, X, Download, Star, BarChart } from 'lucide-react';

const JobAssist = () => {
  // Core state
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [error, setError] = useState('');
  
  // Dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // History
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Practice mode
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(120); // 2 minutes per question
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Question ratings
  const [questionRatings, setQuestionRatings] = useState({});
  
  // Copy feedback
  const [copyFeedback, setCopyFeedback] = useState('');

  const timerRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    const savedHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    setHistory(savedHistory);
    
    const savedRatings = JSON.parse(localStorage.getItem('questionRatings') || '{}');
    setQuestionRatings(savedRatings);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timer]);

  const generateQuestions = async () => {
    if (!targetCompany.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratingProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGeneratingProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const difficultyPrompts = {
        easy: 'Generate 5 easy, straightforward interview questions suitable for beginners.',
        medium: 'Generate 5 moderate difficulty interview questions with some technical depth.',
        hard: 'Generate 5 challenging, in-depth interview questions that test advanced knowledge.'
      };

      const prompt = `You are an expert interviewer. ${difficultyPrompts[difficulty]}

Interview details:
- Company: ${targetCompany}
- Position: ${targetRole || 'General position'}
- Level: ${experienceLevel || 'All levels'}
- Difficulty: ${difficulty}

Make them:
- Specific to ${targetCompany}'s products, culture, and industry
- Appropriate for ${experienceLevel || 'general'} experience level
- Related to ${targetRole || 'the position'} responsibilities
- Realistic questions an interviewer would actually ask

Format as a simple numbered list:
1. [question]
2. [question]
3. [question]
4. [question]
5. [question]`;

      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Backend not responding. Make sure it\'s running!');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.response) {
        throw new Error('No response from AI. Backend might not be connected to Ollama.');
      }

      let text = data.response;
      
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid response format from AI');
      }
      
      const lines = text.split('\n').filter(line => line.trim());
      const questionLines = lines.filter(line => /^\d+[\.\)]\s/.test(line.trim()));
      
      let extractedQuestions = [];
      if (questionLines.length >= 5) {
        extractedQuestions = questionLines.slice(0, 5).map(q => 
          q.replace(/^\d+[\.\)]\s*/, '').trim()
        );
      } else {
        extractedQuestions = lines.slice(0, 5).map(q => q.replace(/^\d+[\.\)]\s*/, '').trim());
      }
      
      setQuestions(extractedQuestions.length > 0 ? extractedQuestions : [text]);
      
      // Save to history
      const historyEntry = {
        id: Date.now(),
        company: targetCompany,
        role: targetRole,
        level: experienceLevel,
        difficulty: difficulty,
        questions: extractedQuestions,
        date: new Date().toISOString()
      };
      
      const updatedHistory = [historyEntry, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('interviewHistory', JSON.stringify(updatedHistory));
      
      setGeneratingProgress(100);
      
    } catch (err) {
      setError(err.message);
      console.error(err);
    }

    clearInterval(progressInterval);
    setIsGenerating(false);
    setTimeout(() => setGeneratingProgress(0), 1000);
  };

  const copyToClipboard = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('✓ Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    });
  };

  const downloadQuestions = () => {
    const text = `Interview Questions for ${targetRole || 'Position'} at ${targetCompany}\n\n` +
                 questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetCompany}_interview_questions.txt`;
    a.click();
  };

  const startPractice = () => {
    setPracticeMode(true);
    setCurrentQuestionIndex(0);
    setTimer(120);
    setIsTimerRunning(true);
    setAnswers({});
    setCurrentAnswer('');
  };

  const saveAnswer = () => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: currentAnswer
    });
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(answers[currentQuestionIndex + 1] || '');
      setTimer(120);
      setIsTimerRunning(true);
    } else {
      setPracticeMode(false);
      setIsTimerRunning(false);
    }
  };

  const toggleQuestionRating = (index, status) => {
    const key = `${targetCompany}_${index}`;
    const newRatings = { ...questionRatings };
    
    if (newRatings[key] === status) {
      delete newRatings[key];
    } else {
      newRatings[key] = status;
    }
    
    setQuestionRatings(newRatings);
    localStorage.setItem('questionRatings', JSON.stringify(newRatings));
  };

  const loadFromHistory = (entry) => {
    setTargetCompany(entry.company);
    setTargetRole(entry.role);
    setExperienceLevel(entry.level);
    setDifficulty(entry.difficulty);
    setQuestions(entry.questions);
    setShowHistory(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const popularCompanies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix'];

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';
  const textClass = darkMode ? 'text-gray-100' : 'text-slate-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-slate-600';
  const inputClass = darkMode 
    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
    : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${textClass}`}>JobAssist</h1>
          </div>
          <p className={`${textSecondaryClass} text-lg`}>AI-Generated Interview Questions</p>
          <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Offline AI
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1 ${darkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-full text-xs font-medium hover:scale-105 transition-transform flex items-center gap-1`}
            >
              {darkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1 ${darkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-full text-xs font-medium hover:scale-105 transition-transform flex items-center gap-1`}
            >
              <History className="w-3 h-3" />
              History ({history.length})
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className={`${cardClass} rounded-2xl shadow-xl border p-6 mb-6 animate-fadeIn`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textClass}`}>Recent Searches</h3>
              <button onClick={() => setShowHistory(false)} className={textSecondaryClass}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => loadFromHistory(entry)}
                  className={`w-full text-left p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'} transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${textClass}`}>{entry.company}</p>
                      <p className={`text-sm ${textSecondaryClass}`}>
                        {entry.role} • {entry.difficulty} • {entry.questions.length} questions
                      </p>
                    </div>
                    <span className={`text-xs ${textSecondaryClass}`}>
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Practice Mode */}
        {practiceMode && questions.length > 0 && (
          <div className={`${cardClass} rounded-2xl shadow-xl border p-8 mb-6 animate-slideIn`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${textClass}`}>Practice Mode</h3>
                <p className={textSecondaryClass}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timer < 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">{formatTime(timer)}</span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} rounded-xl p-6 mb-6 border-2 ${darkMode ? 'border-indigo-800' : 'border-indigo-200'}`}>
              <p className={`text-lg ${textClass} font-medium`}>
                {questions[currentQuestionIndex]}
              </p>
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full h-48 p-4 border-2 ${inputClass} rounded-xl focus:outline-none resize-none mb-4`}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPracticeMode(false);
                  setIsTimerRunning(false);
                }}
                className={`flex-1 border-2 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-slate-300 hover:bg-slate-50'} ${textClass} py-3 rounded-xl font-semibold transition-all`}
              >
                Exit Practice
              </button>
              <button
                onClick={saveAnswer}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        {!practiceMode && (
          <div className={`${cardClass} rounded-2xl shadow-xl border p-8 animate-fadeIn`}>
            {questions.length === 0 ? (
              /* Input Form */
              <div>
                <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>
                  Generate AI Interview Questions
                </h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
                    <p className="text-red-700 text-sm font-semibold mb-1">⚠️ Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Loading Progress */}
                {isGenerating && generatingProgress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${textSecondaryClass}`}>
                        Generating questions...
                      </span>
                      <span className={`text-sm font-bold ${textClass}`}>{generatingProgress}%</span>
                    </div>
                    <div className={`w-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-300 animate-pulse"
                        style={{ width: `${generatingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Company Input */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClass} mb-2`}>
                      <Building2 className="w-4 h-4" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="Any company - AI generates custom questions!"
                      className={`w-full p-4 border-2 ${inputClass} rounded-xl focus:outline-none text-lg transition-all`}
                    />
                    <p className={`text-xs ${textSecondaryClass} mt-2`}>
                      Works with ANY company - completely offline!
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {popularCompanies.map(company => (
                        <button
                          key={company}
                          onClick={() => setTargetCompany(company)}
                          className={`p-2 border-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                            targetCompany === company 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                              : `${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-slate-200 hover:bg-slate-50'} ${textClass}`
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role Input */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold ${textClass} mb-2`}>
                      <Briefcase className="w-4 h-4" />
                      Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g., Software Engineer, Product Manager"
                      className={`w-full p-4 border-2 ${inputClass} rounded-xl focus:outline-none transition-all`}
                    />
                  </div>

                  {/* Experience Level & Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-semibold ${textClass} mb-2 block`}>
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className={`w-full p-4 border-2 ${inputClass} rounded-xl focus:outline-none transition-all`}
                      >
                        <option value="">Any Level</option>
                        <option value="intern">Intern</option>
                        <option value="junior">Junior</option>
                        <option value="mid-level">Mid-Level</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>

                    <div>
                      <label className={`text-sm font-semibold ${textClass} mb-2 block`}>
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className={`w-full p-4 border-2 ${inputClass} rounded-xl focus:outline-none transition-all`}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateQuestions}
                    disabled={isGenerating || !targetCompany.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        AI is generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Questions
                      </>
                    )}
                  </button>

                  <p className={`text-xs text-center ${textSecondaryClass}`}>
                    100% offline • No internet required • Completely private
                  </p>
                </div>
              </div>
            ) : (
              /* Questions Display */
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${textClass}`}>Your AI Questions</h2>
                    <p className={textSecondaryClass}>
                      For {targetRole || 'interview'} at <span className="font-semibold text-indigo-600">{targetCompany}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuestions([])}
                    className={`px-4 py-2 ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-indigo-600 hover:bg-indigo-50'} rounded-lg flex items-center gap-2 transition-all`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    New
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {questions.map((question, idx) => {
                    const ratingKey = `${targetCompany}_${idx}`;
                    const rating = questionRatings[ratingKey];
                    
                    return (
                      <div key={idx} className={`${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-slate-50 to-blue-50'} rounded-xl p-5 border-2 ${darkMode ? 'border-gray-600' : 'border-slate-200'} hover:border-indigo-300 transition-all transform hover:scale-[1.02]`}>
                        <div className="flex gap-4">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`${textClass} text-lg leading-relaxed mb-3`}>{question}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleQuestionRating(idx, 'practiced')}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                  rating === 'practiced'
                                    ? 'bg-green-600 text-white'
                                    : `${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-200 hover:bg-slate-300'} ${textSecondaryClass}`
                                }`}
                              >
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Practiced
                              </button>
                              <button
                                onClick={() => toggleQuestionRating(idx, 'need-work')}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                  rating === 'need-work'
                                    ? 'bg-yellow-600 text-white'
                                    : `${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-200 hover:bg-slate-300'} ${textSecondaryClass}`
                                }`}
                              >
                                <Star className="w-3 h-3 inline mr-1" />
                                Need Work
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={copyToClipboard}
                    className={`border-2 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-indigo-600 hover:bg-indigo-50'} ${textClass} py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2`}
                  >
                    <Copy className="w-5 h-5" />
                    {copyFeedback || 'Copy All'}
                  </button>
                  <button
                    onClick={downloadQuestions}
                    className={`border-2 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-indigo-600 hover:bg-indigo-50'} ${textClass} py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2`}
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startPractice}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Practice Mode
                  </button>
                  <button
                    onClick={generateQuestions}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate New
                  </button>
                </div>

                {/* Stats */}
                <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'} border ${darkMode ? 'border-gray-600' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-indigo-600" />
                      <span className={textSecondaryClass}>Progress:</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-green-600 font-semibold">
                        {Object.values(questionRatings).filter(r => r === 'practiced').length} Practiced
                      </span>
                      <span className="text-yellow-600 font-semibold">
                        {Object.values(questionRatings).filter(r => r === 'need-work').length} Need Work
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <p className={`flex items-center justify-center gap-1 ${textSecondaryClass}`}>
            <Zap className="w-4 h-4 text-green-600" />
            Powered by Ollama • 100% Offline • Completely Free
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JobAssist;