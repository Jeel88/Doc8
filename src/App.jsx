import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
// Pages will be imported here later
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
