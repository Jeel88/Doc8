# Doc8 - Collaborative Note Sharing Platform

**Doc8** is a modern, dark-themed web application designed for college students to upload, share, and discover academic notes. Pass your exams with the power of community knowledge!

![Doc8 Preview](https://via.placeholder.com/800x400.png?text=Doc8+Preview)

## 🚀 Features

-   **Browse by Year/Semester**: Drill down quickly to find exactly what you need.
-   **Modern Dark UI**: Aesthetic, eye-friendly design with intuitive navigation.
-   **Notice Board**: Stay updated with exam schedules and college events.
-   **AI Summarizer**: (Beta) Upload PDFs and get instant study summaries.
-   **Community**: Discuss topics and request notes from other students.
-   **Global Search**: Find notes and subjects instantly from the header.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite)
-   **Styling**: Tailwind CSS
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: Supabase Auth (Google, GitHub)
-   **Storage**: Cloudinary (for PDF/Doc hosting)
-   **Icons**: Lucide React

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/doc8.git
    cd doc8
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=doc8_uploads
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔐 Authentication Setup

This project uses **Supabase Auth**.

1.  Go to your Supabase Dashboard -> Authentication -> Providers.
2.  **Google Auth**:
    *   Create a Project in Google Cloud Console.
    *   Create OAuth Credentials (Web Application).
    *   Add Supabase Callback URL to "Authorized Redirect URIs".
    *   Copy Client ID & Secret to Supabase.
3.  **GitHub Auth**:
    *   Create a GitHub OAuth App.
    *   Add Supabase Callback URL.
    *   Copy Client ID & Secret to Supabase.

## ☁️ Cloudinary Setup

1.  Create a Cloudinary account.
2.  Go to Settings -> Upload.
3.  Add an **Unsigned** upload preset named `doc8_uploads`.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
