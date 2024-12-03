import { useState, useEffect, useRef } from 'react';  
import { AnimatePresence, motion } from 'framer-motion';
import DotMatrix from './components/DotMatrix.jsx';
import Typewriter from './components/Typewriter.jsx';
import ProjectNav from './components/ProjectNav.jsx';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const typewriterRef = useRef(null); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleProjectSelect = (title) => {
    typewriterRef.current?.changeTo(title); 
  };

  return (
    <div className={`h-screen w-screen overflow-hidden ${darkMode ? 'dark-mode' : ''}`}>
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.8 }}
            className="loader-container"
          >
            <div className="loader" />
          </motion.div>
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="main-content visible"
          >
            <nav className="p-2 flex justify-between border-b border-opacity-10">
              <div 
                className="logo text-2xl font-bold"
                onClick={() => typewriterRef.current?.resetToDefault()}  
              >
                MOVING OVER TO REACT
              </div>
              <div className="nav-links">
                <button
                  className="theme-toggle text-xl"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  ◑
                </button>
              </div>
            </nav>

            <Typewriter ref={typewriterRef} />
            <DotMatrix />
            <ProjectNav onProjectSelect={handleProjectSelect} />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;