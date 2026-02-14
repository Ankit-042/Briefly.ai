export const summerizeWithOllama = async (text)=>{
    try{
     const res= await fetch('http://localhost:11434/api/generate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            model:'gemma3:1b',
            prompt:`summerize this text and highlight important point ${text}`,
            stream: false
        })
     })
     const data= await res.json()
    const actual_summary=data.response;
    return actual_summary;
    }
    catch(error){
        alert('Problem with Ollama server');
        console.error('Ollama connection failed',error);
    }

}   