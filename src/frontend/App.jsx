import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/results/:resultId" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
