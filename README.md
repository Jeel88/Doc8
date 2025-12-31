# Doc8 - Intelligent Note Sharing & AI Assistant 🎓

Doc8 is a modern, student-centric platform designed to simplify sharing academic resources and learning efficiently. It combines robust file sharing with **Private, Offline AI interaction**.

---

## 🚀 Key Features

*   **Browse by Semester:** Structured navigation with visual drill-downs (Year -> Semester -> Subject -> Notes).
*   **Secure File Upload:** Students can contribute PDFs/Docs, stored securely in **Supabase**.
*   **Notice Board:** Real-time updates for exams, events, and deadlines.
*   **Local AI Chat (WebLLM):** A completely offline, private AI model (`Llama-3.2`) that runs *inside your browser* to answer questions about your PDFs. No API keys required!
*   **Performance Monitoring:** Integrated **Vercel Speed Insights** for real-time performance tracking.

---

## 🛠️ Tech Stack & Architecture

### **Frontend & AI**
*   **React + Vite:** Blazing fast performance and reliable bundling.
*   **WebLLM:** Runs high-performance Large Language Models directly in the browser using WebGPU.
*   **PDF.js:** Robust client-side PDF parsing and text extraction.
*   **TailwindCSS:** Modern, responsive styling with a dark-mode-first aesthetic.

### **Backend & Deployment**
*   **Supabase:** The complete backend solution.
    *   **PostgreSQL:** Stores metadata and subject hierarchy.
    *   **RLS Policies:** Ensures secure data access (critical for visibility).
    *   **Storage Buckets:** Hosts raw note files.
*   **Vercel:** Deployed with custom `vercel.json` rewrites for seamless client-side routing.

---

## 🧠 How the AI Works (Privacy First)
Unlike other apps that send your data to the cloud, **Doc8 runs the AI locally on your device**:
1.  **Download:** You click "Download Model" once to cache the ~800MB model (Llama 3.2).
2.  **Parse:** When you upload a PDF, we extract text locally using `pdfjs-dist`.
3.  **Chat:** The model runs purely in your browser memory. Your documents **never leave your computer**.

*Note: Large PDFs (>5MB) are automatically truncated to preventing browser memory crashes.*

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
3.  **Database Config (Important):**
    Ensure you have enabled **Row Level Security (RLS)** in Supabase and added a "SELECT" policy to `public.notes`, otherwise notes will be invisible.
    ```sql
    create policy "Public Read Access" on "public"."notes" for select using (true);
    ```
4.  **Run Locally:**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

- **/src/pages:** `Browse` (Data Fetching), `AiSummary` (Local LLM Logic).
- **/src/components:** UI Building blocks.
- **/public:** Static assets & `pdf.worker.min.mjs` (Critical for AI).

---

**Built with ❤️ for Students.**
