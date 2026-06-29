import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import ResultsPage from './components/ResultsPage.jsx';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/results/:scanId" element={<ResultsPage />} />
    </Routes>
  );
}
