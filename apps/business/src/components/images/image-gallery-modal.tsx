"use client";
import ImageGallery, { type ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { supabaseLoader } from "@/utils/supabase-image-loader";
import { Button } from "@loopearn/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@loopearn/ui/dialog";
import { X } from "@loopearn/ui/icons";
import Image from "next/image";
import styles from "./image-gallery.module.css";

interface ModalProps {
  images: string[];
  onClose?: () => void;
  open: boolean;
  showThumbnail?: boolean;
  closeDialog: () => void;
}

export const ImageGalleryModal = (props: ModalProps) => {
  const { onClose, images, open, ...other } = props;

  const renderItem = (item: ReactImageGalleryItem) => {
    return (
      <div className={styles.image}>
        <Image
          src={item.original}
          alt={item.originalAlt || ""}
          loader={supabaseLoader}
          fill={true}
          loading="lazy"
        />
      </div>
    );
  };

  const renderThumb = (item: ReactImageGalleryItem) => {
    return (
      <Image
        src={item.original}
        alt={item.originalAlt || ""}
        loader={supabaseLoader}
        width={90}
        height={90}
      />
    );
  };

  return (
    <Dialog open={!!open} {...other} onOpenChange={onClose}>
      <DialogHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Property Images</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </DialogHeader>
      <DialogContent className="max-w-screen h-screen min-w-full">
        {images && (
          <ImageGallery
            thumbnailPosition="left"
            autoPlay={false}
            showThumbnails={true}
            showPlayButton={false}
            items={images}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
