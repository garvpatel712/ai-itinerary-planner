'use client';

import { useEffect, useState } from 'react';

interface BudgetBarItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

interface BudgetBarProps {
  data: BudgetBarItem[];
  isLoading?: boolean;
}

// Skeleton component for loading state
const BudgetBarSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 bg-gray-300 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    ))}
  </div>
);

export default function BudgetBar({ data, isLoading }: BudgetBarProps) {
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect
  useEffect(() => {
    if (isLoading) return;
    
    setIsAnimating(true);
    setAnimatedPercentages(data.map(() => 0));
    
    const timer = setTimeout(() => {
      setAnimatedPercentages(data.map(item => item.percentage));
      setIsAnimating(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [data, isLoading]);

  if (isLoading) {
    return <BudgetBarSkeleton />;
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div 
          key={item.category}
          className={`transition-all duration-500 ease-out ${
            isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          {/* Label and Amount */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                ${item.amount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                backgroundColor: item.color,
                width: `${animatedPercentages[index] || 0}%`,
                transitionDelay: `${index * 100 + 300}ms`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
