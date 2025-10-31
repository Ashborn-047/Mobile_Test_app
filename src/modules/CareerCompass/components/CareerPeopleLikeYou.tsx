import { motion } from 'framer-motion';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button'; // Import Button component
import { AnimatedAvatarV2 } from '../../Personality/components/AnimatedAvatarV2';
import { gradients } from '../../../theme';

interface FamousPerson {
  name: string;
  emoji: string;
  commonPath: string;
  whySimilar: string;
}

const mockFamousPeople: FamousPerson[] = [
  {
    name: 'Steve Jobs',
    emoji: '🍏',
    commonPath: 'Entrepreneur',
    whySimilar: 'Visionary, creative, disruptor',
  },
  {
    name: 'Elon Musk',
    emoji: '🚀',
    commonPath: 'Innovator',
    whySimilar: 'Driven, ambitious, pushes boundaries',
  },
  {
    name: 'Lady Gaga',
    emoji: '🎤',
    commonPath: 'Creative',
    whySimilar: 'Expressive, artistic, bold',
  },
  {
    name: 'Albert Einstein',
    emoji: '🧠',
    commonPath: 'Thinker',
    whySimilar: 'Curious, analytical, unconventional',
  },
];

export const CareerPeopleLikeYou = () => {
  return (
    <div className="flex overflow-x-auto pb-4 space-x-4">
      {mockFamousPeople.map((person, index) => (
        <motion.div
          key={person.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="min-w-[200px]"
        >
          <Card className="h-full text-center p-4 bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
            <AnimatedAvatarV2 emoji={person.emoji} size="sm" />
            <h3 className="font-semibold text-lg text-dark-teal mt-2">{person.name}</h3>
            <p className="text-gray-700 text-sm">Common path: {person.commonPath}</p>
            <p className="text-gray-600 text-xs mt-1">"{person.whySimilar}"</p>
            <Button variant="secondary" className="mt-4 w-full text-xs" onClick={() => alert(`Showing more about ${person.name}`)}>View Details</Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
