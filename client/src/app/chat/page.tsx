'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { sendChatMessage } from "../lib/api/chatService";
import { userData } from "../lib/api/userData";
import { ArrowUp } from "lucide-react";

export default function Chat() {
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('llama3-8b-8192');


    const [sessions, setSessions] = useState<string[]>([])
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! How can I help you today?" }
    ]);

    const USER_ID = "123"
    const SESSION_ID = "423"

    useEffect(
        () => {
            async function fetchData() {
                const data = await userData(USER_ID, SESSION_ID)
              
                setSessions((prev) => {
                    const sessionLabel = `Session #${SESSION_ID}`
                    return prev.includes(sessionLabel) ? prev : [...prev,sessionLabel]
                })

                const formattedResponse = data.messages.map((msg:any)=>[
                    {role:'user', text: msg.question},
                    {role:'assistant', text:msg.response},
                ]).flat()
                
                setMessages(formattedResponse)
            }

            fetchData()
        }, [])

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
        setInput('');
        try {
            const data = await sendChatMessage(selectedModel, trimmed);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', text: data.service_output || "..." }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', text: "Error getting the response." }
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] min-h-screen bg-slate-50 text-slate-800 font-paragraph">
            <aside className="bg-slate-100 border-r border-slate-300 px-4 py-6 flex flex-col shadow-inner">
                <div className="mb-10 flex items-center gap-2">
                    <img src="./logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="font-medium text-md text-slate-700">BLOCKGPT</span>
                </div>

                <button className="mb-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition cursor-pointer">
                    + New Chat
                </button>

                <h1 className="text-md font-semibold text-slate-700 mb-2">Chats</h1>
                <ul className="space-y-2 text-sm flex-1 overflow-y-auto">
                    {sessions.map((session, idx) => (
                        <li key={idx} className="rounded-md p-2 hover:bg-slate-300 cursor-pointer transition">
                            {session}
                        </li>
                    ))}
                </ul>
            </aside>


            <main className="flex flex-col h-screen">
                <div className="border-b border-slate-300 bg-white shadow-sm">
                    <Navbar selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg rounded-md px-5 py-3 shadow text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-900'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white px-6 py-4 mx-auto max-w-3xl w-full flex flex-col text-center">
                    <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-3 shadow-xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about cryptocurrency"
                            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none placeholder-slate-500"
                        />
                        <button
                            onClick={handleSend}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            <ArrowUp className="h-4 w-4 text-white" />
                        </button>
                    </div>
                    <p className="text-xs mt-2 text-slate-500 font-paragraph">
                        BLOCKGPT can make mistakes. Check for important info.
                    </p>
                </div>
            </main>
        </div>
    );
}
