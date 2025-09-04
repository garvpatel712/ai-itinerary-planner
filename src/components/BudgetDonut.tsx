'use client';

import { useEffect, useState } from 'react';

interface BudgetItem {
  category: string;
  amount: number;
  color: string;
  icon: string;
}

interface BudgetDonutProps {
  data: BudgetItem[];
  totalBudget: number;
  isLoading?: boolean;
}

// Icons for each category
const CategoryIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const iconComponents = {
    transport: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m4.5 4.5v-3.75m0 3.75h-4.5m0-3.75a2.25 2.25 0 013.375-1.96m-1.875 3.96h4.5a2.25 2.25 0 003.375-1.96m-3.375 1.96V9.75m0 4.5V12a2.25 2.25 0 00-2.25-2.25M9 12.75h3.375a2.25 2.25 0 012.25 2.25M9 12.75l-.879-.879a.75.75 0 01.879-1.05l6.253 3.126a.75.75 0 010 1.348L9 19.19a.75.75 0 01-.879-1.05l.879-.879z" />
      </svg>
    ),
    accommodation: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18h-13.5L4.5 3z" />
      </svg>
    ),
    food: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    ),
    activities: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
  };

  return iconComponents[icon as keyof typeof iconComponents] || null;
};

// Skeleton component for loading state
const BudgetDonutSkeleton = () => (
  <div className="flex flex-col items-center">
    <div className="relative mb-8">
      <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-16 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function BudgetDonut({ data, totalBudget, isLoading }: BudgetDonutProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSpent = data.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  // Animation effect
  useEffect(() => {
    if (isLoading) return;
    
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedValues(data.map(item => item.amount));
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [data, isLoading]);

  if (isLoading) {
    return <BudgetDonutSkeleton />;
  }

  // Calculate angles for donut segments
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = item.amount / total;
    const angle = percentage * 360;
    const segment = {
      ...item,
      percentage: percentage * 100,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      animatedAmount: animatedValues[index] || 0,
    };
    currentAngle += angle;
    return segment;
  });

  // Create SVG path for donut segment
  const createPath = (startAngle: number, endAngle: number, innerRadius = 60, outerRadius = 90) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const x1 = 100 + outerRadius * Math.cos(start);
    const y1 = 100 + outerRadius * Math.sin(start);
    const x2 = 100 + outerRadius * Math.cos(end);
    const y2 = 100 + outerRadius * Math.sin(end);
    
    const x3 = 100 + innerRadius * Math.cos(end);
    const y3 = 100 + innerRadius * Math.sin(end);
    const x4 = 100 + innerRadius * Math.cos(start);
    const y4 = 100 + innerRadius * Math.sin(start);
    
    return [
      "M", x1, y1, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
      "L", x3, y3,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      "Z"
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Donut Chart */}
      <div className="relative mb-8">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="30"
          />
          
          {/* Donut segments */}
          {segments.map((segment, index) => (
            <path
              key={segment.category}
              d={createPath(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              className={`transition-all duration-1000 ease-out ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              of ${totalBudget.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {spentPercentage.toFixed(1)}% used
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {segments.map((segment, index) => (
          <div 
            key={segment.category}
            className={`flex items-center gap-3 transition-all duration-500 ease-out ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            style={{
              transitionDelay: `${index * 150 + 600}ms`,
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: segment.color }}
              >
                <CategoryIcon icon={segment.icon} className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-600 capitalize font-medium">
                {segment.category}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                ${segment.animatedAmount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining Budget */}
      {remainingBudget > 0 && (
        <div className={`mt-4 p-3 bg-green-50 rounded-lg w-full text-center transition-all duration-500 ease-out ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`} style={{ transitionDelay: '1000ms' }}>
          <div className="text-sm text-green-700">
            <span className="font-semibold">${remainingBudget.toLocaleString()}</span> remaining
          </div>
        </div>
      )}
      
      {remainingBudget < 0 && (
        <div className={`mt-4 p-3 bg-red-50 rounded-lg w-full text-center transition-all duration-500 ease-out ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`} style={{ transitionDelay: '1000ms' }}>
          <div className="text-sm text-red-700">
            <span className="font-semibold">${Math.abs(remainingBudget).toLocaleString()}</span> over budget
          </div>
        </div>
      )}
    </div>
  );
}
