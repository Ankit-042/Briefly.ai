export const text_extraction=()=>{
    const Body_clone=document.body.cloneNode(true);
    const tag_to_remove=['script','style','nav','footer','header','aside','noscript','iframe']; 
    tag_to_remove.forEach((tag)=>{
    const elements= Body_clone.querySelectorAll(tag)
        elements.forEach((el)=>{
            el.remove();
            
        })
    })
let text = Body_clone.innerText || "";
  return text
    .replace(/\s+/g, ' ')      
    .trim()                    
    .substring(0, 5000);       
}
