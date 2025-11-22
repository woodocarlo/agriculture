interface FarmLoaderProps {
  text?: string;
  mode?: 'high' | 'low';
}

const FarmLoader: React.FC<FarmLoaderProps> = ({ text, mode = 'high' }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Ground Line */}
        <div className={`absolute bottom-2 w-full h-0.5 ${mode === 'high' ? 'bg-emerald-800/20' : 'bg-green-900'}`}></div>
        
        {/* Moving Tractor Group */}
        <div className="absolute bottom-2 animate-tractor-drive">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${mode === 'high' ? 'text-emerald-600' : 'text-green-500'}`}>
            <path d="M3 4h9l1 7h8l1 9h-16z" /> {/* Body */}
            <circle cx="7" cy="20" r="3" /> {/* Big Wheel */}
            <circle cx="19" cy="20" r="2" /> {/* Small Wheel */}
            <path d="M5 4v-2h4" /> {/* Exhaust */}
            <path d="M8 4h-5v7" />
          </svg>
          {/* Dirt Particles */}
          <div className="absolute -bottom-1 -left-2 flex gap-1 animate-dirt-spray">
            <div className={`w-1 h-1 rounded-full ${mode === 'high' ? 'bg-amber-600' : 'bg-green-700'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full ${mode === 'high' ? 'bg-amber-700' : 'bg-green-600'}`}></div>
          </div>
        </div>
      </div>
      <p className={`mt-2 text-sm font-bold tracking-widest animate-pulse ${mode === 'high' ? 'text-emerald-800' : 'text-green-400 font-mono'}`}>
        {text || "LOADING..."}
      </p>
    </div>
  );
};

export default FarmLoader;
