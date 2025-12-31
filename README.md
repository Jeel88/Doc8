# Doc8 - Intelligent Note Sharing & AI Assistant 🎓

Doc8 is a modern, student-centric platform designed to simplify sharing academic resources and learning efficiently. It combines robust file sharing with **AI-powered document interaction**.

---

## 🚀 Key Features

*   **Browse by Semester:** Structured navigation for finding notes easily (Year 1–4).
*   **Secure File Upload:** Students can contribute PDFs/Docs, stored securely in **Supabase**.
*   **Notice Board:** Real-time updates for exams, events, and deadlines.
*   **AI Chat Assistant:** Interactive chat capable of reading and answering questions from uploaded PDFs in real-time.

---

## 🛠️ Tech Stack & Architecture

### **Frontend Framework**
*   **React + Vite:** Chosen for blazing fast performance and hot-module replacement (HMR).
*   **TailwindCSS:** Utility-first styling for a sleek, responsive "Dark Mode" aesthetic.
*   **React Router:** Handles seamless client-side navigation between pages.

### **Backend & Storage (Serverless)**
*   **Supabase:** Used as the complete backend solution.
    *   **Database:** PostgreSQL for storing metadata (notices, file links, user profiles).
    *   **Auth:** Google Authentication for secure student login.
    *   **Storage:** Buckets for hosting the actual PDF/Document files.

### **The AI Integration (Google Gemini)**
We moved from a heavy local model to **Google Gemini API** for speed and performance.

**How "Chat with PDF" Works (The Flow):**
1.  **Parsing:** When a user uploads a PDF in the AI tab, we use `pdfjs-dist` (running locally in the browser) to read the binary file and extract raw text.
2.  **Context Injection:** This extracted text is stored in the React state as "Context".
3.  **Prompt Engineering:** When the user asks a question, we wrap it invisibly:
    > "Context from document: [PDF TEXT]... User Question: [QUESTION]"
4.  **Generation:** This combined prompt is sent to `Gemini 1.5 Flash` via the API.
5.  **Response:** Gemini answers the question *based specifically on the PDF notes provided*.

---

## 📂 Project Structure

- **/src/pages:** Main views (Home, Browse, AiSummary).
- **/src/components:** Reusable UI (Sidebar, NoticeBoard, FileCard).
- **/src/context:** Global State (AuthContext for user sessions).
- **/public:** Static assets and `pdf.worker.min.mjs` (critical for parsing).

---

## ⚡ Getting Started

1.  **Clone & Install:**
    ```bash
    git clone repo_url
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env` file with your Supabase keys:
    ```
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```
3.  **Run Locally:**
    ```bash
    npm run dev
    ```
4.  **AI Setup:**
    Open the "AI Assistant" tab and paste your free **Google Gemini API Key** when prompted.

---

**Built with ❤️ for Students.**
