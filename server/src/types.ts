export interface User {
    user_id: string;
    username: string;
    password: string;
}

export interface ChatData {
    paricipants: Participant[];
    messages: Message[];
    title: string;
}

export interface Participant {
    name: string;
}

export interface Message {
    sender_name: string;
    timestamp_ms: number;
    content: string;
    reactions?: Reaction[];
}

export interface Reaction {
    reaction: string;
    actor: string;
}

export interface Conversation {
    conversation_id: string;
    chat_id: string;
    conversation_date: string;
    messages: string;
    num_messages: number;
}
