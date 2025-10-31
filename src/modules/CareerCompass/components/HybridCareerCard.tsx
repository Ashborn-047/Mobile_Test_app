import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { gradients } from "../../../theme";
import { HybridCareer } from "../utils"; // Corrected path

interface HybridCareerCardProps {
  career: HybridCareer;
}

export const HybridCareerCard = ({ career }: HybridCareerCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Collapsed Card View */}
      <motion.div
        className={`min-w-[200px] h-32 flex flex-col items-center justify-center p-4 rounded-xl shadow-lg cursor-pointer ${gradients.quickActionsCard}`}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(255,255,255,0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <p className="text-4xl">{career.emoji}</p>
        <h3 className="font-semibold text-white mt-2">{career.title}</h3>
        <p className="text-sm text-white/80">{career.combination}</p>
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-dark-teal/70"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="relative z-10 w-full max-w-2xl bg-cream-light rounded-2xl p-8 shadow-xl text-dark-teal overflow-y-auto max-h-[90vh]"
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
                className="absolute top-4 right-4 p-2 text-dark-teal/70 hover:text-dark-teal border-dark-teal/30 hover:border-dark-teal"
              >
                ✕
              </Button>
              <h2 className="text-3xl font-bold mb-4 text-center">
                {career.emoji} {career.title}
              </h2>
              <p className="text-lg text-dark-teal/80 text-center mb-6">
                Your path as a **{career.combination}**
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    How to Combine:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-dark-teal/90">
                    {career.howToCombine.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Potential Income Streams:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-dark-teal/90">
                    {career.incomeStreams.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Lifestyle Benefits:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-dark-teal/90">
                    {career.lifestyleBenefits.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Famous Examples:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {career.examplePeople.map((person, i) => (
                      <Card
                        key={i}
                        className="p-4 bg-gray-50 border-gray-200 text-gray-800"
                      >
                        <p className="font-semibold">{person.name}</p>
                        <p className="text-sm text-gray-600">
                          {person.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
