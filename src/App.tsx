import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './modules/Dashboard/Dashboard';
import { PersonalityProfiler } from './modules/PersonalityProfiler/PersonalityProfiler';
import { CareerCompass } from './modules/CareerCompass/CareerCompass';
import { MindMesh } from './modules/MindMesh/MindMesh';
import { BudgetBuddy } from './modules/BudgetBuddy/BudgetBuddy';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/personality" element={<PersonalityProfiler />} />
        <Route path="/career" element={<CareerCompass />} />
        <Route path="/mindmesh" element={<MindMesh />} />
        <Route path="/budget" element={<BudgetBuddy />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

