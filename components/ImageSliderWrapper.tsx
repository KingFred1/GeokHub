"use client";
import ImageSlider from "./ImageSlider";

interface ImageSliderWrapperProps {
  images: Array<{
    asset: any;
    alt?: string;
    caption?: string;
  }>;
  className?: string;
}

export default function ImageSliderWrapper({ images, className = "" }: ImageSliderWrapperProps) {
  return <ImageSlider images={images} className={className} />;
}