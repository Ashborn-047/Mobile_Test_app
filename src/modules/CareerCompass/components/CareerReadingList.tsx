import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { gradients } from '../../../theme';

interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  category: 'MUST_READ_FIRST' | 'READ_NEXT' | 'READ_EVENTUALLY';
  link: string;
  coverImage: string; // Placeholder for now
}

const mockReadingList: Book[] = [
  {
    id: '1',
    title: 'Range',
    author: 'David Epstein',
    summary: 'Generalists thrive in a complex world.',
    category: 'MUST_READ_FIRST',
    link: '#',
    coverImage: 'https://via.placeholder.com/150/09dac6/05352d?text=Range',
  },
  {
    id: '2',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    summary: 'Build without waste, launch fast.',
    category: 'MUST_READ_FIRST',
    link: '#',
    coverImage: 'https://via.placeholder.com/150/09dac6/05352d?text=Lean+Startup',
  },
  {
    id: '3',
    title: 'So Good They Can\'t Ignore You',
    author: 'Cal Newport',
    summary: 'Craftsmanship beats passion in career building.',
    category: 'MUST_READ_FIRST',
    link: '#',
    coverImage: 'https://via.placeholder.com/150/09dac6/05352d?text=So+Good',
  },
  {
    id: '4',
    title: 'Zero to One',
    author: 'Peter Thiel',
    summary: 'Build unique monopolies, not copies.',
    category: 'READ_NEXT',
    link: '#',
    coverImage: 'https://via.placeholder.com/150/09dac6/05352d?text=Zero+to+One',
  },
  {
    id: '5',
    title: 'Deep Work',
    author: 'Cal Newport',
    summary: 'Focus without distraction for powerful results.',
    category: 'READ_NEXT',
    link: '#',
    coverImage: 'https://via.placeholder.com/150/09dac6/05352d?text=Deep+Work',
  },
];

export const CareerReadingList: React.FC = () => {
  const renderBookCard = (book: Book) => (
    <Card key={book.id} className="p-4 bg-gray-50 border-gray-200 text-dark-teal flex items-center space-x-4">
      <img src={book.coverImage} alt={book.title} className="w-16 h-16 object-cover rounded-lg shadow-md" />
      <div>
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-700">{book.author}</p>
        <p className="text-xs text-gray-600 mt-1">{book.summary}</p>
        <a href={book.link} target="_blank" rel="noopener noreferrer" className="text-turquoise text-xs mt-2 inline-block hover:underline">View Book →</a>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4 text-dark-teal">MUST READ FIRST</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReadingList.filter(book => book.category === 'MUST_READ_FIRST').map(renderBookCard)}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-dark-teal">READ NEXT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReadingList.filter(book => book.category === 'READ_NEXT').map(renderBookCard)}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-dark-teal">READ EVENTUALLY</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReadingList.filter(book => book.category === 'READ_EVENTUALLY').map(renderBookCard)}
        </div>
      </div>
      <div className="text-center">
        <Button variant="secondary" onClick={() => alert('Coming soon: Personalized Book Recommendations!')}>
          Suggest More Books for Me
        </Button>
      </div>
    </div>
  );
};
