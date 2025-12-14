import React, { useRef, useState, useCallback } from 'react';
import { Experience } from './components/Experience';
import { HandManager } from './components/HandManager';
import { HandData, ParticleConfig, ShapeType } from './types';
import { INITIAL_CONFIG } from './constants';
import { generateParticleConfig } from './services/geminiService';
import { Sparkles, Command, Hand, GripVertical, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const handRef = useRef<HandData>({ x: 0, y: 0, z: 0, isPinching: false, isPresent: false });
  const [config, setConfig] = useState<ParticleConfig>(INITIAL_CONFIG);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiMessage, setGeminiMessage] = useState<string>('');

  const handleHandUpdate = useCallback((data: HandData) => {
    // Smooth the hand data slightly to reduce jitter
    handRef.current.x += (data.x - handRef.current.x) * 0.3;
    handRef.current.y += (data.y - handRef.current.y) * 0.3;
    handRef.current.z = data.z;
    handRef.current.isPinching = data.isPinching;
    handRef.current.isPresent = data.isPresent;
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeminiMessage("Consulting the Nebula AI...");
    
    try {
      const response = await generateParticleConfig(prompt);
      setConfig(prev => ({
        ...prev,
        shape: response.shape,
        colorStart: response.colorStart,
        colorEnd: response.colorEnd,
      }));
      setGeminiMessage(response.description);
    } catch (error) {
      setGeminiMessage("The stars were silent. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const shapes = Object.values(ShapeType);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Experience config={config} handRef={handRef} />
      </div>

      {/* Hand Tracker (Hidden/Mini) */}
      <HandManager onHandUpdate={handleHandUpdate} />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter">
              NEBULA HAND
            </h1>
            <p className="text-white/60 text-sm mt-1 max-w-md">
              Raise your hand to interact. Pinch to attract particles. Open palm to repel.
            </p>
          </div>

          <div className="flex gap-2">
             <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 flex items-center gap-2">
                <Hand className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-cyan-100">Move</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-100">Pinch</span>
             </div>
          </div>
        </div>

        {/* Gemini Control & Manual Selectors */}
        <div className="flex flex-col gap-4 pointer-events-auto max-w-md">
           
           {/* Gemini Feedback */}
           {geminiMessage && (
               <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border-l-4 border-purple-500 animate-fade-in text-sm text-purple-200">
                  {geminiMessage}
               </div>
           )}

           {/* Magic Input */}
           <form onSubmit={handleGenerate} className="bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10 flex items-center group focus-within:border-purple-500/50 transition-colors">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mr-2">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-white" />}
              </div>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a vibe (e.g. 'Cyberpunk Rain')" 
                className="bg-transparent border-none outline-none text-white text-sm placeholder-white/30 flex-1 h-9 px-1"
                disabled={isGenerating}
              />
              <button 
                type="submit"
                disabled={isGenerating}
                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <Command className="w-4 h-4 text-white/70" />
              </button>
           </form>

           {/* Manual Quick Select */}
           <div className="flex flex-wrap gap-2">
              {shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => setConfig(prev => ({ ...prev, shape: s }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    config.shape === s 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black/40 text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
           </div>
        </div>
      </div>
      
      {/* Warning if no Camera */}
      {!handRef.current.isPresent && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-yellow-200">Waiting for hand detection...</span>
        </div>
      )}
    </div>
  );
};

export default App;
