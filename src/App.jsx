import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layout/Layout';
// Pages will be imported here later
import Home from './pages/Home';
import Upload from './pages/Upload';
import Browse from './pages/Browse';
import Settings from './pages/Settings';
import Notices from './pages/Notices';
import AiSummary from './pages/AiSummary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="browse" element={<Browse />} />
            <Route path="notices" element={<Notices />} />
            <Route path="ai-summary" element={<AiSummary />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
