import { useEffect } from 'react';
import { animationState } from '../state';

const DotMatrix = () => {
  useEffect(() => {
    const CONFIG = {
      FADE_SPEED: .05,        
      HOLD_TIME: 2000,       
      CLEANUP_DELAY: 300,   
      MAX_WIDTH: 80,         
      CHAR_SIZE: 4,         
      FONT_SIZE: 6,        
      BRIGHTNESS_LEVELS: [
        { threshold: 240, symbolIndex: 8 },
        { threshold: 220, symbolIndex: 7 },
        { threshold: 190, symbolIndex: 6 },
        { threshold: 160, symbolIndex: 5 },
        { threshold: 130, symbolIndex: 4 },
        { threshold: 100, symbolIndex: 3 },
        { threshold: 70, symbolIndex: 2 },
        { threshold: 40, symbolIndex: 1 },
        { threshold: 0, symbolIndex: 0 }
      ]
    };

    const dotMatrixCache = new Map();
    let currentMatrix = null;
    const brightnessSymbols = ['#', '$', '!', ':', ';', '"', '\'', '~', ' '];
    
    const dotMatrixImages = [
      '/images/boyflower.png',
      '/images/balloon.jpg',
      '/images/flowerthrow.png'
    ];

    function createMatrixElement(imageData, width, height) {
      const matrix = document.createElement('div');
      matrix.className = 'dot-matrix';
      matrix.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: ${width * CONFIG.CHAR_SIZE}px;
        height: ${height * CONFIG.CHAR_SIZE}px;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        line-height: 1;
        white-space: pre;
        letter-spacing: 0;
      `;
      
      const data = imageData.data;
      
      for (let y = 0; y < height; y += 1) {
        const row = document.createElement('div');
        row.style.cssText = `
          display: flex;
          justify-content: flex-start;
          height: ${CONFIG.CHAR_SIZE}px;
        `;
        
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          let symbolIndex = 0;
          for (const level of CONFIG.BRIGHTNESS_LEVELS) {
            if (brightness > level.threshold) {
              symbolIndex = level.symbolIndex;
              break;
            }
          }
          
          const char = document.createElement('div');
          char.textContent = brightnessSymbols[symbolIndex];
          char.style.cssText = `
            width: ${CONFIG.CHAR_SIZE}px;
            height: ${CONFIG.CHAR_SIZE}px;
            font-size: ${CONFIG.FONT_SIZE}px;
            line-height: ${CONFIG.CHAR_SIZE}px;
            display: inline-block;
            text-align: center;
            opacity: 0;
            transition: opacity 0.05s;
          `;
          
          row.appendChild(char);
        }
        matrix.appendChild(row);
      }
      
      return matrix;
    }

    function fadeOutMatrix(matrix) {
      const chars = Array.from(matrix.querySelectorAll('div > div'));
      const shuffledChars = chars.sort(() => Math.random() - 0.5);
      let completed = false;

      shuffledChars.forEach((char) => {
        char.style.transition = 'opacity 0.05s';
      });
      
      if (animationState.isPaused) {
        shuffledChars.forEach(char => {
          char.style.opacity = '0';
        });
        setTimeout(() => {
          if (matrix.parentNode && !completed) {
            matrix.remove();
            completed = true;
          }
        }, 100);
        return;
      }

      shuffledChars.forEach((char, i) => {
        setTimeout(() => {
          char.style.opacity = '0';
        }, i * CONFIG.FADE_SPEED);
      });

      setTimeout(() => {
        if (matrix.parentNode && !completed) {
          matrix.remove();
          completed = true;
        }
      }, chars.length * CONFIG.FADE_SPEED + CONFIG.CLEANUP_DELAY);
    }

    function fadeInMatrix(matrix) {
      if (animationState.isPaused) {
        setTimeout(() => fadeInMatrix(matrix), 100);
        return;
      }

      const chars = Array.from(matrix.querySelectorAll('div > div'));
      const shuffledChars = chars.sort(() => Math.random() - 0.5);
      
      shuffledChars.forEach((char, i) => {
        setTimeout(() => {
          if (!animationState.isPaused) {
            char.style.opacity = '1';
          }
        }, i * CONFIG.FADE_SPEED);
      });
    }

    function showNextMatrix() {
      if (animationState.isPaused) {
        setTimeout(showNextMatrix, 100);
        return;
      }

      const nextImage = dotMatrixImages[currentImageIndex];
      const nextMatrix = dotMatrixCache.get(nextImage).cloneNode(true);
      
      if (currentMatrix && currentMatrix.parentNode) {
        fadeOutMatrix(currentMatrix);
        setTimeout(() => {
          matrixContainer.appendChild(nextMatrix);
          fadeInMatrix(nextMatrix);
          currentMatrix = nextMatrix;
        }, 100);
      } else {
        matrixContainer.appendChild(nextMatrix);
        fadeInMatrix(nextMatrix);
        currentMatrix = nextMatrix;
      }

      currentImageIndex = (currentImageIndex + 1) % dotMatrixImages.length;
      setTimeout(showNextMatrix, CONFIG.HOLD_TIME);
    }

    async function preRenderMatrix(imageSrc) {
      return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        img.onload = function() {
          const scale = CONFIG.MAX_WIDTH / img.width;
          canvas.width = CONFIG.MAX_WIDTH;
          canvas.height = img.height * scale;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const matrix = createMatrixElement(imageData, canvas.width, canvas.height);
          
          dotMatrixCache.set(imageSrc, matrix);
          resolve();
        };
        img.src = imageSrc;
      });
    }

    const matrixContainer = document.createElement('div');
    matrixContainer.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: fit-content;
      height: fit-content;
    `;
    
    function initializeWebsite() {
      let currentImageIndex = 0;

      function showNextMatrix() {
        const nextImage = dotMatrixImages[currentImageIndex];
        const nextMatrix = dotMatrixCache.get(nextImage).cloneNode(true);
        
        if (currentMatrix) {
          fadeOutMatrix(currentMatrix);
        }

        matrixContainer.appendChild(nextMatrix);
        fadeInMatrix(nextMatrix);
        currentMatrix = nextMatrix;

        currentImageIndex = (currentImageIndex + 1) % dotMatrixImages.length;
        setTimeout(showNextMatrix, CONFIG.HOLD_TIME);
      }

      showNextMatrix();
    }

    async function initialize() {
      const mainContent = document.querySelector('.main-content');
      mainContent.appendChild(matrixContainer);
      
      await Promise.all(dotMatrixImages.map(src => preRenderMatrix(src)));
      initializeWebsite();
    }

    initialize();

    return () => {
      if (matrixContainer) {
        matrixContainer.remove();
      }
    };
  }, []);

  return null;
};

export default DotMatrix;