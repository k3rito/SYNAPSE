import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  lastAccessed: number;
}

interface AppState {
  isChatbotOpen: boolean;
  chatHistory: ChatMessage[];
  lessonProgress: Record<string, LessonProgress>;
  currentLesson: Record<string, unknown> | null;
  
  // Actions
  toggleChatbot: () => void;
  openChatbot: () => void;
  closeChatbot: () => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;
  setCurrentLesson: (lesson: Record<string, unknown> | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isChatbotOpen: false,
  chatHistory: [
    {
      id: 'init-msg',
      role: 'system',
      content: 'Hello! I am Synapse AI, your learning assistant. How can I help you today?',
      timestamp: Date.now()
    }
  ],
  lessonProgress: {},
  currentLesson: null,

  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
  openChatbot: () => set({ isChatbotOpen: true }),
  closeChatbot: () => set({ isChatbotOpen: false }),
  
  addChatMessage: (message) => set((state) => ({
    chatHistory: [
      ...state.chatHistory,
      {
        ...message,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      }
    ]
  })),
  
  clearChatHistory: () => set(() => ({
    chatHistory: [
      {
        id: 'init-msg-2',
        role: 'system',
        content: 'Chat history cleared. How can I help you next?',
        timestamp: Date.now()
      }
    ]
  })),

  updateLessonProgress: (lessonId, progress) => set((state) => ({
    lessonProgress: {
      ...state.lessonProgress,
      [lessonId]: {
        ...(state.lessonProgress[lessonId] || { lessonId, completed: false, lastAccessed: Date.now() }),
        ...progress,
        lastAccessed: Date.now()
      }
    }
  })),

  setCurrentLesson: (lesson) => set({ currentLesson: lesson })
}));
