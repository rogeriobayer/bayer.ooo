"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TypewriterText = ({
  phrases,
  className = "",
  typingSpeed = 90,
  deletingSpeed = 50,
  pauseTime = 2200,
  cursorClassName = "",
}) => {
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleTyping = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isWaiting) return;

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < currentPhrase.length) {
        setCurrentText(currentPhrase.slice(0, currentText.length + 1));
      } else {
        // Finished typing, wait then start deleting
        setIsWaiting(true);
        setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        setCurrentText(currentPhrase.slice(0, currentText.length - 1));
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [currentText, phraseIndex, isDeleting, isWaiting, phrases, pauseTime]);

  useEffect(() => {
    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [handleTyping, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <span className={className}>
      <span aria-label={phrases.join(", ")}>{currentText}</span>
      <motion.span
        className={`inline-block ml-0.5 text-primary ${cursorClassName}`}
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.55,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        |
      </motion.span>
    </span>
  );
};

export default TypewriterText;
