import { motion } from "framer-motion";
import { Card } from "../../../../src/components/Card";
import { PersonalityProfileV2 } from "../types";
import { AnimatedAvatarV2 } from "./AnimatedAvatarV2";

interface ResultsCardProps {
  profile: PersonalityProfileV2;
}

export const ResultsCard = ({ profile }: ResultsCardProps) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <AnimatedAvatarV2 emoji={profile.emoji} size="lg" />
        <div>
          <h2 className="text-2xl font-semibold text-turquoise">
            Your Persona
          </h2>
          <p className="text-turquoise/70 text-sm">
            Generated {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-turquoise/90 leading-relaxed mb-4">
        {profile.summary}
      </p>
      <div className="flex flex-wrap gap-2">
        {profile.traits.map((trait) => (
          <motion.span
            key={trait.trait}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * profile.traits.indexOf(trait) }}
            className="px-4 py-2 bg-turquoise/20 text-turquoise rounded-full text-sm font-medium border border-turquoise/40"
          >
            {trait.trait}: {trait.value}
          </motion.span>
        ))}
      </div>
    </Card>
  );
};
