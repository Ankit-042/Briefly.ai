import { useState,useEffect } from "react";
export const useDarkMode=()=>{
    const [isDark,setIsDark]=useState(()=>{
        return localStorage.getItem('theme')==='dark';
    });
    useEffect(()=>{
        const root=window.document.documentElement;
        if(isDark){
            root.classList.add('dark');
            localStorage.setItem('theme','dark');
        }
        else{
            root.classList.remove('dark');
            localStorage.setItem('theme','light');
        }
    },[isDark]);
     const toggleDarkMode=()=> setIsDark((prev) => !prev);
     return [isDark,toggleDarkMode];
}