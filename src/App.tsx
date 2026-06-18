import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Binary, 
  GraduationCap, 
  MessageCircle, 
  Flame, 
  RotateCw, 
  Copy, 
  Plus, 
  Trash2, 
  Star, 
  Volume2, 
  VolumeX, 
  Users, 
  Check, 
  Timer, 
  Play, 
  Square, 
  RotateCcw, 
  Info,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Maximize2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STATIC_PROMPTS, CATEGORIES, Prompt } from './data/prompts';
import { sounds } from './utils/audio';

export default function App() {
  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [prompts, setPrompts] = useState<Prompt[]>(STATIC_PROMPTS);
  const [activePrompt, setActivePrompt] = useState<Prompt>(STATIC_PROMPTS[0]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCopied, setShowCopied] = useState<boolean>(false);
  
  // Custom prompt inputs
  const [newPromptText, setNewPromptText] = useState<string>('');
  const [newPromptCat, setNewPromptCat] = useState<'math' | 'sac' | 'general' | 'wacky'>('math');
  const [newPromptHint, setNewPromptHint] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  // Focus Pop-out overlay state
  const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);

  // Participant list state (Breakout groups)
  const [students, setStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState<string>('');
  const [whoStarts, setWhoStarts] = useState<{ name: string; criteria: string } | null>(null);
  const [isDeterminingStudent, setIsDeterminingStudent] = useState<boolean>(false);

  // Timer states
  const [timerDuration, setTimerDuration] = useState<number>(120); // default 2 minutes (120s)
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(120);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- PERSISTENCE & INITIALIZATION ---
  useEffect(() => {
    // Load favorites
    const savedFavs = localStorage.getItem('sac_rules_favs');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    // Load custom prompts
    const savedCustom = localStorage.getItem('sac_rules_custom');
    if (savedCustom) {
      try {
        const parsed: Prompt[] = JSON.parse(savedCustom);
        setPrompts([...STATIC_PROMPTS, ...parsed]);
      } catch (e) {
        console.error(e);
      }
    }

    // Load students
    const savedStudents = localStorage.getItem('sac_rules_students');
    if (savedStudents) {
      try {
        setStudents(JSON.parse(savedStudents));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default placeholder students for testing
      const defaults = ['Martin', 'Jose', 'Dr. Patel', 'Elena'];
      setStudents(defaults);
      localStorage.setItem('sac_rules_students', JSON.stringify(defaults));
    }

    // Load mute status
    const savedMute = localStorage.getItem('sac_rules_mute');
    if (savedMute) {
      const muteValue = savedMute === 'true';
      setIsMuted(muteValue);
      sounds.setMute(muteValue);
    }

    // Set initial prompt
    const initialIndex = Math.floor(Math.random() * STATIC_PROMPTS.length);
    setActivePrompt(STATIC_PROMPTS[initialIndex]);
  }, []);

  // Sync mute state with Audio manager
  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    sounds.setMute(newVal);
    localStorage.setItem('sac_rules_mute', newVal.toString());
    sounds.playClick();
  };

  // --- RANDOMLY DRAW NEW PROMPT ---
  const handleDrawPrompt = (categoryFilter = activeCategory) => {
    if (isShuffling) return;
    setIsShuffling(true);
    setWhoStarts(null); // Clear previous breakout assignment
    
    // Filter down to available pool
    const pool = prompts.filter(p => categoryFilter === 'all' || p.category === categoryFilter);
    if (pool.length === 0) {
      setIsShuffling(false);
      return;
    }

    let iterations = 14;
    let currentIdx = 0;
    
    // Play sound and cycle through previews to make an elegant, exciting shuffle animation!
    const interval = setInterval(() => {
      const tempIdx = Math.floor(Math.random() * pool.length);
      setActivePrompt(pool[tempIdx]);
      sounds.playShuffleTick();
      iterations--;

      if (iterations <= 0) {
        clearInterval(interval);
        // Ensure we end on a random prompt
        const finalPrompt = pool[Math.floor(Math.random() * pool.length)];
        setActivePrompt(finalPrompt);
        setIsShuffling(false);
        sounds.playSuccess();
      }
    }, 85);
  };

  // Switch category filter and draw prompt from the new active category
  const selectCategory = (catId: string) => {
    setActiveCategory(catId);
    sounds.playClick();
    handleDrawPrompt(catId);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('sac_rules_favs', JSON.stringify(updated));
  };

  // Copy prompted text to clipboard
  const copyToClipboard = () => {
    const textToCopy = `First Speaker Rule: ${activePrompt.text}\n💡 Hint: ${activePrompt.hint}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopied(true);
      sounds.playClick();
      setTimeout(() => setShowCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // --- CUSTOM PROMPT CREATION ---
  const addCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptText.trim()) return;

    sounds.playClick();

    const newPrompt: Prompt = {
      id: `custom-${Date.now()}`,
      text: newPromptText.replace(/[?.\s]+$/, '') + ' starts.',
      hint: newPromptHint.trim() || 'Work out the math or criteria together in your group!',
      category: newPromptCat
    };

    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    setActivePrompt(newPrompt);
    setNewPromptText('');
    setNewPromptHint('');
    setShowCustomForm(false);

    // Save custom array to storage
    const customOnly = updatedPrompts.filter(p => p.id.startsWith('custom-'));
    localStorage.setItem('sac_rules_custom', JSON.stringify(customOnly));
    sounds.playSuccess();
  };

  // Reset prompts back to static list
  const clearCustomPrompts = () => {
    if (confirm('Are you sure you want to delete all custom rules? This cannot be undone.')) {
      sounds.playClick();
      setPrompts(STATIC_PROMPTS);
      const firstStatic = STATIC_PROMPTS[0];
      setActivePrompt(firstStatic);
      localStorage.removeItem('sac_rules_custom');
    }
  };

  // --- STUDENT / BREAKOUT REGISTRATION ---
  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim()) return;
    
    // Max 15 students for clean view
    if (students.length >= 15) {
      alert("Breakout groups are usually 3-6 students. Max 15 students to keep it clean!");
      return;
    }

    sounds.playClick();
    const updated = [...students, newStudent.trim()];
    setStudents(updated);
    localStorage.setItem('sac_rules_students', JSON.stringify(updated));
    setNewStudent('');
  };

  const removeStudent = (indexToRemove: number) => {
    sounds.playClick();
    const updated = students.filter((_, idx) => idx !== indexToRemove);
    setStudents(updated);
    localStorage.setItem('sac_rules_students', JSON.stringify(updated));
    // Clear start matching since name list changed
    setWhoStarts(null);
  };

  const clearStudents = () => {
    sounds.playClick();
    setStudents([]);
    localStorage.setItem('sac_rules_students', JSON.stringify([]));
    setWhoStarts(null);
  };

  // Decide who starts in the current breakout list
  const determineFirstSpeaker = () => {
    if (students.length === 0) return;
    sounds.playClick();
    setIsDeterminingStudent(true);

    let iterations = 12;
    const interval = setInterval(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      setWhoStarts({ name: randomStudent, criteria: activePrompt.text });
      sounds.playShuffleTick();
      iterations--;

      if (iterations <= 0) {
        clearInterval(interval);
        const finalStudent = students[Math.floor(Math.random() * students.length)];
        setWhoStarts({ name: finalStudent, criteria: activePrompt.text });
        setIsDeterminingStudent(false);
        sounds.playSuccess();
      }
    }, 100);
  };

  // --- TIMER FUNCTIONS ---
  const startTimer = () => {
    if (timerActive) return;
    sounds.playClick();
    setTimerActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setTimerActive(false);
          sounds.playBeepAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    sounds.playClick();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerActive(false);
  };

  const resetTimer = (newSeconds = timerPreset) => {
    sounds.playClick();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerActive(false);
    setTimerPreset(newSeconds);
    setTimeLeft(newSeconds);
  };

  // Helper to format remaining time
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Listen for Escape key to close the focus modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusModalOpen) {
        sounds.playClick();
        setIsFocusModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusModalOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-200 selection:text-rose-900 transition-colors duration-300 pb-16">
      {/* HEADER BAR */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-20 shadow-xs">
        <div id="nav-header" className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md text-xl font-bold">
              ∑
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg leading-tight text-slate-900 tracking-tight flex items-center gap-2">
                First Speaker Rules
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold tracking-wider">
                  SAC Math Edition
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Santa Ana Community College Classroom Facilitator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="sound-toggle"
              onClick={toggleMute}
              className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isMuted 
                  ? 'border-slate-300 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600' 
                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <a 
              href="https://firstplayer.fun/"
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex text-xs text-slate-500 hover:text-rose-600 items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
              First Player Fun <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* BANNER DESCRIPTION CARD */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-xs font-semibold">
              <BookOpen size={13} /> Workshop Pedagogy
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-slate-900">
              Transform Breakout Icebreakers with Math & Local Trivia!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Eliminate awkward silences when a virtual breakout room or group starts. These randomized mathematical and campus-themed prompts provide instant order, personal anecdotes, and lighthearted logic to start student discussions immediately.
            </p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex-1 md:flex-none md:w-44 text-amber-900">
              <div className="text-lg font-bold font-mono">100%</div>
              <div className="text-xs text-amber-800">No awkward waiting around for who goes first.</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex-1 md:flex-none md:w-44 text-rose-900">
              <div className="text-lg font-bold font-mono">π & 🌴</div>
              <div className="text-xs text-rose-800">Made for SAC Math lectures. Built to connect.</div>
            </div>
          </div>
        </section>

        {/* CORE APPLICATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLUMNS: ACTIVE RULE GENERATOR */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CATEGORIES / FILTER CAROUSEL */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">Select Theme</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN ACTIVE RULE COMPONENT */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-8 relative overflow-hidden">
              
              {/* Category label badge in card */}
              <div className="flex items-center justify-between mb-8">
                <span className={`text-[11px] uppercase font-mono px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 border ${
                  activePrompt.category === 'math' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  activePrompt.category === 'sac' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  activePrompt.category === 'general' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
                }`}>
                  {activePrompt.category === 'math' && <Binary size={12} />}
                  {activePrompt.category === 'sac' && <GraduationCap size={12} />}
                  {activePrompt.category === 'general' && <MessageCircle size={12} />}
                  {activePrompt.category === 'wacky' && <Flame size={12} />}
                  {activePrompt.category.toUpperCase()} EDITION
                </span>

                <button
                  onClick={(e) => toggleFavorite(activePrompt.id, e)}
                  className="p-1.5 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                  title="Bookmark rule"
                >
                  <Star 
                    size={22} 
                    fill={favorites.includes(activePrompt.id) ? '#f59e0b' : 'none'} 
                    className={favorites.includes(activePrompt.id) ? 'text-amber-500' : ''} 
                  />
                </button>
              </div>

              {/* Cue text / statement with visual animation container */}
              <div className="min-h-36 flex flex-col justify-center relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePrompt.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className={`font-sans font-bold leading-snug tracking-tight text-slate-950 text-xl md:text-2xl ${
                      isShuffling ? 'filter blur-[1px]' : ''
                    }`}>
                      &ldquo;{activePrompt.text}&rdquo;
                    </p>
                                {/* Collaborative Hint Box */}
                    <div className="flex items-start gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-slate-600 text-xs leading-relaxed">
                      <div className="mt-0.5 text-rose-600 flex-shrink-0">
                        <Lightbulb size={14} className="animate-pulse" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800">Teacher's Guide / Icebreaker Hint:</span>
                        <p>{activePrompt.hint}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Action Controls */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  id="draw-random-btn"
                  onClick={() => handleDrawPrompt()}
                  disabled={isShuffling}
                  className={`px-6 py-4.5 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer ${
                    isShuffling 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-rose-600 hover:bg-rose-700 hover:shadow-lg'
                  }`}
                >
                  <RotateCw size={18} className={isShuffling ? 'animate-spin' : ''} />
                  {isShuffling ? 'Shuffling Deck...' : 'Draw Another Prompt'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id="popout-focus-btn"
                    onClick={() => { sounds.playClick(); setIsFocusModalOpen(true); }}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-rose-250 bg-rose-50 hover:bg-rose-100/80 text-sm font-semibold text-rose-700 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    title="Pop out Fullscreen Focus View"
                  >
                    <Maximize2 size={16} />
                    <span>Pop Out</span>
                  </button>

                  <button
                    id="copy-text-btn"
                    onClick={copyToClipboard}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {showCopied ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Favorite Marker badge */}
              {favorites.includes(activePrompt.id) && (
                <div className="absolute top-0 right-12 text-amber-500 font-bold bg-amber-50 text-[10px] px-2.5 py-1 rounded-b-md shadow-xs border-b border-x border-amber-100 font-mono flex items-center gap-1">
                  <Star size={10} fill="#f59e0b" /> BOOKMARKED
                </div>
              )}
            </div>

            {/* OPTIONAL FORM TO SUBMIT NEW PROMPT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                onClick={() => { sounds.playClick(); setShowCustomForm(!showCustomForm); }}
                className="w-full text-left px-6 py-4 font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Plus size={16} className="text-rose-600" /> Combine Your Own: Create Custom Rules
                </span>
                <span className="text-xs text-rose-600 font-semibold underline">
                  {showCustomForm ? 'Collapse' : 'Expand Form'}
                </span>
              </button>

              <AnimatePresence>
                {showCustomForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100 bg-slate-50/50"
                  >
                    <form onSubmit={addCustomPrompt} className="p-6 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Rule text (The system will append "starts." automatically)
                        </label>
                        <input
                          type="text"
                          required
                          value={newPromptText}
                          onChange={(e) => setNewPromptText(e.target.value)}
                          placeholder="e.g. The student wearing the classiest calculator watch"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Prompt Theme
                          </label>
                          <select
                            value={newPromptCat}
                            onChange={(e) => setNewPromptCat(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                          >
                            <option value="math">📐 Mathematics & Logic</option>
                            <option value="sac">🌴 SAC & Local Campus</option>
                            <option value="general">💬 General Icebreakers</option>
                            <option value="wacky">🎭 Wacky & Rapid-Fire</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Discussion Tip or Explanation (Optional)
                          </label>
                          <input
                            type="text"
                            value={newPromptHint}
                            onChange={(e) => setNewPromptHint(e.target.value)}
                            placeholder="e.g. Ask classmates what brand watch they have."
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={clearCustomPrompts}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} /> Reset to static prompts
                        </button>

                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                        >
                          Save New Custom Rule
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QUICK LEGEND INFO PANELS */}
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info size={14} className="text-slate-500" />
                Workshop Guidelines for Professors
              </div>
              <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                <li>Students join small groups or virtual breakout rooms (normally 3-5 students).</li>
                <li>Display this prompt on the screen or paste it to the breakout message description so everyone sees the rule.</li>
                <li>Encourage students to briefly explain how they score / evaluate the rule. In finding out who wakes up the earliest or lives furthest in Santa Ana, they automatically learn each other's schedules, commutes, and names.</li>
                <li>Once the first speaker is decided, they assume the facilitator role to invite others to comment!</li>
              </ul>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: CLASSROOM UTILITIES (TEAM RESOLVER & DISCUSSION TIMER) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* DISCUSSION TIMER MODULE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Timer size={16} className="text-slate-500" />
                  Classroom Talk Timer
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                  Active Limit
                </span>
              </div>

              {/* Main digital clock readout */}
              <div className="text-center py-6 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="text-4xl font-mono font-bold tracking-tight text-slate-900">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold tracking-wider font-mono">
                  {timerActive ? 'Discussion in progress' : 'Talk duration'}
                </p>
              </div>

              {/* Presets and custom settings */}
              <div className="flex items-center justify-between gap-1.5 mt-4">
                {[
                  { label: '1m', sec: 60 },
                  { label: '2m', sec: 120 },
                  { label: '3m', sec: 180 },
                  { label: '5m', sec: 300 }
                ].map((preset) => (
                  <button
                    key={preset.sec}
                    onClick={() => resetTimer(preset.sec)}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timerPreset === preset.sec && !timerActive
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Timer interactive buttons */}
              <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
                {timerActive ? (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Square size={13} fill="white" /> Pause Wait
                  </button>
                ) : (
                  <button
                    disabled={timeLeft === 0}
                    onClick={startTimer}
                    className={`flex-1 py-3 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      timeLeft === 0 
                        ? 'bg-slate-300 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <Play size={13} fill="white" /> Begin discussion
                  </button>
                )}

                <button
                  onClick={() => resetTimer(timerPreset)}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Reset timer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* BREAKOUT GROUP RESOLVER (PARTICIPANT ROULETTE) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Users size={16} className="text-rose-600 animate-pulse" />
                  Breakout Group Simulator
                </div>
                {students.length > 0 && (
                  <button
                    onClick={clearStudents}
                    className="text-[10px] text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-1 rounded font-bold uppercase transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
                Check who starts in a specific group. Enter names of students currently in your local table or Zoom breakout room:
              </p>

              {/* Student pill list */}
              <div className="flex flex-wrap gap-1.5 mb-4 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-100">
                {students.length === 0 ? (
                  <p className="text-slate-400 text-[11px] italic p-2 text-center w-full">
                    No students added. Enter names below!
                  </p>
                ) : (
                  students.map((std, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700"
                    >
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-150 px-1 rounded-sm">{index + 1}</span>
                      {std}
                      <button
                        onClick={() => removeStudent(index)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                        title="Remove student"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input box to add name */}
              <form onSubmit={addStudent} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  placeholder="e.g. Alana, Jose, Tyler..."
                  maxLength={18}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </form>

              {/* Draw outcome decision */}
              <button
                onClick={determineFirstSpeaker}
                disabled={students.length === 0 || isDeterminingStudent || isShuffling}
                className={`w-full py-3 rounded-xl font-bold text-white text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  students.length === 0 || isDeterminingStudent || isShuffling
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isDeterminingStudent ? (
                  <>
                    <RotateCw size={14} className="animate-spin" /> Matching...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Decide First Speaker in This Group
                  </>
                )}
              </button>

              {/* Match Output Card */}
              {whoStarts && (
                <div className="mt-4 p-4.5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-slate-900 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[8px] font-mono font-bold uppercase rounded-bl-lg tracking-wider">
                    TARGET FOUND
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider mb-1">
                    Group Decision
                  </p>
                  <p className="text-sm font-sans font-extrabold text-rose-950">
                    🏆 {whoStarts.name} should go first!
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 italic border-t border-rose-100/60 pt-1.5 leading-relaxed">
                    Based on Rule: &ldquo;{whoStarts.criteria}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* QUICK BOOKMARKED SLATE */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-3">
                  <Star size={16} className="text-amber-500" fill="#f59e0b" />
                  Your Bookmarked Rules ({favorites.length})
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {prompts
                    .filter(p => favorites.includes(p.id))
                    .map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          sounds.playClick();
                          setActivePrompt(p);
                        }}
                        className={`p-3 bg-slate-50 hover:bg-rose-50/50 border rounded-xl text-[11px] font-semibold text-slate-700 transition-all cursor-pointer leading-normal flex items-start justify-between gap-2 group ${
                          activePrompt.id === p.id ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200' : 'border-slate-100'
                        }`}
                      >
                        <span className="flex-1 line-clamp-2">&ldquo;{p.text}&rdquo;</span>
                        <div className="font-mono text-[9px] text-slate-400 bg-white border border-slate-150 px-1 py-0.5 rounded-xs shrink-0 capitalize">
                          {p.category}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* FOOTER CREDITS */}
      <footer className="mt-20 border-t border-slate-200 text-center py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 font-mono">
            SUM(First Speaker Rules) = Clear & Confident Collaboration!
          </p>
          <p>
            Tailored especially for Santa Ana Community College Math Classrooms. Made with pride for SAC Dons everywhere.
          </p>
          <div className="flex items-center justify-center gap-4 pt-1 text-slate-400">
            <span>Room Icebreakers</span>
            <span>•</span>
            <span>Syllabus Math Drills</span>
            <span>•</span>
            <span>Interactive Game Elements</span>
          </div>
        </div>
      </footer>

      {/* THEATER FOCUS MODE MODAL (POP-OUT BOARD) */}
      <AnimatePresence>
        {isFocusModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto"
            onClick={() => { sounds.playClick(); setIsFocusModalOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border-3 border-slate-900 rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(244,63,94,0.3)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top info and category badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <span className={`text-[11px] uppercase font-mono px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 border ${
                  activePrompt.category === 'math' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  activePrompt.category === 'sac' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  activePrompt.category === 'general' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
                }`}>
                  {activePrompt.category === 'math' && <Binary size={12} />}
                  {activePrompt.category === 'sac' && <GraduationCap size={12} />}
                  {activePrompt.category === 'general' && <MessageCircle size={12} />}
                  {activePrompt.category === 'wacky' && <Flame size={12} />}
                  {activePrompt.category.toUpperCase()} EDITION
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(activePrompt.id, e)}
                    className="p-1.5 text-slate-405 hover:text-amber-500 transition-colors cursor-pointer"
                    title="Bookmark rule"
                  >
                    <Star 
                      size={20} 
                      fill={favorites.includes(activePrompt.id) ? '#f59e0b' : 'none'} 
                      className={favorites.includes(activePrompt.id) ? 'text-amber-500' : ''} 
                    />
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); setIsFocusModalOpen(false); }}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                    title="Close Screen"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Massive prompt text */}
              <div className="py-8 text-center space-y-4">
                <p className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-widest">
                  First Speaker Rule Pop-out
                </p>
                <div className="px-2">
                  <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-950 leading-snug tracking-tight font-sans">
                    &ldquo;{activePrompt.text}&rdquo;
                  </h2>
                </div>
              </div>

              {/* Discussion Hint Box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 text-xs text-slate-600 mb-8 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-850">
                  <Lightbulb size={13} className="text-rose-600 animate-pulse" />
                  <span>Teacher's Note / Icebreaker Hint:</span>
                </div>
                <p className="leading-relaxed">{activePrompt.hint}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="modal-copy-btn"
                  onClick={copyToClipboard}
                  className="px-4 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {showCopied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>

                <button
                  id="modal-shuffle-btn"
                  onClick={() => {
                    handleDrawPrompt();
                  }}
                  disabled={isShuffling}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCw size={14} className={isShuffling ? 'animate-spin' : ''} />
                  <span>Shuffle Deck Again</span>
                </button>

                <button
                  onClick={() => { sounds.playClick(); setIsFocusModalOpen(false); }}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Screen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
