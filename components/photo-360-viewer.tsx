"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { coalesceImageSrc } from "@/lib/image-fallbacks";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Move,
  Info,
} from "lucide-react";

interface Photo360ViewerProps {
  images: string[];
  title?: string;
}

export function Photo360Viewer({ images, title }: Photo360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const totalFrames = images.length > 1 ? images.length : 36;

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoRotate, totalFrames]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setShowInstructions(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 10) {
      const frameChange = deltaX > 0 ? 1 : -1;
      setCurrentFrame(
        (prev) => (prev + frameChange + totalFrames) % totalFrames,
      );
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setShowInstructions(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 10) {
      const frameChange = deltaX > 0 ? 1 : -1;
      setCurrentFrame(
        (prev) => (prev + frameChange + totalFrames) % totalFrames,
      );
      setStartX(e.touches[0].clientX);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setCurrentFrame(0);
    setZoom(1);
    setIsAutoRotate(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Get current image based on frame
  const getCurrentImage = () => {
    if (images.length > 1) {
      return coalesceImageSrc(images[currentFrame % images.length], "listing");
    }
    return coalesceImageSrc(images[0], "listing");
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#2a00ff] rounded-xl overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-video"
      }`}
    >
      {/* 360 Image Display */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `scale(${zoom}) ${images.length === 1 ? `rotateY(${currentFrame * 10}deg)` : ""}`,
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <SafeImage
            src={getCurrentImage()}
            variant="listing"
            alt={title || "360 View"}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2a00ff]/70 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm">
            {Math.round((currentFrame / totalFrames) * 360)}°
          </span>
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="absolute inset-0 bg-[#2a00ff]/35 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <Move className="h-12 w-12 mx-auto mb-3 animate-pulse" />
            <p className="text-lg font-medium">Чирж эргүүлнэ үү</p>
            <p className="text-sm text-white/60">360° харагдац үзэх</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
          onClick={() => setIsAutoRotate(!isAutoRotate)}
        >
          {isAutoRotate ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Title */}
      {title && (
        <div className="absolute top-4 left-4 bg-[#2a00ff]/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-sm font-medium">{title}</p>
        </div>
      )}

      {/* 360 Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
        360°
      </div>

      {/* Help Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 bg-[#2a00ff]/70 hover:bg-[#2300d9]/85 text-white backdrop-blur-sm"
        onClick={() => setShowInstructions(true)}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
}
