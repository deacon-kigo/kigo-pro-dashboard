'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { getPersonalizedGreeting } from '@/lib/userProfileUtils';
import { motion } from 'framer-motion';

interface UserGreetingProps {
  showRole?: boolean;
  showWelcomeMessage?: boolean;
  className?: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({
  showRole = false,
  showWelcomeMessage = false,
  className = ''
}) => {
  const { userProfile, role, clientId } = useDemo();
  const greeting = getPersonalizedGreeting(userProfile);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`user-greeting ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1 
        className="text-3xl font-bold text-gray-900 dark:text-white"
        variants={item}
      >
        {greeting}
      </motion.h1>
      
      {showRole && userProfile && (
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mt-1"
          variants={item}
        >
          {userProfile.role} {clientId !== 'default' && `at ${userProfile.businessName}`}
        </motion.p>
      )}
      
      {showWelcomeMessage && (
        <motion.p 
          className="text-sm text-gray-500 dark:text-gray-400 mt-2"
          variants={item}
        >
          {getWelcomeMessage(role)}
        </motion.p>
      )}
    </motion.div>
  );
};

function getWelcomeMessage(role: string): string {
  switch (role) {
    case 'merchant':
      return "Here's what's happening with your business today";
    case 'support':
      return "Here's an overview of your support queue and recent activity";
    case 'admin':
      return "Here's your platform overview and administrative tasks";
    default:
      return "Welcome to your personalized dashboard";
  }
}

export default UserGreeting; 