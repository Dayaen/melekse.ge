import { useState, useEffect, useRef, useMemo } from "react";
import lottie from "lottie-web";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  HelpCircle, 
  Lock, 
  Unlock, 
  Compass, 
  ExternalLink,
  BookMarked,
  Info,
  Menu,
  X,
  Type,
  ChevronDown
} from "lucide-react";
import { CHAPTERS } from "./data";
import { Chapter, Stanza, WordToken } from "./types";

interface WordTipProps {
  key?: any;
  token: WordToken;
}

function WordTip({ token }: WordTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [leftOffset, setLeftOffset] = useState<number>(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      const updatePosition = () => {
        if (!tooltipRef.current) return;
        const rect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        let offset = 0;
        
        // Pad by 12px from both left and right screen edges
        if (rect.left < 12) {
          offset = 12 - rect.left;
        } else if (rect.right > viewportWidth - 12) {
          offset = (viewportWidth - 12) - rect.right;
        }
        
        setLeftOffset(offset);
      };
      
      // Delay slightly or use animation frame to measure bounding box after rendering
      const rId = requestAnimationFrame(updatePosition);
      
      window.addEventListener("resize", updatePosition);
      return () => {
        cancelAnimationFrame(rId);
        window.removeEventListener("resize", updatePosition);
      };
    } else {
      setLeftOffset(0);
    }
  }, [isOpen]);

  if (!token.tip) {
    return <span className="text-stone-900">{token.text}</span>;
  }

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-help select-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <span className="border-b-2 border-dotted border-red-700/50 hover:border-[#a11c1e] hover:text-[#a11c1e] transition-all duration-200 font-medium pb-0.5 px-0.5 rounded-sm hover:bg-red-700/5">
        {token.text}
      </span>
      {isOpen && (
        <span
          ref={tooltipRef}
          style={{
            transform: `translateX(calc(-50% + ${leftOffset}px))`
          }}
          className="absolute bottom-full left-1/2 mb-2 w-max max-w-[200px] sm:max-w-[280px] whitespace-normal bg-stone-950 border-2 border-amber-600/30 text-[#fff5e6] px-3.5 py-2 rounded-xl text-xs leading-relaxed shadow-2xl z-50 animate-fade-in text-center break-words font-sans-geo font-normal pointer-events-none select-none transition-transform duration-75"
        >
          <span className="text-stone-100 font-medium">{token.tip}</span>
          <span
            style={{
              left: `calc(50% - ${leftOffset}px)`
            }}
            className="absolute top-full -translate-x-1/2 border-[6px] border-transparent border-t-stone-950 transition-all duration-75"
          ></span>
        </span>
      )}
    </span>
  );
}

interface ClawMenuItemProps {
  key?: any;
  chapter: Chapter;
  active: boolean;
  onSelect: () => void;
}

function ClawMenuItem({ chapter, active, onSelect }: ClawMenuItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://lottie.host/801a04d5-8f65-4f76-905c-3f982759e9f6/Xo8fRREiFv.json"
      });
    }
    return () => {
      if (animRef.current) {
        animRef.current.destroy();
      }
    };
  }, []);

  const handleTrigger = () => {
    if (animRef.current) {
      setIsScratching(true);
      animRef.current.goToAndPlay(0, true);
      
      // Stop scratch styling effect after animation ends
      setTimeout(() => {
        setIsScratching(false);
      }, 700);
    }
    onSelect();
  };

  return (
    <li
      onClick={handleTrigger}
      className={`relative py-1 px-2.5 my-0.5 rounded-md border cursor-pointer overflow-hidden transition-all duration-300 font-semibold select-none group
        ${active 
          ? "bg-amber-950/10 text-red-800 border-red-800/25 shadow-sm font-bold" 
          : "bg-transparent text-stone-700 hover:text-stone-950 border-transparent hover:bg-stone-800/5"
        }`}
    >
      <div className="relative z-10 flex flex-col items-start gap-0.5">
        <span className="font-serif-geo text-xs sm:text-[13px] leading-tight-normal">{chapter.title}</span>
        <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono group-hover:text-red-700/80 transition-colors">
          {chapter.rangeText}
        </span>
      </div>

      {/* Tiger Claw animation container */}
      <div
        ref={containerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] pointer-events-none z-40 opacity-70 mix-blend-multiply"
        style={{ width: "240px", height: "100px" }}
      />

      {/* Claw Slash visual effect wrapper */}
      {isScratching && (
        <div className="absolute inset-0 bg-red-700/5 border border-red-700/20 backdrop-blur-[0.5px] rounded-lg pointer-events-none animate-pulse" />
      )}
    </li>
  );
}

const APHORISMS = [
  "„სიკეთე სძლივს ბოროტსა, კეთილი მისი გრძელია“",
  "„რასაცა გაჰცემ შენია, რაც არა, დაკარგულია“",
  "„ვინ მოყვარესა არ ეძებს, იგი თავისა მტერია“",
  "„სჯობს სიცოცხლესა ნაძრახსა სიკვდილი სახელოვანი“",
  "„სიცრუე და ორპირობა ავნებს ხორცსა, მერმე სულსა“",
  "„ხამს მოყვარე მოყვრისათვის თავი არ დაზოგოს, გული მისცეს გულისათვის“",
  "„გველსა ხვრელით ამოიყვანს ენა ტკბილად მოუბარი“",
  "„სჯობს სახელისა მოხვეჭა ყოველსა მოსახვეჭელსა“",
  "„არა ვიქმ, ცოდნა რას მარგებს, ფილოსოფოსთა ბრძნობისა“",
  "„შიში შეიქმს სიყვარულსა“"
];

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState<string>("prologue");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [aphorismIndex, setAphorismIndex] = useState<number>(0);
  const [showParaphraseMap, setShowParaphraseMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAphorismIndex((prev) => (prev + 1) % APHORISMS.length);
    }, 25000); // changes every 25 seconds
    return () => clearInterval(interval);
  }, []);

  const fontSize = 14;
  const theme = "parchment";
  const viewMode = "cards";
  const searchQuery = "";

  // Find active chapter data
  const currentChapter = useMemo(() => {
    return CHAPTERS.find((ch) => ch.id === activeChapterId) || CHAPTERS[0];
  }, [activeChapterId]);

  // Navigate to chapters and scroll to top
  const handleChapterSelect = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setShowParaphraseMap({}); // reset on chapter change so mobile users start fresh
    
    // Close sidebar overlay on mobile view
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Theme configuration values
  const themeClasses = {
    parchment: {
      bg: "bg-[radial-gradient(circle_at_center,#f5e6ce_0%,#e8d8be_60%,#d2b48c_100%)]",
      overlay: "opacity-[0.06] mix-blend-overlay",
      card: "bg-[#f2e2c6]/90 border-[#c2b296]/50 shadow-md",
      textMain: "text-[#2D1B10]",
      textMuted: "text-[#5a4033]/85",
      accent: "text-[#7B1113]",
      sidebar: "bg-[#ebdcb9]/80 border-r border-[#2D1B10]/15",
      header: "bg-[#e2d2af]/85 border-b border-[#2D1B10]/10",
      searchBg: "bg-[#fcf5e8] border-[#2D1B10]/20 text-[#2D1B10] focus:ring-[#7B1113]",
      btnActive: "bg-[#7B1113] text-stone-50 shadow-md",
      btnInactive: "bg-[#f4e6cc] text-[#2D1B10] border-[#2D1B10]/10 hover:bg-[#ebd7b4]"
    },
    dark: {
      bg: "bg-[radial-gradient(circle_at_center,#27272a_0%,#18181b_70%,#09090b_100%)]",
      overlay: "opacity-[0.04] mix-blend-[#E7E5E4]",
      card: "bg-zinc-900/90 border-zinc-800 shadow-lg",
      textMain: "text-zinc-200",
      textMuted: "text-zinc-400",
      accent: "text-amber-500",
      sidebar: "bg-zinc-900/95 border-r border-zinc-800",
      header: "bg-zinc-950/90 border-b border-zinc-800",
      searchBg: "bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-amber-500",
      btnActive: "bg-[#D97706] text-stone-950 shadow-md",
      btnInactive: "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
    },
    royal: {
      bg: "bg-[radial-gradient(circle_at_center,#3b0c13_0%,#2d050a_70%,#1b0004_100%)]",
      overlay: "opacity-[0.05] mix-blend-color-burn",
      card: "bg-[#33080e]/95 border-[#aa1523]/30 shadow-lg",
      textMain: "text-[#EDE2E5]",
      textMuted: "text-[#EDE2E5]/75",
      accent: "text-[#D97706]",
      sidebar: "bg-[#250307]/95 border-r border-[#50000a]",
      header: "bg-[#1b0004]/95 border-b border-[#50000a]",
      searchBg: "bg-[#200205] border-[#aa1523]/30 text-[#EDE2E5] focus:ring-amber-500",
      btnActive: "bg-[#D97706] text-black shadow-md",
      btnInactive: "bg-[#420a10] text-[#EDE2E5] border-[#aa1523]/25 hover:bg-[#520d15]"
    }
  }[theme];

  return (
    <div id="manuscript_root" className={`relative flex flex-col h-screen w-full select-none font-sans-geo ${themeClasses.bg} text-stone-900 transition-colors duration-500 overflow-hidden`}>
      {/* Texture Background Overlay for Parchment look */}
      <div 
        id="manuscript_canvas_overlay"
        className={`absolute inset-0 pointer-events-none z-0 bg-repeat bg-[url('https://www.transparenttextures.com/patterns/p6.png')] ${themeClasses.overlay}`}
      />

      {/* Responsive mobile header bar */}
      <header id="manuscript_header" className={`relative z-30 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-md ${themeClasses.header} transition-all border-b border-black/5`}>
        {/* Left Elements Spacer / Mobile Toggle */}
        <div className="flex items-center w-10 lg:w-0">
          <button
            id="menu_toggle_btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors lg:hidden"
            title="სარჩევის გახსნა"
          >
            {isSidebarOpen ? <X size={20} className={themeClasses.textMain} /> : <Menu size={20} className={themeClasses.textMain} />}
          </button>
        </div>
          
        {/* Centered Title & Creator with Aphorism */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif-geo text-2xl sm:text-4.5xl font-extrabold tracking-widest text-[#5C1D24] drop-shadow-xs">
            ვეფხისტყაოსანი
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 mt-1 font-sans-geo text-xs sm:text-[13px]">
            <span className="font-bold text-stone-850">შოთა რუსთაველი</span>
            <span className="hidden sm:inline text-stone-400 select-none">|</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={aphorismIndex}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.4 }}
                className="text-[#a11c1e] font-serif-geo italic font-semibold px-2.5 py-0.5 bg-[#a11c1e]/5 rounded-md border border-[#a11c1e]/15 shadow-2xs text-center"
              >
                {APHORISMS[aphorismIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Spacer for perfect balance */}
        <div className="w-10 lg:w-0 flex items-center justify-end" />
      </header>

      {/* Main Workspace Grid Pane */}
      <div id="manuscript_workspace" className="flex flex-1 relative overflow-hidden z-10">
        
        {/* Sidebar Container */}
        <aside
          id="manuscript_sidebar"
          className={`hidden lg:flex lg:relative top-0 bottom-0 left-0 w-52 flex-col backdrop-blur-md
            ${themeClasses.sidebar}`}
        >
          {/* Section banner */}
          <div className="p-3 border-b border-black/5 flex items-center justify-between bg-black/5">
            <span className={`text-xs uppercase tracking-widest font-bold ${themeClasses.textMuted} font-mono flex items-center gap-1.5`}>
              <Compass size={14} className={themeClasses.accent} />
              სარჩევი-თავები
            </span>
          </div>

          {/* Chapters Navigation List */}
          <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <ul className="flex flex-col gap-1">
              {CHAPTERS.map((chapter) => (
                <ClawMenuItem
                  key={chapter.id}
                  chapter={chapter}
                  active={activeChapterId === chapter.id}
                  onSelect={() => handleChapterSelect(chapter.id)}
                />
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content Viewer Main viewport */}
        <main id="manuscript_main_view" className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Active section header */}
          <div 
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="px-6 py-2.5 border-b border-black/5 backdrop-blur-xs z-15 flex items-center justify-between cursor-pointer lg:cursor-default hover:bg-black/5 lg:hover:bg-transparent transition-all select-none"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} className={themeClasses.accent} />
              <h2 className={`font-serif-geo text-sm font-bold text-stone-800 ${themeClasses.accent} flex items-center gap-1.5`}>
                {currentChapter.title}
                <ChevronDown 
                  size={14} 
                  className={`lg:hidden transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : ""}`} 
                />
              </h2>
            </div>
            
            <span className="lg:hidden text-[10px] font-sans-geo font-bold uppercase tracking-wider text-[#a11c1e] bg-[#a11c1e]/5 px-2 py-0.5 rounded-md border border-[#a11c1e]/10">
              {isSidebarOpen ? "დახურვა" : "სარჩევი ▾"}
            </span>
          </div>

          {/* Mobile Collapsible Chapters Menu Dropdown */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden w-full border-b border-stone-800/15 overflow-hidden bg-[#ebdcb9] text-stone-900 shadow-xl z-20 max-h-[50vh] overflow-y-auto"
              >
                <div className="p-3 flex flex-col gap-1 pr-3 custom-scrollbar">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#a11c1e] font-extrabold px-1 py-1 mb-1 border-b border-black/5">
                    აირჩიეთ თავი:
                  </div>
                  {CHAPTERS.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                      className={`w-full text-left py-2 px-3 rounded-lg border transition-all duration-200 flex flex-col items-start gap-1 
                        ${activeChapterId === chapter.id 
                          ? "bg-[#7B1113]/10 text-[#7B1113] border-[#7B1113]/25 font-bold" 
                          : "bg-transparent text-stone-850 border-transparent hover:bg-stone-800/5"
                        }`}
                    >
                      <span className="font-serif-geo text-[13px] leading-tight">{chapter.title}</span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-600 font-mono">
                        {chapter.rangeText}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Backdrop to close menu when active */}
          {isSidebarOpen && (
            <div 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] z-10 lg:hidden"
            />
          )}

          {/* Stanzas cards side-by-side grouped view mode */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3.5 custom-scrollbar space-y-4">
            <div className="max-w-full mx-auto w-full px-1 lg:px-2.5 space-y-5">
              <AnimatePresence mode="popLayout">
                {currentChapter.stanzas.map((stanza) => (
                  <motion.div
                    key={`card-${stanza.id}`}
                    layoutId={`card-${stanza.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-2xl border p-3.5 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5 lg:gap-8 hover:shadow-lg transition-all duration-300 ${themeClasses.card}`}
                  >
                    {/* Original Section */}
                    <div className={`flex-1 space-y-3 relative ${showParaphraseMap[stanza.id] ? "hidden lg:block" : "block"}`}>
                      <div className="flex items-center justify-between select-none">
                        <span className="text-xs font-mono font-bold bg-red-700/10 text-red-900 px-2.5 py-0.5 rounded-md">
                          {stanza.id}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowParaphraseMap((prev) => ({ ...prev, [stanza.id]: true }));
                          }}
                          className="lg:hidden text-[11px] px-3 py-1 rounded-lg font-sans-geo font-bold shadow-xs transition-all duration-300 bg-[#a11c1e] text-stone-50 hover:bg-[#a11c1e]/90 flex items-center gap-1 border border-[#a11c1e]/20"
                        >
                          შინაარსი 📖
                        </button>
                      </div>
                      
                      <div 
                        className="font-serif-geo space-y-2.5 text-[10px] sm:text-[12px] md:text-[14px]"
                        style={{ lineHeight: "2.1" }}
                      >
                        {stanza.originalLines.map((line, lIdx) => (
                          <div key={lIdx} className="block relative pl-1 whitespace-normal text-stone-900 break-words leading-relaxed lg:leading-[2.1]">
                            {line.map((token, tIdx) => {
                              if (lIdx === 0 && tIdx === 0) {
                                const firstChar = token.text.charAt(0);
                                const restText = token.text.slice(1);
                                const slicedToken = { ...token, text: restText };
                                return (
                                  <span key={tIdx} className="inline">
                                    <span className="text-[#a11c1e] font-extrabold select-none inline font-serif-geo">
                                      {firstChar}
                                    </span>
                                    <WordTip token={slicedToken} />
                                  </span>
                                );
                              }
                              return <WordTip key={tIdx} token={token} />;
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Split line divider */}
                    <div className="hidden lg:block w-px bg-stone-500/10 self-stretch" />

                    {/* Paraphrase Section */}
                    <div className={`flex-1 space-y-3 relative ${showParaphraseMap[stanza.id] ? "block" : "hidden lg:block"}`}>
                      {/* Empty alignment spacer to align with the left stanza number badge */}
                      <div className="h-6 flex items-center justify-between select-none">
                        <span className="lg:hidden text-xs font-mono font-bold bg-stone-500/15 text-stone-700 px-2.5 py-0.5 rounded-md">
                          {stanza.id}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowParaphraseMap((prev) => ({ ...prev, [stanza.id]: false }));
                          }}
                          className="lg:hidden text-[11px] px-3 py-1 rounded-lg font-sans-geo font-bold shadow-xs transition-all duration-300 bg-stone-500/15 hover:bg-stone-500/25 text-stone-850 border border-stone-500/20"
                        >
                          კუპლეტი ↩
                        </button>
                      </div>

                      <div 
                        className="font-sans-geo font-light italic space-y-2.5 text-[9.5px] sm:text-[11px] md:text-[13px]"
                        style={{ lineHeight: "2.0", color: theme === "parchment" ? "#5a4033" : undefined }}
                      >
                        {stanza.paraphraseLines.map((line, lIdx) => (
                          <div key={lIdx} className="block leading-relaxed whitespace-normal break-words">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
