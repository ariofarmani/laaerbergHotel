import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Card from './Card';

interface TestimonialProps {
  author: string;
  avatar?: string;
  content: string;
  rating: number;
  location?: string;
  date?: string;
  className?: string;
  highlight?: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({
  author,
  avatar,
  content,
  rating,
  location,
  date,
  className = '',
  highlight = false,
}) => {
  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(
          <FaStar key={i} className="text-yellow-400" />
        );
      } else if (i - 0.5 === roundedRating) {
        // Half star - we would use a half star icon here but FaStar doesn't have one
        // So we'll simulate it with a smaller star
        stars.push(
          <FaStar key={i} className="text-yellow-400 transform scale-75" />
        );
      } else {
        // Empty star
        stars.push(
          <FaStar key={i} className="text-gray-300" />
        );
      }
    }
    
    return stars;
  };
  
  return (
    <Card 
      className={`
        ${className}
        ${highlight ? 'border-primary shadow-lg' : ''}
        transition-all duration-300 hover:shadow-lg
      `}
      padding={highlight ? 'lg' : 'md'}
    >
      {/* Quote icon */}
      <div className={`
        ${highlight ? 'text-primary' : 'text-gray-200'}
        mb-4
      `}>
        <FaQuoteLeft size={24} />
      </div>
      
      {/* Rating */}
      <div className="flex mb-3">
        {renderStars()}
        {date && (
          <span className="ml-auto text-sm text-gray-500">{date}</span>
        )}
      </div>
      
      {/* Content */}
      <p className="text-gray-700 mb-4">{content}</p>
      
      {/* Author info */}
      <div className="flex items-center mt-auto">
        {avatar ? (
          <div className="mr-3">
            <img 
              src={avatar} 
              alt={author} 
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="mr-3 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{author}</div>
          {location && (
            <div className="text-sm text-gray-500">{location}</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Testimonial;