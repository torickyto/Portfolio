import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projects = [
  {
    id: 'village-tech',
    title: 'Village Tech',
    description: 'desc'
  },
  {
    id: 'tcg-simulator',
    title: 'TCG Simulator',
    description: 'desc'
  },
  {
    id: 'cardbuilder',
    title: 'Web-Based Roguelike',
    description: 'desc'
  }
];

const ProjectNav = ({ onProjectSelect }) => {
  const [activeProject, setActiveProject] = useState(null);
  const defaultText = 'DIGITAL PORTFOLIO / 2024';

  const handleProjectClick = async (project) => {
    if (activeProject?.id === project.id) {
      setActiveProject(null);
      await onProjectSelect?.(defaultText);
    } else {
      const textPromise = onProjectSelect?.(project.title);
      setActiveProject(project);
      await textPromise;
    }
  };

  return (
    <div className="project-nav fixed left-2 top-1/3 z-50">
      <div className="flex flex-col gap-48">
        {projects.map((project) => (
          <div key={project.id} className="project-container relative h-8">
            <motion.button
              className={`project-button font-mono text-base ${
                activeProject?.id === project.id ? 'font-bold opacity-100' : 'opacity-70'
              }`}
              onClick={() => handleProjectClick(project)}
              whileHover={{ opacity: 1 }}
              style={{
                transform: 'rotate(-90deg) translateX(-50%)',
                transformOrigin: '0 0',
                whiteSpace: 'nowrap'
              }}
            >
              {project.title}
            </motion.button>

            <AnimatePresence>
              {activeProject?.id === project.id && (
                <motion.div
                  className="description-container fixed top-16 left-1/2 -translate-x-1/2 p-4 w-4/5 max-w-3xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <p className="project-description font-mono text-base leading-relaxed">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectNav;