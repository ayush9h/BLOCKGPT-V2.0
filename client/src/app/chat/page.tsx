'use client';
import { useEffect } from "react";
import Navbar from "../components/navbar";
import { sendChatMessage } from "../lib/api/chatService";
import { userData } from "../lib/api/userData";
import { ChatReducer, InitialState, Message } from "../reducers/reducerChat";
import { useReducer } from "react";
import { ArrowUp, Plus } from "lucide-react";

export default function Chat() {

    const [state, dispatch] = useReducer(ChatReducer, InitialState)

    const USER_ID = "123"
    const SESSION_ID = "423"

    useEffect(() => {
        let unsubscribed = false
        async function fetchData() {
            const data = await userData(USER_ID, SESSION_ID)

            if (!unsubscribed) {
                const sessionLabel = `Session #${SESSION_ID}`
                dispatch({ 'type': 'ADD_SESSION', payload: sessionLabel })

                const formattedResponse: Message[] = data.messages.map((msg: any) => [
                    { role: 'user', text: msg.question },
                    { role: 'assistant', text: msg.response },
                ]).flat()

                dispatch({ type: 'SET_MESSAGES', payload: formattedResponse })
            }
        }

        fetchData()

        return () => {
            unsubscribed = true
        }

    }, [USER_ID, SESSION_ID])

    const handleSend = async () => {
        const inputData = state.input.trim();
        if (!inputData) return;

        dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', text: inputData } })
        dispatch({type:'CLEAR_INPUT', payload:''})

        try {
            const data = await sendChatMessage(state.selectedModel, inputData);
            dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', text: data.service_output || "..." } })
        } catch {
            dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', text: "Error getting the response from API" } })
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

                <button className="flex items-center mb-4 w-fit rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition cursor-pointer">
                    <Plus className="h-4 w-4 mr-1" /> New Chat
                </button>

                <h1 className="text-md font-semibold text-slate-700 mb-2">Chats</h1>
                <ul className="space-y-2 text-sm flex-1 overflow-y-auto">
                    {state.sessions.map((session, idx) => (
                        <li key={idx} className="rounded-md p-2 hover:bg-slate-300 cursor-pointer transition">
                            {session}
                        </li>
                    ))}
                </ul>
            </aside>


            <main className="flex flex-col h-screen">
                <div className="border-b border-slate-300 bg-white shadow-sm">
                    <Navbar selectedModel={state.selectedModel} setSelectedModel={(model) => dispatch({ type: 'SET_MODEL', payload: model })} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {state.messages.map((msg: Message, idx: number) => (
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
                            value={state.input}
                            onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
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
