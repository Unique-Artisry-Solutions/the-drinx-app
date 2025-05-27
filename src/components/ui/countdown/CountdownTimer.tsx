
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  title: string;
  description?: string;
  urgencyMessage?: string;
  displayStyle?: Record<string, any>;
  className?: string;
  onExpiry?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title,
  description,
  urgencyMessage,
  displayStyle = {},
  className = "",
  onExpiry
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isExpired) {
          setIsExpired(true);
          onExpiry?.();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isExpired, onExpiry]);

  const getUrgencyColor = () => {
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    if (totalHours <= 2) return 'text-red-600 border-red-200 bg-red-50';
    if (totalHours <= 24) return 'text-orange-600 border-orange-200 bg-orange-50';
    return 'text-blue-600 border-blue-200 bg-blue-50';
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (isExpired) {
    return (
      <Card className={`${className} border-gray-200`}>
        <CardContent className="p-4 text-center">
          <div className="text-gray-500">
            <Timer className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">Event Started</p>
            <p className="text-sm">{title}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${getUrgencyColor()}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Timer className="h-5 w-5" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          
          {description && (
            <p className="text-sm mb-3 opacity-80">{description}</p>
          )}

          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(timeLeft.days)}</div>
              <div className="text-xs opacity-70">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(timeLeft.hours)}</div>
              <div className="text-xs opacity-70">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</div>
              <div className="text-xs opacity-70">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</div>
              <div className="text-xs opacity-70">Seconds</div>
            </div>
          </div>

          {urgencyMessage && (
            <Badge variant="secondary" className="text-xs">
              {urgencyMessage}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
