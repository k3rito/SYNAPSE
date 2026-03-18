<div align="center">
  <img src="public/favicon.ico" alt="Synapse AI Logo" width="80" height="80" />
  <h1 align="center">Synapse AI</h1>
  <p align="center">
    <strong>Learn at the speed of thought.</strong>
  </p>
  <p align="center">
    An intelligent, adaptive tech learning platform powered by a dual-AI architecture.
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  </div>
</div>

---

## 🌌 Overview

**Synapse AI** is a futuristic, highly interactive educational platform designed for modern developers and engineers. It abandons static courses in favor of dynamically generated learning nodes tailored to your current trajectory. 

Draped in a sleek **Futuristic Minimalism** aesthetic (Deep Space Black, Glass UI, and Neon Cyan `#22D3EE` glows), the platform actively tracks your progress through complex mastery tracks using a sophisticated gamification engine.

## 🚀 Dual-AI Architecture

To ensure instantaneous interaction alongside deep technical generation, Synapse utilizes a split-provider AI brain:
* **The Architect (OpenRouter):** Powered by native `fetch` API routing, OpenRouter leverages heavy-lifting models (e.g., `meta-llama/llama-3-8b-instruct`) to generate heavily structured, JSON-verified dynamic lessons.
* **The Orb (Groq):** A blazing fast, low-latency SDK integration driving the 3D Assistant Orb, providing deterministic technical context and code explanations in milliseconds.

## ✨ Key Features

* **Interactive Curriculum Hub:** Navigate through modular Skill Trees across diverse vectors like Full-Stack Engineering, Web3, and CyberSecurity.
* **Adaptive Knowledge Nodes:** Lessons adapt to your progression. The engine generates theory, code snippets, and interactive quizzes on-demand.
* **Gamified Dashboard:** Watch your global progress bar evolve as you clear nodes. Your rank upgrades dynamically from *Initiate* to *Architect*.
* **Interactive 3D AI Orb:** A floating, tangible `react-three-fiber` Assistant Orb is always present to answer your technical questions, constrained strictly to the current lesson's context.
* **Role-Based Admin Panel:** A secure command center powered by `@supabase/ssr` to monitor live user metrics, generated lessons, and database integrity.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS (Custom Design System + Glassmorphism)
* **State Management:** Zustand
* **Database & Auth:** Supabase (PostgreSQL + RLS Policies)
* **3D Rendering:** React Three Fiber, `@react-three/drei`, GSAP
* **AI Engines:** OpenRouter API, Groq SDK

## ⚙️ Quick Start

Follow these steps to initialize Synapse AI locally:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/synapse-ai.git
cd "synapse AI"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and configure the following keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Providers
OPENROUTER_API_KEY=your_openrouter_api_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Initialize Database
Apply the SQL migrations found in the documentation to construct the `profiles`, `generated_lessons`, and `chat_history` tables in your Supabase instance, ensuring all Row Level Security (RLS) policies are active.

### 5. Launch the Node
```bash
npm run dev
```
Navigate your browser to [http://localhost:3000](http://localhost:3000) to begin.

---
<div align="center">
  <p><i>Constructed for the future of learning.</i></p>
</div>
