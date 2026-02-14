import { useState } from 'react';
import { useDarkMode } from './useDarkMode.js';
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
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-all hover:scale-110"
        >
          {isDark ? '☀️' : '🌙'}
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