'use client';
import { useState } from "react";
import Navbar from "../components/navbar";
import { sendChatMessage } from "../lib/api/chatService";

export default function Chat() {
    
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('llama3-8b-8192')

    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! How can I help you today?" }
    ]);

    const handleSend = async () => {
        const inputData = input.trim();
        if (!inputData) return;

        setMessages(prev => [...prev, { role: 'user', text: inputData }]);
        setInput('');

        try {
            const data = await sendChatMessage(selectedModel,inputData);

            setMessages(prev => [...prev, { role: 'assistant', text: data.service_output || "..." }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error getting the response." }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen bg-white text-slate-800 font-paragraph">
            <aside className="col-span-1 bg-slate-100 border-r border-slate-300 px-5 py-6 flex flex-col shadow-inner">
                <h2 className="text-lg font-semibold text-slate-700 mb-5">Chat History</h2>
                <ul className="space-y-3 text-sm">
                    {['Session #1', 'Session #2'].map((session, index) => (
                        <li
                            key={index}
                            className="rounded-lg p-3 bg-white border border-slate-300 shadow hover:bg-slate-100 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer font-medium text-slate-700"
                        >
                            {session}
                        </li>
                    ))}
                    <button className="w-full rounded-lg px-4 py-2.5 border-2 border-blue-500 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 hover:border-blue-600 transition cursor-pointer">
                        + New Chat
                    </button>
                </ul>
            </aside>

            <main className="col-span-4 flex flex-col h-screen">
                <div className="border-b border-slate-200 bg-white px-6 shadow-sm">
                    <Navbar selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-b from-white to-slate-100">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-lg rounded-xl px-5 py-3 shadow text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-800'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-inner">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-slate-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSend}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm text-white font-semibold transition-shadow shadow-sm hover:shadow-md"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
