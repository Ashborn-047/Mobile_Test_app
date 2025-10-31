import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Career } from '../../../utils/api';
import { gradients } from '../../../theme';
import { storage } from '../../../utils/storage';

interface CareerPathCardProps {
  career: Career;
}

export const CareerPathCard = ({ career }: CareerPathCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from localStorage or default values
    const storedTasks = storage.get<Record<string, boolean>>(`career_path_${career.id}_tasks`);
    return storedTasks || {
      'pick_problem': false,
      'build_mvp': false,
      'talk_users': false,
      'get_customers': false,
      'scale_revenue': false,
      'build_team': false,
    };
  });

  const handleTaskToggle = (taskKey: string) => {
    const updatedTasks = { ...tasks, [taskKey]: !tasks[taskKey] };
    setTasks(updatedTasks);
    storage.set(`career_path_${career.id}_tasks`, updatedTasks);
  };

  const handleStartPath = () => {
    storage.set('activeCareerPath', { ...career, startedAt: new Date().toISOString() });
    alert(`Started path: ${career.title}! Track your progress in the Dashboard.`);
  };

  // Calculate completion percentage for the path
  const completedTaskCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;
  const pathProgress = totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0;

  const renderTaskCheckbox = (taskKey: string, label: string, timeframe: string) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={tasks[taskKey]}
        onChange={() => handleTaskToggle(taskKey)}
        className="form-checkbox h-4 w-4 text-turquoise rounded focus:ring-turquoise"
      />
      <label className="text-white/90 text-sm">
        {label} <span className="text-white/60">({timeframe})</span>
      </label>
    </div>
  );

  return (
    <Card className={`${gradients.careerCard} col-span-1 h-auto flex flex-col justify-between p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        {/* Collapsed View */}
        <div className="mb-4">
          {/* Hero illustration placeholder */}
          <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-white text-sm">Hero Illustration Placeholder</div>
          <h3 className="text-2xl font-semibold text-white mb-2">PATH: {career.title} 🚀</h3>
          <p className="text-white/80">"Why This Fits You..." (Preview text)</p>
        </div>
        <div className="mt-4">
          <p className="text-white/70 text-sm mb-2">Match Score: {career.matchScore}%</p>
          <div className="w-full bg-teal-light/50 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${career.matchScore}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <Button className="mt-6 w-full">▼ Tap to Expand Full Path</Button>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-6 pt-6 border-t border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4">PATH: {career.title} ROUTE</h2>

            {/* WHY THIS FITS YOU */}
            <h3 className="text-lg font-semibold text-white mb-2">WHY THIS FITS YOU:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>You're a natural builder</li>
              <li>Your right-brain sees opportunities</li>
              <li>You hate rigid structures</li>
              <li>You want to CREATE something</li>
            </ul>

            {/* SPECIFIC ROLES */}
            <h3 className="text-lg font-semibold text-white mb-2">SPECIFIC ROLES:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>Tech Startup Founder</li>
              <li>Creative Agency Owner</li>
              <li>Social Entrepreneur</li>
              <li>Digital Product Creator</li>
            </ul>

            {/* YOUR ADVANTAGE */}
            <h3 className="text-lg font-semibold text-white mb-2">YOUR ADVANTAGE:</h3>
            <p className="text-white/90 text-sm mb-4">
              "Right-brain entrepreneurs innovate where left-brain ones optimize. You create products
              people LOVE, not just products that work."
            </p>

            {/* REAL TALK */}
            <h3 className="text-lg font-semibold text-white mb-2">REAL TALK:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>Challenge: Need business fundamentals</li>
              <li>Partner: Find COO/ops person</li>
              <li>Timeline: 2-5 years to profitability</li>
              <li>Risk Level: High (but you hate stability)</li>
              <li>Salary: ₹0-5L Year 1 → ₹50L+ Year 5</li>
            </ul>

            {/* WHAT TO DO NOW */}
            <h3 className="text-lg font-semibold text-white mb-2">WHAT TO DO NOW:</h3>
            <div className="space-y-2 mb-4">
              {renderTaskCheckbox("pick_problem", "Pick ONE problem you're passionate about", "This Week")}
              {renderTaskCheckbox("build_mvp", "Build simple MVP", "This Month")}
              {renderTaskCheckbox("talk_users", "Talk to 10 potential users", "This Month")}
              {renderTaskCheckbox("get_customers", "Get first 10 paying customers", "This Quarter")}
              {renderTaskCheckbox("scale_revenue", "Scale to ₹10L+ revenue", "This Year")}
              {renderTaskCheckbox("build_team", "Build small team", "This Year")}
            </div>
            <p className="text-white/70 text-sm mb-4">Path Progress: {pathProgress}%</p>

            {/* RESOURCES YOU NEED (Placeholders) */}
            <h3 className="text-lg font-semibold text-white mb-2">RESOURCES YOU NEED:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>📚 Courses: Y Combinator Startup School (free)</li>
              <li>📖 Books: "The Lean Startup" - Eric Ries</li>
              <li>👥 Communities: Join startup founder groups</li>
              <li>🎯 People to Follow: @naval (Entrepreneur)</li>
            </ul>

            {/* SKILLS TO BUILD (Placeholders) */}
            <h3 className="text-lg font-semibold text-white mb-2">SKILLS TO BUILD:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>Customer discovery (HIGH)</li>
              <li>MVP development (HIGH)</li>
              <li>Sales & pitching (MEDIUM)</li>
            </ul>

            {/* PROJECTS TO COMPLETE (Placeholders) */}
            <h3 className="text-lg font-semibold text-white mb-2">PROJECTS TO COMPLETE:</h3>
            <ul className="list-disc list-inside text-white/90 text-sm mb-4 space-y-1">
              <li>Build one product from scratch</li>
              <li>Get 100 users/customers</li>
            </ul>

            <Button onClick={handleStartPath} className="w-full mt-4">START THIS PATH</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
