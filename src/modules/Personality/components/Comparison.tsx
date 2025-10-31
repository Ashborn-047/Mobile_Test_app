import { motion } from "framer-motion";
import { Card } from "../../../../src/components/Card";
import { ComparisonResult } from "../types";

interface ComparisonProps {
  results: ComparisonResult[];
  profile1Emoji: string;
  profile2Emoji: string;
}

export const Comparison = ({
  results,
  profile1Emoji,
  profile2Emoji,
}: ComparisonProps) => {
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
    <Card className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-turquoise text-center">
        Profile Comparison
      </h2>
      <div className="grid grid-cols-3 gap-4 text-center mb-4 border-b border-turquoise/20 pb-2">
        <p className="text-turquoise/70 text-sm">Trait</p>
        <p className="text-turquoise/70 text-sm flex items-center justify-center gap-2">
          Before {profile1Emoji}
        </p>
        <p className="text-turquoise/70 text-sm flex items-center justify-center gap-2">
          After {profile2Emoji}
        </p>
      </div>
      <div className="space-y-3">
        {results.map((res) => (
          <motion.div
            key={res.trait}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-3 items-center text-center"
          >
            <p className="font-medium text-turquoise">{res.trait}</p>
            <p className="text-turquoise/80">{res.valueBefore}</p>
            <p className="flex items-center justify-center gap-2">
              {renderComparisonIcon(res.change)}
              <span className="text-turquoise/80">{res.valueAfter}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
