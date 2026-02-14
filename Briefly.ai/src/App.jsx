import { useState } from 'react';
import { useDarkMode } from './useDarkMode.js';
import light from '../src/assets/light-mode.png'
import dark from './assets/night-mode.png'
import './index.css'
import {summerizeWithOllama} from '../src/Api.js'
import { text_extraction } from '../src/Extract.js';
function App() {
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isDark,toggleDarkMode]=useDarkMode();
  const handleSummarize = async () => {
    console.log("Full Chrome Object:", window.chrome);
    console.log("Scripting API:", window.chrome.scripting);
  if (typeof chrome === "undefined" || !chrome.scripting) {
    console.error("Chrome Scripting API not found. Are you running this as an extension?");
    return;
  }

  setIsProcessing(true);
  setSummary(""); // clear previous summary
  try {
   
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      console.error("No active tab found");
      setIsProcessing(false);
      return;
    }

    // Inject extraction function into the website
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: text_extraction,
    }, async (results) => {
      if (results && results[0].result) {
        const extractedText = results[0].result;
        // Sending to your API
        const aiSummary = await summerizeWithOllama(extractedText);
      
        setSummary(aiSummary); // Make sure to update your state!
        setIsProcessing(false); // Stop processing after API returns
      } else {
        setIsProcessing(false);
      }
    });
  } catch (error) {
    console.log("scripting error", error);
    setIsProcessing(false);
  }
  
};

const clear_summary=()=>{
      setSummary('')
}
  return (
    <div className="flex flex-col h-screen font-sans   bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-blue-600">Briefly.AI</h1>
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4">
      
        
        
        {/* Modern Toggle Switch */}
       {/* Modern Animated Toggle Switch */}
<button
  onClick={toggleDarkMode}
  // 1. The Track Container
  className="relative h-8 w-16 rounded-full p-1 transition-colors duration-300 focus:outline-none bg-slate-200 dark:bg-slate-800"
  aria-label="Toggle Dark Mode"
>
  {/* 2. The Icons Layer (Static, sits on top with z-10) */}
  <div className="relative z-10 flex h-full w-full items-center justify-between px-1.5">
    {/* Sun Icon - slightly faded when dark mode is active */}
    <span className={`text-sm transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
    <img src={light} alt='light icon' className='w-4 h-4' />
    </span>
    {/* Moon Icon - slightly faded when light mode is active */}
    <span className={`text-sm transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
    <img src={dark} alt='dark icon' className='w-4 h-4'/>
    </span>
  </div>

  {/* 3. The Sliding Knob (Absolute position behind icons) */}
  <span
    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out dark:bg-slate-400 ${
      // This controls the slide animation
      isDark ? 'translate-x-8' : 'translate-x-0'
    }`}
  ></span>
</button>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleSummarize}
        disabled={isProcessing}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-slate-300 shadow-lg mb-4"
      >
        {isProcessing ? 'AI is thinking...' : 'Summarize Page'}
      </button>
      {/* Summary Area */}
      <div className="grow bg-white rounded-2xl border border-slate-200 p-4 overflow-y-auto  dark:bg-black text-slate-900 dark:text-slate-100 ">
       {summary ? (
          <p className="leading-relaxed italic">{summary}</p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <span className="text-3xl mb-2">✨</span>
            <p className="text-xl text-red-300">Summary will appear here</p>
          </div>
        )} 
        {/* // Button to convert the summary to PDF document */}
      </div>
      <div>
      <button  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-slate-300 shadow-lg mb-4  mt-2" onClick={clear_summary}>
        Clear
      </button>
      </div>
      <div>
        <button  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-slate-300 shadow-lg mb-4"
      >
        Covert to PDF
        </button>
      </div>
    </div>
  );
}
export default App;