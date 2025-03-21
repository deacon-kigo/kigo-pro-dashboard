'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { getTimeBasedGreeting, getWelcomeBackMessage } from '@/lib/userProfileUtils';
import { getMockAvatarUrl } from '@/lib/avatarUtils';

interface UserGreetingProps {
  showRole?: boolean;
  showWelcomeMessage?: boolean;
  className?: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({
  showRole = true,
  showWelcomeMessage = false,
  className = ''
}) => {
  const { userProfile } = useDemo();
  const greeting = getTimeBasedGreeting();
  const welcomeMessage = showWelcomeMessage ? getWelcomeBackMessage(userProfile) : null;
  const avatarUrl = getMockAvatarUrl(userProfile);

  return (
    <div className={`user-greeting ${className}`}>
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="avatar h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
          <img 
            src={avatarUrl} 
            alt={`${userProfile.firstName} ${userProfile.lastName}`} 
            className="h-full w-full object-cover" 
          />
        </div>
        
        <div className="user-info">
          {/* Greeting */}
          <h1 className="text-2xl font-bold">
            {greeting}, {userProfile.firstName}!
          </h1>
          
          {/* Role/Title */}
          {showRole && (
            <p className="text-gray-600 dark:text-gray-300">
              {userProfile.title}{userProfile.company !== 'Kigo' ? ` at ${userProfile.company}` : ''}
            </p>
          )}
          
          {/* Welcome Back Message */}
          {showWelcomeMessage && welcomeMessage && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
              {welcomeMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGreeting; 