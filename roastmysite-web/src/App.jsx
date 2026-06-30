import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import './App.css';

// Code-split the results view so its parsing/render logic isn't in the
// initial landing-page bundle (only loads when /results/:scanId is hit).
const ResultsPage = lazy(() => import('./components/ResultsPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results/:scanId" element={<ResultsPage />} />
      </Routes>
    </Suspense>
  );
}
