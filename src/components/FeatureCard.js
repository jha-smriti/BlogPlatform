import React from 'react';

const FeatureCard = ({ imageSrc, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300">
    <img src={imageSrc} alt={title} className="w-16 h-16 mx-auto mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
