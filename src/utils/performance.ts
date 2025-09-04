// Performance monitoring utilities
export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      console.log('Performance Metrics:', {
        'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
        'Total Load Time': navigation.loadEventEnd - navigation.fetchStart,
      });
    }
  }
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadCriticalImages = async () => {
  const criticalImages = [
      './assets/images/home/p1.webp',
  './assets/images/logo/bengal-bay.png',
  ];
  
  try {
    await Promise.all(criticalImages.map(preloadImage));
  } catch (error) {
    console.warn('Failed to preload some images:', error);
  }
}; 