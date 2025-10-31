import { motion } from 'framer-motion';
import { Card } from '../../../components/Card';

interface Book {
  title: string;
  author: string;
  summary: string;
  link: string;
  coverImage: string; // Placeholder for actual image path
}

const mockReadingList = {
  mustReadFirst: [
    {
      title: 'Range',
      author: 'David Epstein',
      summary: 'Why generalists triumph in a specialized world',
      link: '#',
      coverImage: 'https://via.placeholder.com/60x90/f59e0b/ffffff?text=Book1',
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      summary: 'How today\'s entrepreneurs use continuous innovation',
      link: '#',
      coverImage: 'https://via.placeholder.com/60x90/f59e0b/ffffff?text=Book2',
    },
    {
      title: 'So Good They Can\'t Ignore You',
      author: 'Cal Newport',
      summary: 'Why skills trump passion in the quest for work you love',
      link: '#',
      coverImage: 'https://via.placeholder.com/60x90/f59e0b/ffffff?text=Book3',
    },
  ],
  readNext: [
    {
      title: 'Deep Work',
      author: 'Cal Newport',
      summary: 'Rules for focused success in a distracted world',
      link: '#',
      coverImage: 'https://via.placeholder.com/60x90/f59e0b/ffffff?text=Book4',
    },
  ],
  readEventually: [
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
      summary: 'Timeless principles for personal and professional effectiveness',
      link: '#',
      coverImage: 'https://via.placeholder.com/60x90/f59e0b/ffffff?text=Book5',
    },
  ],
};

export const CareerReadingList = () => {
  return (
    <div className="space-y-8">
      {Object.entries(mockReadingList).map(([category, books]) => (
        <section key={category}>
          <h3 className="text-xl font-bold mb-4 capitalize text-dark-teal">
            {category.replace(/([A-Z])/g, ' $1').trim()}: 
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.a
                key={book.title}
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="block"
              >
                <Card className="h-full flex items-start p-4 bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
                  <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded mr-4 shadow-sm" />
                  <div>
                    <h4 className="font-semibold text-lg text-dark-teal leading-tight">{book.title}</h4>
                    <p className="text-gray-700 text-sm italic">{book.author}</p>
                    <p className="text-gray-600 text-xs mt-1">Why: {book.summary}</p>
                  </div>
                </Card>
              </motion.a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
