🚨 SYSTEM OVERRIDE & ARCHITECTURAL OVERHAUL MANDATE 🚨
ROLE: You are an elite Next.js, Supabase, and Vercel AI SDK Architect.
OBJECTIVE: Execute a massive, flawless architectural shift on the "SYNAPSE" codebase. You must process the following directives strictly as isolated [SKILLS]. No detail can be omitted. Zero-tolerance for breaking changes.

[SKILL 1: ZERO-ERROR AI JSON PARSING (VERCEL AI SDK + ZOD)]
Action: Completely eradicate raw JSON.parse() logic in all AI API routes.

Implementation: Migrate strictly to the Vercel AI SDK's generateObject (or streamObject).

Validation: Define strict schemas using Zod (e.g., z.object({...})) for expected lesson outputs. Force the LLM to adhere to this schema to leverage the SDK's auto-correction. The UI must never crash from malformed JSON again.

[SKILL 2: ADVANCED MARKDOWN RENDERING ENGINE]
Action: Stop attempting to parse complex arrays/objects for lesson content. The AI should generate a single rich Markdown string.

Implementation: Implement react-markdown in the UI with the following powerhouse plugins:

remark-math & rehype-katex: To beautifully render 
math
 and

math
equations (university grade).

remark-gfm: For proper rendering of markdown tables.

react-syntax-highlighter (or Prism): For VS Code-like syntax highlighting of code blocks.

[SKILL 3: GENERATIVE UI (TOOL CALLING) VIA ai/rsc]
Action: Upgrade the conversational UI to support Generative UI.

Implementation: Implement ai/rsc (React Server Components for AI). Equip the AI with tools to return actual React components (e.g., <BarChart />, <Canvas><Model /></Canvas>) directly into the chat stream when the user asks for data analysis or 3D visuals.

[SKILL 4: STRICT AUTHENTICATION GATEKEEPING]
Action: Implement hard UI/UX blocks for unauthenticated users trying to use premium features.

Chat Logic: If not logged in, the chatbot input must be disabled or intercepted. The bot must reply: "الرجاء تسجيل الدخول للاستفادة من هذه الميزة".

Generation Logic: Instead of an endless loading screen, attempting to generate a lesson while logged out must immediately display a warning UI: "Please log in to generate lessons" paired with a prominent "Go to Login" redirect button.

[SKILL 5: CINEMATIC INTRO & GLOBAL 3D ASSET OVERHAUL]
Action: Execute the following specific integration instruction using curl:

stitsh api :
AQ.Ab8RN6JFpcBm58Eo3GbD95c3Fiaw4GxxDkodd196Kvr5oiL1bQ
Get the images and code for the following Stitch project's screens:
Project Title: Landing Page (ID: 3030202729657833189)
Screens: 1. SYNAPSE Cinematic Intro (ID: 154521200dbb425d88d56184e9446fbb)
Use a utility like curl -L to download the hosted URLs.

Integration Mandate: Extract the 3D assets/models from this specific intro project and REPLACE all current global background 3D models in the entire website with these new cinematic assets.

[SKILL 6: DATABASE ISOLATION FIX (CRITICAL DATA LEAK)]
Action: Fix the dashboard bug where all users see the exact same data.

Implementation: Ensure all Supabase fetch queries explicitly filter by the logged-in user: .eq('user_id', user.id). Furthermore, ensure Supabase Row Level Security (RLS) policies are perfectly configured so a user can only SELECT, INSERT, UPDATE, or DELETE their own rows.

[SKILL 7: COMPREHENSIVE USER PROFILE COMPONENT]
Action: Build a sophisticated Profile Dropdown/Bubble in the top navbar (visible only after login).

Features Required:

Display User Name and Email.

"Change Name" button (requires entering current password to confirm).

"Change Password" button (requires fields: Old Password, New Password, Confirm New Password).

"Invite a Friend" button (generates a unique referral link).

"Logout" button.

[SKILL 8: PERSISTENT SESSIONS & COOKIE CONSENT]
Action: Maximize session retention and ensure compliance.

Sessions: Implement long-lived session caching in the browser (LocalStorage/Cookies) to keep users logged in securely for the maximum allowed duration via Supabase GoTrue.

Cookie Banner: Create a global "Accept / Reject" cookie consent banner. If accepted, store this preference so it never appears again for that user.

[SKILL 9: SECURE GAMIFICATION ENGINE (XP & REFERRALS)]
Action: Complete the XP system with anti-cheat security.

Backend Security: All XP logic MUST be validated and awarded server-side. Never trust client-side XP updates.

Daily Streaks: Implement a daily login reward system:

Week 1 (Days 1-7): +50 XP daily.

Week 2 (Days 8-14): +100 XP daily.

Week 3+ (Days 15+): +150 XP daily.

Missing a day resets the streak.

Referral Dividend: If User A invites User B via their unique link, User A receives a passive +15% XP bonus derived from every XP point User B earns. Connect this to the database structure.

EXECUTE ALL SKILLS SEQUENTIALLY. CONFIRM WHEN THE ARCHITECTURE HAS BEEN FULLY REFACTORED.

supabase api keys:
Project URL:https://vmggoxaqbfzeyclcscow.supabase.co
sb_publishable_-JIVvL6ltvhWwPiw1DrQKQ_DvtGDdWn
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZ2dveGFxYmZ6ZXljbGNzY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzY3NzMsImV4cCI6MjA4OTIxMjc3M30.VA92pXIheXbHrQDSo-hHiYHiRt4_PITJMJROoRY27Hk