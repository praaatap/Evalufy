import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <div
    className="feature-card p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    {icon}
    {/* REPLACED Tailwind colors with semantic classes */}
    <h3 className="card-title text-lg sm:text-xl font-semibold mb-2">{title}</h3>
    <p className="card-description text-sm sm:text-base">{description}</p>
  </div>
);

export default FeatureCard;