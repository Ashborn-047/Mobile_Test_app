import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../src/components/Card";
import { Button } from "../../../../src/components/Button";
import { PersonalityProfileV2, ComparisonResult } from "../types";
import { storage } from "../../../../src/utils/storage";
import { comparePersonalityProfiles } from "../utils";
import { AnimatedAvatarV2 } from "./AnimatedAvatarV2";
// import { ResultsCard } from './ResultsCard'; // This import is not directly used in History.tsx

export const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PersonalityProfileV2[]>([]);
  const [selectedProfile1, setSelectedProfile1] =
    useState<PersonalityProfileV2 | null>(null);
  const [selectedProfile2, setSelectedProfile2] =
    useState<PersonalityProfileV2 | null>(null);
  const [comparisonResults, setComparisonResults] = useState<
    ComparisonResult[] | null
  >(null);

  useEffect(() => {
    const savedHistory =
      storage.get<PersonalityProfileV2[]>("personalityHistory");
    if (savedHistory) {
      setHistory(savedHistory.reverse()); // Show most recent first
    }
  }, []);

  useEffect(() => {
    if (selectedProfile1 && selectedProfile2) {
      setComparisonResults(
        comparePersonalityProfiles(selectedProfile1, selectedProfile2),
      );
    } else {
      setComparisonResults(null);
    }
  }, [selectedProfile1, selectedProfile2]);

  const handleSelectProfile = (profile: PersonalityProfileV2) => {
    if (!selectedProfile1) {
      setSelectedProfile1(profile);
    } else if (!selectedProfile2 && profile.id !== selectedProfile1.id) {
      setSelectedProfile2(profile);
    } else if (profile.id === selectedProfile1.id) {
      setSelectedProfile1(null);
      setSelectedProfile2(null); // Reset if same profile is clicked again
    } else if (selectedProfile2 && profile.id === selectedProfile2.id) {
      setSelectedProfile2(null);
    }
  };

  const renderComparisonIcon = (change: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <span className="text-green-400">▲</span>;
      case "down":
        return <span className="text-red-400">▼</span>;
      case "same":
        return <span className="text-gray-400">—</span>;
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button
        onClick={() => navigate("/personality")}
        variant="secondary"
        className="mb-4"
      >
        ← Back to Profile
      </Button>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">
            Personality History
          </h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">
            Track your growth and compare past profiles
          </p>
        </div>
      </motion.div>

      {history.length === 0 ? (
        <Card className="text-center">
          <p className="text-turquoise/70">
            No personality history found. Take a quiz to get started!
          </p>
          <Button onClick={() => navigate("/personality")} className="mt-4">
            Take Quiz
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {comparisonResults && (
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-turquoise text-center">
                Comparison
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center mb-4 border-b border-turquoise/20 pb-2">
                <p className="text-turquoise/70 text-sm">Trait</p>
                <p className="text-turquoise/70 text-sm flex items-center justify-center gap-2">
                  Before {selectedProfile1?.emoji}
                </p>
                <p className="text-turquoise/70 text-sm flex items-center justify-center gap-2">
                  After{" "}
                  {selectedProfile2 && selectedProfile2.emoji
                    ? selectedProfile2.emoji
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-3">
                {comparisonResults.map((res) => (
                  <div
                    key={res.trait}
                    className="grid grid-cols-3 items-center text-center"
                  >
                    <p className="font-medium text-turquoise">{res.trait}</p>
                    <p className="text-turquoise/80">{res.valueBefore}</p>
                    <p className="flex items-center justify-center gap-2">
                      {renderComparisonIcon(res.change)}
                      <span className="text-turquoise/80">
                        {res.valueAfter}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setSelectedProfile1(null);
                  setSelectedProfile2(null);
                  setComparisonResults(null);
                }}
                className="mt-6 w-full"
                variant="secondary"
              >
                Clear Comparison
              </Button>
            </Card>
          )}

          <h2 className="text-2xl font-semibold mb-4 text-turquoise">
            Past Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {history.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectProfile(profile)}
                  className={`cursor-pointer transform transition-all duration-200
                    ${
                      selectedProfile1?.id === profile.id ||
                      selectedProfile2?.id === profile.id
                        ? "scale-[1.02] ring-2 ring-turquoise/50 shadow-lg"
                        : "hover:scale-[1.01] hover:shadow-md"
                    }
                  `}
                >
                  <Card
                    glow={
                      selectedProfile1?.id === profile.id ||
                      selectedProfile2?.id === profile.id
                    }
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <AnimatedAvatarV2 emoji={profile.emoji} size="sm" />
                        <p className="font-semibold text-xl text-turquoise">
                          {profile.summary.substring(0, 40)}...
                        </p>
                      </div>
                      <p className="text-turquoise/70 text-sm">
                        {new Date(profile.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4 text-right">
                      <span className="text-xs text-turquoise/50">
                        {selectedProfile1?.id === profile.id
                          ? "Selected as BEFORE"
                          : selectedProfile2?.id === profile.id
                            ? "Selected as AFTER"
                            : ""}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
