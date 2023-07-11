export interface User {
    user_id: string;
    username: string;
    password: string;
}

export interface Chat {
    chat_id: string;
    chat_owner_id: string;
    title: string;
    bg_color: string;
}

export interface Conversation {
    conversation_id: string;
    chat_id: string;
    conversation_date: string;
    messages: string;
    num_messages: number;
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
