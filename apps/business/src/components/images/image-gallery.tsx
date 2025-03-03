/* eslint-disable react/no-unescaped-entities */
"use client";
import { supabaseLoader } from "@/utils/supabase-image-loader";
import { Carousel, CarouselContent, CarouselItem } from "@loopearn/ui/carousel";
import { cn } from "@loopearn/ui/cn";
import Image from "next/image";
import React from "react";

interface GalleryProps {
  images: string[];
  className?: string;
}

export const ImageGallery = ({ images, className }: GalleryProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className={cn("w-full max-w-sm", className)}
    >
      <CarouselContent className="md:basis-1/2 lg:basis-1/3">
        {images.map((image) => (
          <CarouselItem
            key={image}
            className="flex aspect-square items-center justify-center p-6"
          >
            <Image
              src={image}
              loader={supabaseLoader}
              className="aspect-[3/4] h-auto w-auto object-cover transition-all hover:scale-105"
              fill
              alt="1"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
