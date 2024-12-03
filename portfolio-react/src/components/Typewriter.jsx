import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { animationState } from '../state';

const Typewriter = forwardRef((props, ref) => {
  const [text, setText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const defaultText = 'DIGITAL PORTFOLIO / 2024';

  const deleteText = (currentText, onComplete) => {
    let currentLength = currentText.length;
    let start = null;
    const duration = 25;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const charsToRemove = Math.floor(progress / duration);
      
      if (charsToRemove <= currentLength) {
        setText(currentText.slice(0, currentLength - charsToRemove));
        requestAnimationFrame(step);
      } else {
        setText('');
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  };

  const typeText = (newText, onComplete) => {
    let start = null;
    const duration = 35;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const charsToAdd = Math.floor(progress / duration);
      
      if (charsToAdd <= newText.length) {
        setText(newText.slice(0, charsToAdd));
        requestAnimationFrame(step);
      } else {
        setText(newText);
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  };

  const changeTo = async (newText) => {
    if (isAnimating || text === newText) return;
    setIsAnimating(true);
    
    animationState.pause();

    return new Promise(resolve => {
      deleteText(text, () => {
        setTimeout(() => {
          typeText(newText, () => {
            setIsAnimating(false);
            animationState.resume();
            resolve();
          });
        }, 150);
      });
    });
  };

  const resetToDefault = () => {
    if (text === defaultText || isAnimating) return;
    changeTo(defaultText);
  };

  useImperativeHandle(ref, () => ({
    changeTo,
    resetToDefault,
    isAnimating: () => isAnimating
  }));

  useEffect(() => {
    typeText(defaultText);
  }, []);

  return (
    <div className="typewriter">
      <div className="font-mono inline-block text-xl relative p-4">
        {text}
        <div 
          className="cursor absolute top-0 h-[1.2em] w-[0.6em] bg-current"
          style={{ 
            left: `${text.length}ch`,
            animation: 'blink 1s step-end infinite'
          }}
        />
      </div>
    </div>
  );
});

Typewriter.displayName = 'Typewriter';

export default Typewriter;