import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface UseHeroVideoManagerProps {
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>;
  // activeVideoIndex can be managed internally or passed as prop if controlled from outside
  initialActiveIndex?: number;
}

const useHeroVideoManager = ({ videoRefs, initialActiveIndex = 0 }: UseHeroVideoManagerProps) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(initialActiveIndex);
  const previousVideoIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const videos = videoRefs.current?.filter((el): el is HTMLVideoElement => el !== null) || [];
    if (videos.length === 0) return;

    videos.forEach((video, index) => {
      if (index === activeVideoIndex) {
        if (previousVideoIndexRef.current !== null && previousVideoIndexRef.current !== index) {
          const prevVideo = videos[previousVideoIndexRef.current];
          if (prevVideo) {
            gsap.to(prevVideo, { autoAlpha: 0, duration: 0.5, onComplete: () => prevVideo.pause() });
          }
        }
        gsap.to(video, { autoAlpha: 1, duration: 0.5, delay: 0.1 });
        video.play().catch(error => console.warn("Video play failed:", error)); // Autoplay might be blocked
        previousVideoIndexRef.current = index;
      } else {
        // Ensure other videos are hidden and paused if they were not the previous one
        if (previousVideoIndexRef.current !== index) { // Avoid double-hiding the one that just faded out
            gsap.set(video, { autoAlpha: 0 });
            video.pause();
        }
      }
    });
  }, [activeVideoIndex, videoRefs]);

  const changeActiveVideo = (index: number) => {
    const videos = videoRefs.current?.filter(Boolean) || [];
    if (index >= 0 && index < videos.length && index !== activeVideoIndex) {
        previousVideoIndexRef.current = activeVideoIndex; // Store current before changing
        setActiveVideoIndex(index);
    }
  };

  return { setActiveVideoIndex: changeActiveVideo, currentActiveIndex: activeVideoIndex };
};

export default useHeroVideoManager;
