export async function sendChatMessage(selectedModel:string, question: string){
    const response = await fetch('http://localhost:5000/api/v1/blockgpt/chat', {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            model:selectedModel,
            question
        })
    })  
    
    if(!response.ok){
        throw new Error("Failed to get response from the API")
    }

    return response.json()

}