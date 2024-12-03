export const animationState = {
    isPaused: false,
    queuedFadeOuts: [],
    
    pause() {
      this.isPaused = true;
    },
    
    resume() {
      this.isPaused = false;
      while (this.queuedFadeOuts.length > 0) {
        const fadeOut = this.queuedFadeOuts.shift();
        fadeOut();
      }
    },
  
    queueFadeOut(fadeOutFn) {
      this.queuedFadeOuts.push(fadeOutFn);
    }
  };