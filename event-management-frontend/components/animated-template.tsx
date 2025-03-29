import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedHeadline = () => {
  // Split text into individual words for animation
  const firstLine = "Experience Unforgettable";
  const secondLine = "Moments";
  
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };
  
  // Animation variants for each word
  const wordVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      rotateX: 45
    },
    visible: { 
      y: 0, 
      opacity: 1,
      rotateX: 0,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  // Animation for the gradient background
  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 70%', '0% 50%'],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  // Create array of words for first line
  const firstLineWords = firstLine.split(' ');
  // Second line as a single element
  
  return (
    <motion.div
      className="relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* First line - word by word animation */}
      <motion.div className="flex flex-wrap justify-center gap-x-4 mb-2">
        {firstLineWords.map((word, index) => (
          <motion.span
            key={`word-${index}`}
            variants={wordVariants}
            className="text-5xl md:text-7xl font-bold inline-block"
            style={{ 
              display: 'inline-block',
              perspective: '1000px'
            }}
          >
            <motion.span
              variants={gradientVariants}
              animate="animate"
              className="bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent inline-block bg-size-200"
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              {word}
            </motion.span>
          </motion.span>
        ))}
      </motion.div>
      
      {/* Second line - special animation for "Moments" */}
      <motion.div 
        className="relative text-5xl md:text-7xl font-bold leading-tight"
        variants={wordVariants}
      >
        <motion.span
          variants={gradientVariants}
          animate="animate"
          className="bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent inline-block bg-size-200 relative"
          style={{
            backgroundSize: '200% 200%'
          }}
        >
          {secondLine}
          <motion.span
            className="absolute -inset-1 rounded-lg opacity-40 blur-xl bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400"
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedHeadline;