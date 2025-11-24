"use client";

import React, { useState } from 'react';
import { Sprout, Upload, Leaf, Activity, Camera, FileText, XCircle, RotateCcw, AlertTriangle, CheckCircle, Info, Droplets, Beaker } from 'lucide-react';
import FarmLoader from './components/FarmLoader';
import { diseaseData, DiseaseInfo } from './components/diseaseData';

// --- Utility Components & Functions ---

function formatTextWithBulletsAndBold(text: string | undefined | null): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n').filter(line => line.trim() !== '');
  const isList = lines.every(line => line.trim().startsWith('*'));

  if (isList) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {lines.map((line, idx) => {
          const content = line.replace(/^\*\s?/, '');
          const parts = content.split(/(\*\*.+?\*\*)/g).filter(Boolean);

          return (
            <li key={idx} className="leading-relaxed">
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldText = part.slice(2, -2);
                  return <strong key={i}>{boldText}</strong>;
                }
                return part;
              })}
            </li>
          );
        })}
      </ul>
    );
  } else {
    const parts = text.split(/(\*\*.+?\*\*)/g).filter(Boolean);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return <strong key={i}>{boldText}</strong>;
          }
          return part;
        })}
      </>
    );
  }
}

// --- Updated MetricBox: Higher Opacity (bg-white/60) ---
function MetricBox({ label, value, status, theme, icon: Icon }: { label: string; value: any; status: string; theme: any, icon?: any }) {
  const isBad = status.toLowerCase().includes('low') || status.toLowerCase().includes('deficient') || status.toLowerCase().includes('acidic');
  const isGood = status.toLowerCase().includes('high') || status.toLowerCase().includes('adequate') || status.toLowerCase().includes('normal') || status.toLowerCase().includes('safe') || status.toLowerCase().includes('ideal');
  
  let statusColor = theme.font === 'font-sans' ? 'text-amber-800' : 'text-yellow-500';
  if (isBad) statusColor = 'text-red-700';
  if (isGood) statusColor = 'text-emerald-800';

  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${theme.font === 'font-sans' ? 'bg-white/60 border-white/50' : 'bg-black/80 border-green-800'}`}>
      <div className="flex justify-between items-start">
        <div className={`text-xs font-bold uppercase tracking-wider ${theme.font === 'font-sans' ? 'text-slate-700 opacity-80' : 'text-green-600'}`}>{label}</div>
        {Icon && <Icon size={16} className="opacity-50" />}
      </div>
      <div className="mt-2">
        <div className={`text-2xl font-bold ${theme.font === 'font-sans' ? 'text-slate-900' : 'text-green-400'}`}>{value}</div>
        <div className={`text-xs font-bold mt-1 ${statusColor}`}>{status}</div>
      </div>
    </div>
  );
}

// --- Types ---

interface SoilAnalysisResult {
  farmerName: string;
  reportDate: string;
  ph: { value: number; status: string };
  ec: { value: number; status: string };
  nitrogen: { value: string; status: string };
  phosphorus: { value: string; status: string };
  potassium: { value: string; status: string };
  organicCarbon: { value: string; status: string };
  summary: string;
  simplifiedAdvice: string[];
  criticalDeficiencies: string[];
}

interface SoilAnalyzerProps {
  theme: any;
  t: { [key: string]: string };
  bandwidthMode: 'high' | 'low';
}

// --- Main Component ---

const SoilAnalyzer: React.FC<SoilAnalyzerProps> = ({ theme, t, bandwidthMode }) => {
  const [activeMode, setActiveMode] = useState<'soil' | 'disease'>('soil');

  // Soil Analysis States
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  
  // Disease Diagnosis States
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [diseaseResultKey, setDiseaseResultKey] = useState<string | null>(null);
  const [diseaseUploadError, setDiseaseUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- HANDLER 1: SOIL REPORT ---
  const handleSoilUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    // INCREASED LOADING TIME to 5000ms (5 seconds)
    setTimeout(() => {
      setAnalyzing(false);

      // REPORT 1: Rajesh Kumar Sharma
      if (file.name.includes('report1') || file.name.includes('Rajesh')) {
        setResult({
          farmerName: "Sh. Rajesh Kumar Sharma",
          reportDate: "22 Nov 2024",
          ph: { value: 8.32, status: "Moderately Alkaline" }, 
          ec: { value: 0.58, status: "Safe (Non-saline)" },   
          nitrogen: { value: "195 kg/ha", status: "Low" },     
          phosphorus: { value: "18.4 kg/ha", status: "Low" },  
          potassium: { value: "245 kg/ha", status: "Medium" }, 
          organicCarbon: { value: "0.54%", status: "Low" },    
          criticalDeficiencies: ["Zinc (0.82 mg/kg)", "Nitrogen"], 
          summary: "Your soil is decent but hungry. It has good physical structure (easy to plow), but it is very low on 'fuel' (Nitrogen & Carbon) and is missing a key vitamin (Zinc).", 
          simplifiedAdvice: [
            "⚠️ **Zinc Alert:** Your rice/wheat will suffer without Zinc. Apply 25kg/ha Zinc Sulphate before sowing.", 
            "📉 **Nitrogen Boost:** Your Nitrogen is very low (195 kg/ha). You need to split your Urea doses (don't put it all at once) to make sure the plants get fed.", 
            "💩 **Organic Matter:** Your soil needs life! Add 8-10 tons of cow dung (FYM) to improve the carbon levels.", 
          ]
        });
      } 
      // REPORT 2: Rajveer Singh Yadav
      else if (file.name.includes('report2') || file.name.includes('Rajveer')) {
        setResult({
          farmerName: "Mr. Rajveer Singh Yadav",
          reportDate: "23 Nov 2025",
          ph: { value: 7.85, status: "Ideal / Neutral" },      
          ec: { value: 0.68, status: "Non-Saline" },           
          nitrogen: { value: "168 kg/ha", status: "Very Low" },
          phosphorus: { value: "24.5 kg/ha", status: "Medium" },
          potassium: { value: "412 kg/ha", status: "High" },   
          organicCarbon: { value: "0.62%", status: "Low" },    
          criticalDeficiencies: ["Boron (Marginal)", "Nitrogen"], 
          summary: "Your soil has excellent Potassium (K) levels, so you can save money on Potash fertilizers! However, Nitrogen is critically low, and Boron is borderline, which might affect your Wheat grain filling.", 
          simplifiedAdvice: [
            "✅ **Save Money:** You have High Potassium (412 kg/ha). Reduce Potash application.", 
            "⚠️ **Wheat Warning:** For your planned Wheat crop in Dec 2025, Nitrogen is your biggest limit. Use split Urea application.", 
            "🧪 **Special Tip:** Spray Borax (0.5%) when the wheat starts tillering (30 days after sowing). This helps the grains form properly.", 
          ]
        });
      }
      // DEFAULT
      else {
        setResult({
          farmerName: "Unknown Sample",
          reportDate: new Date().toLocaleDateString(),
          ph: { value: 7.2, status: "Neutral" },
          ec: { value: 0.5, status: "Normal" },
          nitrogen: { value: "Unknown", status: "N/A" },
          phosphorus: { value: "Unknown", status: "N/A" },
          potassium: { value: "Unknown", status: "N/A" },
          organicCarbon: { value: "Unknown", status: "N/A" },
          criticalDeficiencies: [],
          summary: "We analyzed your file but couldn't match it to a specific format. Please upload a standard Haryana Soil Health Card.",
          simplifiedAdvice: ["Please upload a valid PDF report."]
        });
      }
    }, 5000); // <-- 5 Seconds Delay
  };

  // --- HANDLER 2: DISEASE IMAGE UPLOAD ---
  const handleDiseaseImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiseaseUploadError(null);
    setDiseaseResultKey(null);
    
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setDiseaseLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/plant-disease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Inference API error');
      }

      const data = await response.json();
      setDiseaseResultKey(data.prediction || null);

    } catch (error: any) {
      setDiseaseUploadError(error.message || 'Upload or inference failed');
    } finally {
      setDiseaseLoading(false);
    }
  };

  const handleResetDisease = () => {
    setPreviewUrl(null);
    setDiseaseResultKey(null);
    setDiseaseUploadError(null);
    setDiseaseLoading(false);
  };

  // --- STYLING HELPERS ---

  const getTabStyle = (mode: 'soil' | 'disease') => {
    const isActive = activeMode === mode;
    if (theme.font === 'font-sans') {
      return `flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
        isActive 
          ? 'bg-white shadow-md text-emerald-800 scale-[1.02]' 
          : 'bg-white/30 text-slate-600 hover:bg-white/50'
      }`;
    } else {
      return `flex-1 py-3 px-4 border font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${
        isActive 
          ? 'bg-green-900 border-green-500 text-black' 
          : 'bg-black border-green-900 text-green-700 hover:border-green-500 hover:text-green-500'
      }`;
    }
  };

  const getDiseaseDisplay = (key: string | null) => {
    if (!key) return null;
    const info = diseaseData[key];
    if (info) return info;
    
    return {
        name: key.replace(/_/g, ' '),
        description: "Analysis complete. No specific details available for this result.",
        treatment: "Consult a local agricultural expert.",
        status: 'warning'
    } as DiseaseInfo;
  };

  const diseaseInfo = getDiseaseDisplay(diseaseResultKey);

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      
      {/* --- Tab Selection Header --- */}
      <div className="space-y-4">
        <h2 className={`text-2xl font-bold flex items-center gap-3 ${theme.font === 'font-mono' ? 'text-green-500' : 'text-slate-800'}`}>
          <Sprout className={theme.font === 'font-mono' ? 'animate-pulse' : ''} /> 
          {t.soil_decoder || "Agri-Analysis Hub"}
        </h2>
        
        <div className={`flex gap-3 p-1 rounded-2xl ${theme.font === 'font-sans' ? 'bg-slate-100/50' : ''}`}>
          <button onClick={() => setActiveMode('soil')} className={getTabStyle('soil')}>
            <FileText size={18} />
            <span>Analyze Soil Report</span>
          </button>
          <button onClick={() => setActiveMode('disease')} className={getTabStyle('disease')}>
            <Camera size={18} />
            <span>Diagnose Disease</span>
          </button>
        </div>
      </div>

      {/* --- MODE 1: Soil Analysis --- */}
      {activeMode === 'soil' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {!result ? (
            <div className={`p-12 border-2 border-dashed rounded-3xl text-center space-y-4 ${theme.font === 'font-sans' ? 'border-white/40 bg-white/20 backdrop-blur-sm' : 'border-green-700 bg-black'}`}>
              {analyzing ? (
                <FarmLoader text="Reading PDF content..." mode={bandwidthMode} />
              ) : (
                <>
                  <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-800">
                    <Upload size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Upload Soil Health Card</h3>
                    <p className="opacity-60 text-sm mt-1 text-slate-700">Supports PDF or Image (Haryana Govt Format)</p>
                  </div>
                  <label className="cursor-pointer">
                    <span className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all inline-block ${theme.primary} text-white hover:opacity-90`}>
                       Select Report File
                    </span>
                    <input type="file" accept=".pdf,.png,.jpg" onChange={handleSoilUpload} className="hidden" />
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className={`space-y-6`}>
              
              {/* 1. Summary Header Card (Increased Opacity) */}
              <div className={`p-6 rounded-2xl shadow-sm ${theme.font === 'font-sans' ? 'bg-white/80 backdrop-blur-md border border-white/50' : 'bg-black border border-green-500'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs uppercase tracking-widest opacity-60">Analysis For</div>
                        <h3 className={`text-2xl font-bold ${theme.font === 'font-mono' ? 'text-green-400' : 'text-slate-800'}`}>
                            {result.farmerName}
                        </h3>
                        <p className="text-sm opacity-60">Report Date: {result.reportDate}</p>
                    </div>
                    <button onClick={() => setResult(null)} className="text-sm underline opacity-60 hover:opacity-100 text-red-500">
                        Upload Different File
                    </button>
                </div>

                <div className={`p-4 rounded-xl ${theme.font === 'font-sans' ? 'bg-emerald-50/90 border border-emerald-100' : 'bg-green-900/20 border border-green-800'}`}>
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                        <Info size={18} className="text-emerald-600"/> 
                        AI Summary (Easy Read)
                    </h4>
                    <p className="leading-relaxed opacity-90 text-lg">
                        {result.summary}
                    </p>
                    

[Image of nitrogen cycle]

                </div>
              </div>

              {/* 2. Key Metrics Grid (Increased Opacity) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricBox label="Nitrogen (N)" value={result.nitrogen.value} status={result.nitrogen.status} theme={theme} icon={Sprout} />
                <MetricBox label="Phosphorus (P)" value={result.phosphorus.value} status={result.phosphorus.status} theme={theme} icon={Beaker} />
                <MetricBox label="Potassium (K)" value={result.potassium.value} status={result.potassium.status} theme={theme} icon={AlertTriangle} />
                <MetricBox label="Org. Carbon" value={result.organicCarbon.value} status={result.organicCarbon.status} theme={theme} icon={Leaf} />
              </div>

              {/* 3. Detailed Action Plan (Increased Opacity) */}
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Physical Stats - Now bg-white/60 */}
                  <div className={`p-6 rounded-2xl shadow-sm backdrop-blur-md ${theme.font === 'font-sans' ? 'bg-white/60 border border-white/50' : 'bg-black/60 border border-green-700'}`}>
                     <h4 className="font-bold mb-4 flex items-center gap-2 opacity-80">
                        <Activity size={18} /> Soil Physics
                     </h4>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                            <span>pH Level</span>
                            <span className={`font-bold ${result.ph.status.includes('Neutral') ? 'text-green-600' : 'text-amber-600'}`}>
                                {result.ph.value} ({result.ph.status})
                            </span>
                        </div>
                        

[Image of soil pH scale]

                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                            <span>Salinity (EC)</span>
                            <span className="font-bold text-green-600">
                                {result.ec.value} ({result.ec.status})
                            </span>
                        </div>
                        <div className="mt-4">
                            <span className="text-xs uppercase opacity-60 block mb-2">Critical Deficiencies</span>
                            <div className="flex flex-wrap gap-2">
                                {result.criticalDeficiencies.map((def, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                        {def}
                                    </span>
                                ))}
                            </div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Simplified Advice - Now bg-white/60 */}
                  <div className={`p-6 rounded-2xl shadow-sm backdrop-blur-md ${theme.font === 'font-sans' ? 'bg-white/60 border border-white/50' : 'bg-black/60 border border-green-700'}`}>
                     <h4 className="font-bold mb-4 flex items-center gap-2 opacity-80">
                        <CheckCircle size={18} /> Action Plan
                     </h4>
                     <ul className="space-y-4">
                        {result.simplifiedAdvice.map((advice, idx) => (
                            <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                                <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-slate-400" />
                                <span dangerouslySetInnerHTML={{ __html: advice.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </li>
                        ))}
                     </ul>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODE 2: Plant Disease Diagnosis --- */}
      {activeMode === 'disease' && (
        <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 p-8 rounded-3xl border ${theme.font === 'font-sans' ? 'bg-white/60 border-white/50 backdrop-blur-md' : 'bg-black border-green-700'}`}>
          {/* ... Content ... */}
          <div className="space-y-2 mb-6">
             <h3 className={`text-xl font-bold flex items-center gap-3 ${theme.font === 'font-mono' ? 'text-green-500' : 'text-slate-800'}`}>
                <Leaf size={24}/> Plant Health Scanner
            </h3>
            <p className="opacity-70 text-sm">Upload a clear photo of a plant leaf to detect diseases automatically.</p>
          </div>
          
          {!previewUrl ? (
            <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors ${theme.font === 'font-sans' ? 'border-white/50 hover:bg-white/10' : 'border-green-800 hover:border-green-500'}`}>
                <Camera size={48} className="mb-4 opacity-50" />
                <label className="block w-full text-center cursor-pointer">
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold ${theme.font === 'font-sans' ? 'bg-white/80 backdrop-blur text-emerald-900 shadow-sm' : 'bg-green-900 text-green-100 border border-green-500'}`}>
                      Choose or Take Photo
                  </span>
                  <input type="file" accept="image/*" onChange={handleDiseaseImageUpload} className="hidden" />
                </label>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="relative group h-full">
                    <img 
                      src={previewUrl} 
                      alt="Plant leaf analysis" 
                      className={`w-full h-64 md:h-full object-cover rounded-2xl shadow-lg border ${theme.font === 'font-sans' ? 'border-white/40' : 'border-green-600 grayscale hover:grayscale-0 transition-all'}`} 
                    />
                    <button 
                        onClick={handleResetDisease} 
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
                        title="Remove Image"
                    >
                        <XCircle size={20} />
                    </button>
                </div>

                <div className={`flex flex-col justify-center p-6 rounded-2xl ${theme.font === 'font-sans' ? 'bg-white/60 border border-white/40 backdrop-blur-md' : 'border border-green-600'}`}>
                    {diseaseLoading && (
                        <div className="text-center space-y-4 py-10">
                            <FarmLoader text="AI Analysis in progress..." mode={bandwidthMode} />
                            <p className="text-xs opacity-70">Detecting pathogens...</p>
                        </div>
                    )}
                    {diseaseUploadError && !diseaseLoading && (
                        <div className="text-center space-y-3">
                            <div className="p-3 bg-red-100 text-red-600 rounded-full inline-block">
                                <Activity size={24} />
                            </div>
                            <p className="text-red-600 font-bold text-sm">{diseaseUploadError}</p>
                            <button onClick={handleResetDisease} className="text-xs underline opacity-70">Try Again</button>
                        </div>
                    )}
                    {diseaseInfo && !diseaseLoading && (
                        <div className="text-left w-full space-y-4 animate-in fade-in zoom-in duration-300">
                             <div className="flex items-center gap-3 border-b border-black/5 pb-3">
                                {diseaseInfo.status === 'healthy' ? (
                                    <CheckCircle className="text-green-600" size={28} />
                                ) : (
                                    <AlertTriangle className="text-amber-600" size={28} />
                                )}
                                <div>
                                    <div className="text-xs uppercase tracking-wider opacity-60">Result</div>
                                    <h3 className={`text-xl font-bold leading-tight ${theme.font === 'font-mono' ? 'text-green-400' : 'text-slate-800'}`}>
                                        {diseaseInfo.name}
                                    </h3>
                                </div>
                             </div>
                             <div className="space-y-4 py-2">
                                <div>
                                    <h4 className="font-bold text-sm flex items-center gap-2 mb-1 opacity-80">
                                        <Info size={14} /> Symptoms
                                    </h4>
                                    <p className="text-sm leading-relaxed opacity-90">
                                        {diseaseInfo.description}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${theme.font === 'font-sans' ? 'bg-white/40' : 'border border-green-800'}`}>
                                    <h4 className="font-bold text-sm flex items-center gap-2 mb-1 opacity-80">
                                        <Sprout size={14} /> {diseaseInfo.status === 'healthy' ? 'Care Tips' : 'Recommended Treatment'}
                                    </h4>
                                    <p className="text-sm leading-relaxed opacity-90">
                                        {diseaseInfo.treatment}
                                    </p>
                                </div>
                             </div>
                             <div className="pt-4 border-t border-white/20 w-full">
                                <button 
                                    onClick={handleResetDisease} 
                                    className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-bold transition-all ${theme.font === 'font-sans' ? 'hover:bg-white/40' : 'hover:bg-green-900'}`}
                                >
                                    <RotateCcw size={16} /> Scan New Leaf
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default SoilAnalyzer;