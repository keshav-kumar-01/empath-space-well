
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  backgroundGradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  backgroundGradient 
}) => (
  <div className="feature-card p-8 group hover:scale-105 transition-all duration-500">
    <div className={`w-16 h-16 mx-auto mb-6 ${backgroundGradient} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-inner-glow`}>
      <Icon className={`h-8 w-8 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
    </div>
    <h3 className="text-2xl font-semibold mb-4 text-chetna-dark dark:text-white">{title}</h3>
    <p className="text-muted-foreground dark:text-white/75 text-lg leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
