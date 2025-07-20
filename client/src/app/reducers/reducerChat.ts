export type Message = {
    role: 'user' | 'assistant';
    text: string;
}

export type ChatState = {
    input:string;
    selectedModel:string;
    sessions:string[];
    messages:Message[]
}

export const InitialState: ChatState = {
    input: '',
    selectedModel: 'llama3-8b-8192',
    sessions: [],
    messages: [{ role: 'assistant', text: 'Hi, how can I help you today' }]
};

export const ChatReducer = (state: ChatState, action: any) =>  {
    switch(action.type){
        case 'SET_INPUT':
            return {
                ...state,
                input: action.payload,
            };
        
        case 'CLEAR_INPUT':
            return {
                ...state,
                input: '',
            };
        
        case 'SET_MODEL':
            return {
                ...state,
                selectedModel: action.payload
            };
        
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };

        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            };
        
        case 'ADD_SESSION':
            if (state.sessions.includes(action.payload))
                return state;
            return { ...state, sessions: [...state.sessions, action.payload] };
            
        default:
            return state
    }
}