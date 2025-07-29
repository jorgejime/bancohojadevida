import React from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, children, footer }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
    {footer && (
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        {footer}
      </div>
    )}
  </div>
);

export default Card;
