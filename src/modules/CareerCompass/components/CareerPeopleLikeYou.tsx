import { motion } from 'framer-motion';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { AnimatedAvatarV2 } from '../../Personality/components/AnimatedAvatarV2';

interface FamousPerson {
  name: string;
  description: string;
  emoji: string;
}

const mockPeople: FamousPerson[] = [
  {
    name: 'Elon Musk',
    description: 'Visionary entrepreneur & innovator in space, AI, and energy.',
    emoji: '🚀',
  },
  {
    name: 'Oprah Winfrey',
    description: 'Media mogul, philanthropist, and influential talk show host.',
    emoji: '🌟',
  },
  {
    name: 'Steve Jobs',
    description: 'Co-founder of Apple, revolutionized personal computing & mobile.',
    emoji: '🍎',
  },
  {
    name: 'Marie Curie',
    description: 'Pioneering physicist & chemist, first woman to win a Nobel Prize.',
    emoji: '🧪',
  },
];

export const CareerPeopleLikeYou: React.FC = () => {
  return (
    <div className="flex overflow-x-auto pb-4 space-x-4 justify-center">
      {mockPeople.map((person) => (
        <motion.div
          key={person.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-[200px] flex-shrink-0"
        >
          <Card className="p-4 bg-gray-50 border-gray-200 text-center flex flex-col items-center">
            <AnimatedAvatarV2 emoji={person.emoji} size="sm" />
            <h3 className="font-semibold text-lg text-dark-teal mt-2">{person.name}</h3>
            <p className="text-sm text-gray-700 mt-1">{person.description}</p>
            <Button variant="secondary" className="mt-3 text-xs">
              View Full Story →
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
