


"use client";

import React, { useState, useEffect, useRef, ReactNode, FC, ChangeEvent, MouseEvent, FormEvent } from 'react';
import {
  Leaf,
  WifiHigh,
  WifiLow,
  Upload,
  FileText,
  Send,
  Sprout,
  ThermometerSun,
  Activity,
  Menu,
  Cpu,
  Newspaper,
  Settings,
  MapPin,
  Globe,
  FlaskConical,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Languages,
  CloudSun,
  Wind,
  Droplets,
  CalendarDays,
  Bell,
  User,
  Search,
  ChevronDown,
} from 'lucide-react';

// Import FarmLoader from components folder
import FarmLoader from './components/FarmLoader';

// --- API Configuration ---
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// --- Initial Static Data ---

interface Language {
  code: string;
  name: string;
  native: string;
}

interface Translations {
  [lang: string]: {
    title: string;
    subtitle: string;
    dashboard: string;
    soil_analysis: string;
    agri_news: string;
    ai_chatbot: string;
    settings: string;
    good_afternoon: string;
    weather_desc: string;
    analyze_card: string;
    analyze_desc: string;
    ask_card: string;
    ask_desc: string;
    news_card: string;
    news_desc: string;
    soil_decoder: string;
    upload_prompt: string;
    upload_sub: string;
    select_report: string;
    analyzing: string;
    analysis_result: string;
    ph_level: string;
    nitrogen: string;
    what_means: string;
    action: string;
    crops: string;
    news_header: string;
    news_sub: string;
    urgent: string;
    source: string;
    chat_placeholder: string;
    chat_placeholder_low: string;
    settings_header: string;
    location_label: string;
    lang_label: string;
    proto_label: string;
    detect_loc: string;
    bandwidth_sim: string;
    network_mode: string;
    read_more: string;
    fetch_error: string;
    translating: string;
    switch_lang: string;
    local_news: string;
    national_news: string;
    loading_weather: string;
    loading_news: string;
    locating: string;
  };
}

// Removing duplicate declarations of SUPPORTED_LANGUAGES and INITIAL_TRANSLATIONS at line ~183

// Keep only top-level declarations once, remove duplicates below or above this section that duplicate these constants

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
];

const INITIAL_TRANSLATIONS = {
  en: {
    title: "Kisan",
    subtitle: "Intelligent Advisory",
    dashboard: "Dashboard",
    soil_analysis: "Soil Analysis",
    agri_news: "Agri News",
    ai_chatbot: "AI Chatbot",
    settings: "Settings",
    good_afternoon: "Dashboard", // Changed to match image header
    weather_desc: "Weekly Field Forecast",
    analyze_card: "Analyze Soil",
    analyze_desc: "Search ever, asssres in your moroniale rods.", // Keeping generic filler from prompt or original
    ask_card: "Ask AI Assistant",
    ask_desc: "Useior suoret agricultures brain-chip.",
    news_card: "Latest Updates",
    news_desc: "New Updates from onr event novemberdatorpralies.",
    soil_decoder: "Soil Health Decoder",
    upload_prompt: "Upload Soil Test Report",
    upload_sub: "Take a photo of your lab report or upload PDF",
    select_report: "Select Report",
    analyzing: "Reading technical data...",
    analysis_result: "Analysis Result",
    ph_level: "pH Level",
    nitrogen: "Nitrogen",
    what_means: "What this means:",
    action: "Recommended Action:",
    crops: "Best Crops:",
    news_header: "Live Agri-News",
    news_sub: "Updates for",
    urgent: "FRESH",
    source: "Source",
    chat_placeholder: "Ask about your crops...",
    chat_placeholder_low: "ENTER_KEYWORDS...",
    settings_header: "Platform Settings",
    location_label: "Farm Location",
    lang_label: "Language",
    proto_label: "Prototype Tools",
    detect_loc: "Detect Location",
    bandwidth_sim: "Bandwidth Simulation",
    network_mode: "Interface Mode",
    read_more: "Read Full Story",
    fetch_error: "Could not fetch live news. Showing cached data.",
    translating: "Translating Interface...",
    switch_lang: "Switch Language",
    local_news: "Local News",
    national_news: "National News",
    loading_weather: "Forecasting...",
    loading_news: "Harvesting Headlines...",
    locating: "Locating Farm...",
  },
};

// --- Helper: Gemini API for Translation ---
const translateContent = async (textObj, targetLang) => {
  if (targetLang === 'en') return textObj;
  try {
    const prompt = `
      You are a translator for an agricultural app.
      Translate the values of the following JSON object into ${targetLang} language.
      Keep the keys exactly the same. Return ONLY the valid JSON.
      Source JSON:
      ${JSON.stringify(textObj)}
    `;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch =
      resultText.match(/```json\n([\s\S]*?)\n```/) || resultText.match(/```\n([\s\S]*?)\n```/);
    const cleanJson = jsonMatch ? jsonMatch[1] : resultText;
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Translation failed:', error);
    return null;
  }
};

// --- Styles for Animations ---
const animationStyles = `
  @keyframes drive {
    0% { transform: translateX(-60px); }
    100% { transform: translateX(200px); }
  }
  .animate-tractor-drive {
    animation: drive 2.5s linear infinite;
  }
  @keyframes spray {
    0% { opacity: 1; transform: translate(0, 0); }
    100% { opacity: 0; transform: translate(-10px, -10px); }
  }
  .animate-dirt-spray {
    animation: spray 0.5s ease-out infinite;
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  .glass-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  }
  .glass-sidebar {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

// --- Components ---

export default function App() {
  // Global State
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [location, setLocation] = useState('Gurugram, Haryana, India');
  const [bandwidthMode, setBandwidthMode] = useState('high'); 
  const [networkSpeed, setNetworkSpeed] = useState(10); 
  const [manualThrottle, setManualThrottle] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = translations[lang] || translations['en'];

  const handleLanguageChange = async (newLangCode) => {
    if (newLangCode === lang) return;
    if (translations[newLangCode]) {
      setLang(newLangCode);
      return;
    }
    setIsTranslating(true);
    const newTranslations = await translateContent(translations['en'], SUPPORTED_LANGUAGES.find(l => l.code === newLangCode).name);
    if (newTranslations) {
      setTranslations(prev => ({ ...prev, [newLangCode]: newTranslations }));
      setLang(newLangCode);
    } else {
      alert("Translation failed. Please check connection.");
    }
    setIsTranslating(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!manualThrottle) {
        setNetworkSpeed(prev => {
          const noise = (Math.random() - 0.5) * 0.5;
          return parseFloat(Math.max(0.1, prev + noise).toFixed(1));
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [manualThrottle]);

  useEffect(() => {
    if (networkSpeed < 2.0) {
      if (bandwidthMode !== 'low') setBandwidthMode('low');
    } else {
      if (bandwidthMode !== 'high') setBandwidthMode('high');
    }
  }, [networkSpeed]);

  const theme = {
    high: {
      bg: "bg-cover bg-center bg-no-repeat bg-fixed",
      bgImage: "url('https://i.postimg.cc/260qfNq8/48d67b4c-e842-4935-901b-b68db4568a67.png')",
      text: "text-slate-800",
      card: "glass-card rounded-3xl",
      sidebar: "glass-sidebar",
      primary: "bg-emerald-600/90 text-white hover:bg-emerald-700",
      accent: "text-emerald-800",
      border: "border-white/30",
      input: "bg-white/50 border-white/40 focus:ring-emerald-500 backdrop-blur-sm",
      font: "font-sans",
      navHover: "hover:bg-white/20 hover:scale-105",
      navActive: "bg-white/30 shadow-sm scale-105 text-emerald-900",
      button: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl"
    },
    low: {
      bg: "bg-black",
      bgImage: "none",
      text: "text-green-500",
      card: "bg-black border border-green-800 rounded-none",
      sidebar: "bg-black border-r border-green-900",
      primary: "bg-green-900 text-green-100 border border-green-500 hover:bg-green-800",
      accent: "text-green-400",
      border: "border-green-800",
      input: "bg-black border-green-700 text-green-400 focus:border-green-400 font-mono",
      font: "font-mono",
      navHover: "hover:bg-green-900",
      navActive: "bg-green-900 text-green-100 border border-green-500",
      button: "bg-green-900 border border-green-500 text-green-400 hover:bg-green-800"
    }
  }[bandwidthMode];

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-500 ${theme.font} ${theme.text} ${bandwidthMode === 'low' ? theme.bg : ''}`}
      style={bandwidthMode === 'high' ? { backgroundImage: theme.bgImage, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <style>{animationStyles}</style>
      
      {/* --- SIDEBAR (Left Navigation) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-20 flex flex-col items-center py-6 gap-8 transition-transform duration-300
        ${bandwidthMode === 'high' ? 'glass-sidebar' : 'bg-black border-r border-green-900'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className={`p-3 rounded-xl mb-4 ${bandwidthMode === 'high' ? 'bg-white/40 text-emerald-800' : 'bg-green-900 text-green-400'}`}>
          <Leaf size={28} strokeWidth={2.5} />
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-6 w-full px-2">
          <NavIcon icon={<Activity />} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} theme={theme} />
          <NavIcon icon={<Sprout />} label={t.soil_analysis} active={activeTab === 'soil'} onClick={() => setActiveTab('soil')} theme={theme} />
          <NavIcon icon={<Newspaper />} label={t.agri_news} active={activeTab === 'news'} onClick={() => setActiveTab('news')} theme={theme} />
          <NavIcon icon={<Cpu />} label={t.ai_chatbot} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} theme={theme} />
          <NavIcon icon={<Settings />} label={t.settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} theme={theme} />
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-6">
           <button className={`p-2 rounded-lg transition-colors opacity-70 hover:opacity-100 ${theme.text}`}>
             <ExternalLink size={24} />
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="lg:pl-20 flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header Toggle */}
        <div className="lg:hidden p-4 flex items-center justify-between backdrop-blur-md bg-white/10 z-40">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={theme.text}><Menu/></button>
           <span className="font-bold">AgriSmart</span>
        </div>

        {/* Top Header Row (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 z-30">
          <h1 className={`text-3xl font-bold tracking-tight ${bandwidthMode === 'high' ? 'text-slate-900' : 'text-green-500'}`}>
            {t.good_afternoon}
          </h1>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-semibold">
               <CalendarDays size={14}/>
               <span>Oct 24, 2025</span>
             </div>
             
             <div className="relative">
               <Bell size={20} className="opacity-80"/>
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </div>

             <div className="flex items-center gap-2 cursor-pointer group">
               <div className="w-8 h-8 rounded-full bg-emerald-200 overflow-hidden border-2 border-white/50">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
               </div>
               <ChevronDown size={16} className="opacity-60 group-hover:opacity-100"/>
             </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-0 z-10 scrollbar-hide">
          
          {/* Global Loading Overlay for Translation */}
          {isTranslating && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className={`p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in ${bandwidthMode === 'high' ? 'bg-white' : 'bg-black border border-green-500'}`}>
                <FarmLoader text={t.translating || "TRANSLATING..."} mode={bandwidthMode} />
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard theme={theme} setTab={setActiveTab} t={t} location={location} bandwidthMode={bandwidthMode} />}
          {activeTab === 'soil' && <SoilAnalyzer theme={theme} t={t} bandwidthMode={bandwidthMode} />}
          {activeTab === 'news' && <NewsPortal theme={theme} t={t} lang={lang} location={location} bandwidthMode={bandwidthMode} />}
          {activeTab === 'chat' && <ChatInterface theme={theme} mode={bandwidthMode} t={t} lang={lang} />}
          {activeTab === 'settings' && (
            <SettingsPanel 
              theme={theme} 
              t={t} 
              lang={lang} 
              changeLang={handleLanguageChange} 
              location={location}
              setLocation={setLocation}
              bandwidthMode={bandwidthMode}
              networkSpeed={networkSpeed}
              setNetworkSpeed={setNetworkSpeed}
              setManualThrottle={setManualThrottle}
            />
          )}

        </main>
      </div>
    </div>
  );
}

// --- Sub Components ---

function NavIcon({ icon, label, active, onClick, theme }) {
  // Only showing icon for the slim sidebar look
  return (
    <div className="group relative flex items-center justify-center w-full">
      <button 
        onClick={onClick} 
        className={`
          p-3 rounded-xl transition-all duration-300 relative z-10
          ${active ? theme.navActive : `${theme.navHover} opacity-70 hover:opacity-100`}
        `}
      >
        {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
      </button>
      {/* Tooltip for slim sidebar */}
      <span className={`
        absolute left-14 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        ${theme.font === 'font-sans' ? 'bg-white/80 backdrop-blur-sm text-slate-800 shadow-sm' : 'bg-green-900 text-green-100 border border-green-500'}
      `}>
        {label}
      </span>
    </div>
  );
}

function Dashboard({ theme, setTab, t, location, bandwidthMode }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-4">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard 
          theme={theme} 
          icon={<Leaf className="text-emerald-500" size={32} />} 
          title={t.analyze_card} 
          desc={t.analyze_desc} 
          onClick={() => setTab('soil')} 
          glowColor="group-hover:shadow-emerald-500/20"
        />
        <GlassCard 
          theme={theme} 
          icon={<Cpu className="text-blue-500" size={32} />} 
          title={t.ask_card} 
          desc={t.ask_desc} 
          onClick={() => setTab('chat')} 
          glowColor="group-hover:shadow-blue-500/20"
        />
        <GlassCard 
          theme={theme} 
          icon={<Newspaper className="text-purple-500" size={32} />} 
          title={t.news_card} 
          desc={t.news_desc} 
          onClick={() => setTab('news')} 
          glowColor="group-hover:shadow-purple-500/20"
        />
      </div>

      {/* Weather Section - Unified Glass Container */}
      <WeatherWidget theme={theme} location={location} bandwidthMode={bandwidthMode} t={t} />
    </div>
  );
}

function WeatherWidget({ theme, location, bandwidthMode, t }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        let latitude, longitude, name, admin1;
        let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
        let geoRes = await fetch(geoUrl);
        let geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
           const simpleLocation = location.split(',')[0].trim();
           if (simpleLocation !== location) {
             geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(simpleLocation)}&count=1&language=en&format=json`;
             geoRes = await fetch(geoUrl);
             geoData = await geoRes.json();
           }
        }

        if (geoData.results && geoData.results.length > 0) {
          ({ latitude, longitude, name, admin1 } = geoData.results[0]);
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto`;
          const weatherRes = await fetch(weatherUrl);
          const weatherData = await weatherRes.json();

          if (weatherData.daily) {
             const daily = weatherData.daily.time.map((t, i) => ({
                date: new Date(t),
                dayName: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
                max: Math.round(weatherData.daily.temperature_2m_max[i]),
                min: Math.round(weatherData.daily.temperature_2m_min[i]),
                precip: weatherData.daily.precipitation_probability_max[i],
                wind: weatherData.daily.windspeed_10m_max[i],
                code: weatherData.daily.weathercode[i]
             }));

             setWeather({
               current: daily[0],
               forecast: daily.slice(1, 5), // Keep it to 4 days for the design
               city: name,
               region: admin1
             });
          }
        } else {
          setWeather(null); 
        }
      } catch (e) {
        console.error("Weather fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  const getWeatherDetails = (code, size = 24) => {
    if (code <= 1) return { icon: <ThermometerSun size={size} className="text-amber-400" />, text: "Sunny" };
    if (code <= 3) return { icon: <CloudSun size={size} className="text-yellow-400" />, text: "Cloudy" };
    if (code <= 48) return { icon: <Wind size={size} className="text-slate-400" />, text: "Foggy" };
    if (code <= 82) return { icon: <Droplets size={size} className="text-blue-400" />, text: "Rainy" };
    return { icon: <CloudSun size={size} className="text-slate-500" />, text: "Overcast" }; 
  };

  if (loading) {
    return (
      <div className={`p-6 ${theme.card} flex items-center justify-center h-64 w-full`}>
        <FarmLoader text={t?.loading_weather || "FORECASTING..."} mode={bandwidthMode} />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={`p-6 ${theme.card} flex flex-col items-center justify-center h-48 text-center`}>
        <AlertTriangle className="mb-2 opacity-50" />
        <div className="opacity-70">Weather data unavailable for "{location}"</div>
      </div>
    );
  }

  // Low Bandwidth Mode (unchanged logic, just style)
  if (bandwidthMode === 'low') {
    return (
      <div className={`p-4 ${theme.card} font-mono text-sm`}>
        <div className="mb-2 border-b border-green-800 pb-2">
          <h3 className="font-bold">WEATHER_REPORT: {weather.city.toUpperCase()}</h3>
          <p className="opacity-70">TODAY: {weather.current.max}/{weather.current.min}C | {getWeatherDetails(weather.current.code).text.toUpperCase()}</p>
        </div>
        <div className="space-y-1">
           {weather.forecast.map((day, idx) => (
             <div key={idx} className="flex justify-between">
               <span>{day.dayName.toUpperCase()}</span>
               <span>{day.max}/{day.min}C</span>
               <span>{getWeatherDetails(day.code).text.toUpperCase()}</span>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // High Bandwidth Mode - New Glass Layout
  const todayDetails = getWeatherDetails(weather.current.code, 64);

  return (
    <div className={`${theme.card} p-0 flex flex-col lg:flex-row overflow-hidden`}>
      {/* Left: Today's Big Card */}
      <div className="lg:w-1/3 p-6 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col justify-between min-h-[220px]">
         <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Today</h3>
              <p className="text-sm opacity-60 font-medium">{weather.city}</p>
            </div>
            <div className="animate-pulse">{todayDetails.icon}</div>
         </div>
         
         <div className="mt-4">
           <div className="text-5xl font-bold text-slate-800 tracking-tighter">{weather.current.max}°C</div>
           <p className="text-sm font-medium opacity-60 mt-1">{todayDetails.text}</p>
         </div>

         <div className="flex gap-4 mt-4 text-xs font-semibold opacity-70">
            <span className="bg-white/30 px-2 py-1 rounded-md">Wind: {weather.current.wind}km/h</span>
            <span className="bg-white/30 px-2 py-1 rounded-md">Rain: {weather.current.precip}%</span>
         </div>
      </div>

      {/* Right: Forecast Row */}
      <div className="lg:w-2/3 p-6 flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-4 h-full">
           {weather.forecast.map((day, idx) => {
             const details = getWeatherDetails(day.code, 28);
             return (
               <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/20 hover:bg-white/40 transition-colors border border-white/20 gap-2">
                 <span className="text-sm font-bold opacity-70">{day.dayName}</span>
                 <div className="my-1">{details.icon}</div>
                 <span className="text-lg font-bold text-slate-800">{day.max}°C</span>
                 <span className="text-xs opacity-50">{day.min}°</span>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}

function GlassCard({ theme, icon, title, desc, onClick, glowColor }) {
  if (theme.font === 'font-mono') {
     // Fallback for LOW bandwidth mode
     return (
      <button onClick={onClick} className={`p-6 text-left transition-transform hover:-translate-y-1 ${theme.card} group w-full`}>
        <div className={`mb-4 text-green-400`}>{icon}</div>
        <h3 className="text-lg font-bold mb-1 group-hover:underline">{title}</h3>
        <p className="text-sm opacity-70">{desc}</p>
      </button>
     );
  }

  // High Bandwidth Glass Card
  return (
    <button onClick={onClick} className={`
      ${theme.card} p-6 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300
      ${glowColor} hover:shadow-lg
    `}>
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-white/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{desc}</p>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </button>
  );
}

function SettingsPanel({ theme, t, lang, changeLang, location, setLocation, bandwidthMode, networkSpeed, setNetworkSpeed, setManualThrottle }) {
  const [detecting, setDetecting] = useState(false);

  const detectLocationByIP = async () => {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      if (data.city && data.country) {
        const region = data.region ? `, ${data.region}` : '';
        setLocation(`${data.city}${region}, ${data.country}`);
      } else {
        throw new Error("IP Location incomplete");
      }
    } catch (e) {
      alert("Could not detect location.");
    } finally {
      setDetecting(false);
    }
  };

  const handleAutoDetect = () => {
    setDetecting(true);
    if (!navigator.geolocation) { detectLocationByIP(); return; }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const formatted = [addr.city || addr.town, addr.state, addr.country].filter(Boolean).join(', ');
          setLocation(formatted);
          setDetecting(false);
        } else {
          throw new Error("Address not found");
        }
      } catch (error) {
        detectLocationByIP();
      }
    }, () => detectLocationByIP(), { timeout: 8000 });
  };

  const handleSpeedChange = (e) => {
    const val = parseFloat(e.target.value);
    setNetworkSpeed(val);
    setManualThrottle(true); 
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-6">
      <h2 className={`text-2xl font-bold flex items-center gap-3 ${theme.font === 'font-mono' ? 'text-green-500' : 'text-slate-800'}`}><Settings /> {t.settings_header}</h2>
      <div className={`p-8 ${theme.card} space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 opacity-80"><Globe size={16}/> {t.lang_label}</label>
            <div className="relative">
              <select value={lang} onChange={(e) => changeLang(e.target.value)} className={`w-full p-3 rounded-xl outline-none appearance-none ${theme.input} ${theme.font === 'font-mono' ? 'border' : ''}`}>
                {SUPPORTED_LANGUAGES.map(l => (<option key={l.code} value={l.code}>{l.native} ({l.name})</option>))}
              </select>
              <Languages className="absolute right-3 top-3.5 opacity-50 pointer-events-none" size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 opacity-80"><MapPin size={16}/> {t.location_label}</label>
            <div className="flex gap-2">
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={`flex-1 p-3 rounded-xl outline-none ${theme.input} ${theme.font === 'font-mono' ? 'border' : ''}`} placeholder="City, State" />
              <button className={`p-3 rounded-xl transition-colors ${theme.font === 'font-sans' ? 'bg-white/50 hover:bg-white' : 'border border-green-600 hover:bg-green-900'}`} title={t.detect_loc} onClick={handleAutoDetect} disabled={detecting}>
                {detecting ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className={`border-t my-4 ${theme.font === 'font-sans' ? 'border-white/30' : 'border-green-900'}`}></div>
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2 text-orange-500"><FlaskConical size={20} /> {t.proto_label}</h3>
          {detecting && <FarmLoader text={t?.locating || "LOCATING..."} mode={bandwidthMode} />}
          {!detecting && (
            <div className={`p-4 rounded-xl space-y-4 ${theme.font === 'font-sans' ? 'bg-orange-50/50 border border-orange-100' : 'border border-orange-900'}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.network_mode} (Auto)</span>
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${bandwidthMode === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-green-900 text-green-100 border border-green-500'}`}>
                  {bandwidthMode === 'high' ? 'RICH UI' : 'WIRENET (LOW)'}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t.bandwidth_sim} (Throttle)</span>
                  <span className="font-mono">{networkSpeed} Mbps</span>
                </div>
                <input type="range" min="0.1" max="10" step="0.1" value={networkSpeed} onChange={handleSpeedChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <div className="flex justify-between text-xs opacity-50 mt-1">
                    <span>0.1 Mbps (Force WireNet)</span>
                    <span>2.0 Mbps (Threshold)</span>
                    <span>10 Mbps (Max)</span>
                </div>
              </div>
              <p className="text-xs text-orange-600/80">* Reducing speed below 2.0 Mbps will automatically trigger WireNet mode to save data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SoilAnalyzer({ theme, t, bandwidthMode }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        ph: 5.2,
        nitrogen: "Low",
        summary: "Acidic Soil Detected",
        meaning: "Your soil is sour (Acidic). Nutrients like phosphorus are locked up.",
        action: "Apply agricultural lime (chuna) to neutralize acidity.",
        crops: ["Potatoes", "Blueberries", "Oats"]
      });
    }, 3000); 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-6">
      <h2 className={`text-2xl font-bold flex items-center gap-3 ${theme.font === 'font-mono' ? 'text-green-500' : 'text-slate-800'}`}><Sprout /> {t.soil_decoder}</h2>
      {!result ? (
        <div className={`p-12 border-2 border-dashed rounded-3xl text-center space-y-4 ${theme.font === 'font-sans' ? 'border-white/40 bg-white/20 backdrop-blur-sm' : 'border-green-700 bg-black'}`}>
          {analyzing ? (
             <FarmLoader text={t.analyzing} mode={bandwidthMode} />
          ) : (
            <>
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-800"><Upload size={32} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{t.upload_prompt}</h3>
                <p className="opacity-60 text-sm mt-1 text-slate-700">{t.upload_sub}</p>
              </div>
              <button onClick={handleUpload} className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${theme.primary}`}>{t.select_report}</button>
            </>
          )}
        </div>
      ) : (
        <div className={`p-8 ${theme.card} space-y-6 animate-in fade-in slide-in-from-bottom-4`}>
          <div className="flex justify-between items-start">
            <div><h3 className="text-xl font-bold mb-1">{t.analysis_result}</h3></div>
            <button onClick={() => setResult(null)} className="text-sm underline opacity-70 hover:opacity-100">Reset</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricBox label={t.ph_level} value={result.ph} status="Acidic (Bad)" theme={theme} />
            <MetricBox label={t.nitrogen} value={result.nitrogen} status="Needs Boost" theme={theme} />
          </div>
          <div className={`p-6 rounded-xl ${theme.font === 'font-sans' ? 'bg-white/40 border border-white/30' : 'border border-green-600'}`}>
            <h4 className="font-bold mb-2 flex items-center gap-2"><Leaf size={16}/> {t.what_means}</h4>
            <p className="mb-4">{result.meaning}</p>
            <h4 className="font-bold mb-2 flex items-center gap-2"><Activity size={16}/> {t.action}</h4>
            <p className="mb-4">{result.action}</p>
            <h4 className="font-bold mb-2">{t.crops}</h4>
            <div className="flex flex-wrap gap-2">
              {result.crops.map(crop => (<span key={crop} className={`text-xs px-2 py-1 rounded-md font-medium ${theme.font === 'font-sans' ? 'bg-white/60 shadow-sm text-slate-800' : 'border border-green-500'}`}>{crop}</span>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, status, theme }) {
  return (
    <div className={`p-4 rounded-xl border ${theme.font === 'font-sans' ? 'bg-white/30 border-white/20' : 'bg-black border-green-800'}`}>
      <div className="text-xs opacity-60 font-semibold">{label}</div>
      <div className="text-2xl font-bold my-1">{value}</div>
      <div className={`text-xs font-bold ${theme.font === 'font-sans' ? 'text-red-600' : 'text-green-600'}`}>{status}</div>
    </div>
  );
}

function NewsPortal({ theme, t, lang, location, bandwidthMode }) {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState('local');

  const fetchNews = async () => {
    setLoading(true);
    let queryTerm = scope === 'national' ? 'India agriculture farming' : `${location} agriculture farming`;
    const locQuery = encodeURIComponent(queryTerm);
    const newsLangMap = { 'hi': 'hi', 'mr': 'mr', 'ta': 'ta', 'te': 'te', 'ml': 'ml', 'kn': 'kn', 'en': 'en-IN' };
    const hl = newsLangMap[lang] || 'en-IN';
    const rssUrl = `https://news.google.com/rss/search?q=${locQuery}&hl=${hl}&gl=IN&ceid=IN:${hl}`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      if (data.status === 'ok') {
        const processed = data.items.slice(0, 6).map((item, idx) => ({
          id: idx,
          title: item.title,
          summary: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 'No summary available.',
          date: new Date(item.pubDate).toLocaleDateString(),
          link: item.link,
          source: item.author || 'Google News',
          urgent: item.title.toLowerCase().includes('warning')
        }));
        setNewsData(processed);
      } else { throw new Error('API Error'); }
    } catch (err) {
      setNewsData([
        { id: 1, title: "Fallback: Government Announces New Irrigation Subsidy", summary: "Due to connection error, showing cached data.", date: "Today", urgent: false },
        { id: 2, title: "Fallback: Wheat Prices Stabilize in Mandis", summary: "Market trends show stability.", date: "Yesterday", urgent: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [lang, location, scope]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className={`text-2xl font-bold flex items-center gap-3 ${theme.font === 'font-mono' ? 'text-green-500' : 'text-slate-800'}`}><Newspaper /> {t.news_header}</h2><p className="text-sm opacity-60 ml-9 text-slate-700">{t.news_sub} ({scope === 'national' ? 'India' : location})</p></div>
        <div className="flex items-center gap-2">
           <div className={`flex p-1 rounded-xl text-xs font-bold ${theme.font === 'font-sans' ? 'bg-white/30' : 'border border-green-800'}`}>
              <button onClick={() => setScope('local')} className={`px-4 py-2 rounded-lg transition-all ${scope === 'local' ? (theme.font === 'font-sans' ? 'bg-white shadow text-emerald-700' : 'bg-green-800 text-white') : 'opacity-50'}`}>{t.local_news || "Local"}</button>
              <button onClick={() => setScope('national')} className={`px-4 py-2 rounded-lg transition-all ${scope === 'national' ? (theme.font === 'font-sans' ? 'bg-white shadow text-emerald-700' : 'bg-green-800 text-white') : 'opacity-50'}`}>{t.national_news || "National"}</button>
           </div>
          <button onClick={fetchNews} className={`p-2 rounded-full ${theme.font === 'font-sans' ? 'bg-white/40 hover:bg-white' : 'hover:bg-green-900'}`} title="Refresh"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>
      {loading ? (
        <div className={`h-96 flex items-center justify-center ${theme.card}`}>
          <FarmLoader text={t?.loading_news || "HARVESTING NEWS..."} mode={bandwidthMode} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
          {newsData.map(item => (
            <div key={item.id} className={`p-6 ${theme.card} transition-all hover:scale-[1.01] flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight text-slate-800">{item.title}</h3>
                  {item.urgent && <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-bold ${theme.font === 'font-sans' ? 'bg-red-100 text-red-700' : 'bg-red-900 text-red-200'}`}>{t.urgent}</span>}
                </div>
                {bandwidthMode === 'high' && <p className="opacity-80 text-sm leading-relaxed text-slate-700">{item.summary}</p>}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-slate-300">
                <div className="text-xs opacity-50 flex gap-4 font-semibold text-slate-600"><span>{item.source}</span><span>{item.date}</span></div>
                {bandwidthMode === 'high' ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className={`text-xs flex items-center gap-1 hover:underline font-bold ${theme.accent}`}>{t.read_more} <ExternalLink size={12} /></a>
                ) : (<span className="text-[10px] opacity-50">[TXT_ONLY]</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatInterface({ theme, mode, t, lang }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initialMsg = mode === 'high' ? "Namaste! I am your intelligent agriculture assistant. Ask me anything!" : "SYSTEM READY. ASK QUERY.";
    setMessages([{ id: 1, role: 'bot', text: initialMsg }]);
  }, [mode]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || 'English';
      const prompt = `You are an agricultural advisor. User Question: "${userMsg.text}" Constraints: 1. Reply in ${targetLangName} language. 2. If mode is 'low', keep reply extremely concise, keyword based, uppercase. 3. If mode is 'high', be conversational and helpful. 4. Mode is currently: '${mode}'. Reply with just the text.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Server Busy. Try again.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: "Error connecting to AI." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col mt-4">
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 rounded-t-3xl border-t border-x ${theme.font === 'font-sans' ? 'glass-panel border-white/20' : 'bg-black border-green-900'}`}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? (theme.font === 'font-sans' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-green-900 text-green-100 border border-green-500') : (theme.font === 'font-sans' ? 'bg-white/80 text-slate-800 rounded-bl-none' : 'bg-black border border-green-800 text-green-400')}`}>
              {msg.role === 'bot' && theme.font !== 'font-sans' && <span className="block text-xs font-bold mb-1 opacity-50">[AI-SLM-CORE]</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><div className={`p-3 text-xs ${theme.font === 'font-sans' ? 'text-slate-500' : 'text-green-600 animate-pulse'}`}>{mode === 'high' ? 'Agent is typing...' : '>> PROCESSING...'}</div></div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className={`p-4 rounded-b-3xl border-b border-x ${theme.font === 'font-sans' ? 'glass-panel border-white/20' : 'bg-black border-green-900'} flex gap-2`}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'high' ? t.chat_placeholder : t.chat_placeholder_low} className={`flex-1 p-4 rounded-xl outline-none border transition-colors ${theme.input} ${theme.font === 'font-mono' ? 'border-green-800' : ''}`} />
        <button type="submit" disabled={!input.trim()} className={`p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${theme.button}`}><Send size={24} /></button>
      </form>
    </div>
  );
}