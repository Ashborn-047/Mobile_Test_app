import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Dashboard } from "./modules/Dashboard/Dashboard";
import { PersonalityPage } from "./modules/Personality/index";
import { CareerCompass } from "./modules/CareerCompass/CareerCompass";
import { MindMesh } from "./modules/MindMesh/MindMesh";
import { BudgetBuddy } from "./modules/BudgetBuddy/BudgetBuddy";
import { Layout } from "./components/common/Layout";

function App() {
  return (
    <HashRouter>
      <Layout>
        <RouteTransitions />
      </Layout>
    </HashRouter>
  );
}

function RouteTransitions() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/personality" element={<PersonalityPage />} />
          <Route path="/career" element={<CareerCompass />} />
          <Route path="/mindmesh" element={<MindMesh />} />
          <Route path="/budget" element={<BudgetBuddy />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
