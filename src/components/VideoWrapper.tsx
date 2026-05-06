import React from 'react';

interface VideoWrapperProps {
  videoUrl: string; // expected embed URL (player.vimeo.com/video/ID) or any embedable src
  title?: string;
  className?: string;
}

const VideoWrapper: React.FC<VideoWrapperProps> = ({ videoUrl, title, className = '' }) => {
  if (!videoUrl) return null;

  return (
    <div className={`video-wrapper w-full ${className}`} style={{ position: 'relative', paddingTop: '56.25%' }}>
      <iframe
        src={videoUrl}
        title={title || 'Project video'}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default VideoWrapper;