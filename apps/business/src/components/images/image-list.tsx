/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
"use client";
import { supabaseLoader } from "@/utils/supabase-image-loader";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as React from "react";
import PropertyImageCard from "./image-card";

const ImageGalleryModal = dynamic<{
  images: string[];
  onClose?: () => void;
  open: boolean;
  showThumbnail?: boolean;
}>(() => import("./image-gallery-modal").then((mod) => mod.ImageGalleryModal), {
  ssr: false,
});

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

interface IProps {
  images;
  className: string;
}

type converImages = {
  img: string;
  rows?: number;
  cols?: number;
  title?: string;
  showMore?: boolean;
};

export const ImagesList = ({ images, className }: IProps) => {
  const [open, setOpen] = React.useState(false);
  if (!images || images.length === 0) {
    return <div />;
  }

  const items: converImages[] = [
    {
      img: images[0],
      rows: 4,
      cols: 2,
    },
    {
      img: images[1],
    },
    {
      img: images[2],
    },
    {
      img: images[3],
      rows: 3,
      cols: 2,
      showMore: true,
    },
  ];

  const showMore = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="container grid grid-cols-1 grid-rows-2 gap-3 px-0 sm:grid-cols-2 sm:pt-8 md:grid-cols-12 md:gap-3 md:pt-20">
        <PropertyImageCard
          className="col-span-6 row-span-2 h-[410px]"
          image={
            <Image
              {...srcset(items[0].img, 121, items[0].rows, items[0].cols)}
              alt={items[0]?.title || "image"}
              loader={supabaseLoader}
              layout="fill"
              loading="lazy"
            />
          }
        />
        <PropertyImageCard
          className="col-span-3 h-[200px]"
          image={
            <Image
              {...srcset(items[1].img, 121, items[1].rows, items[1].cols)}
              alt={items[1]?.title || "image"}
              loader={supabaseLoader}
              layout="fill"
              loading="lazy"
            />
          }
        />
        <PropertyImageCard
          className="col-span-3 h-[200px]"
          image={
            <Image
              {...srcset(items[2].img, 121, items[2].rows, items[2].cols)}
              alt={items[2]?.title || "image"}
              loader={supabaseLoader}
              layout="fill"
              loading="lazy"
            />
          }
        />

        <PropertyImageCard
          className="col-span-6 row-span-2 h-[200px]"
          showMore={true}
          showGallery={() => setOpen(true)}
          image={
            <Image
              {...srcset(items[3].img, 121, items[3].rows, items[3].cols)}
              alt={items[3]?.title || "image"}
              loader={supabaseLoader}
              layout="fill"
              loading="lazy"
            />
          }
        />
      </div>

      {open && (
        <ImageGalleryModal
          images={images}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
