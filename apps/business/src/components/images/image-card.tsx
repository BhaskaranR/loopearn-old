/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
"use client";
import { Button } from "@loopearn/ui/button";
import { LazyMotion, domAnimation } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type React from "react";
import Panel from "../layouts/Panel";

const PropertyImageCard = ({
  className,
  image,
  showMore,
  showGallery,
}: {
  image: React.ReactNode;
  className?: string;
  showMore?: boolean;
  showGallery?: () => void;
}) => (
  <LazyMotion features={domAnimation}>
    <div
      className={[
        "group relative w-full inline-flex  gap-5 focus:outline-none focus:border-none focus:ring-brand-600 focus:ring-2 focus:rounded-xl",
        className,
      ].join(" ")}
    >
      <Panel
        hasShimmer
        hasActiveOnHover
        outerClassName="relative  inline-flex w-full h-full shadow-lg p-0"
        innerClassName={[
          `relative  inline-flex overflow-hidden items-center lg:items-center justify-between
            bg-surface-100 w-full rounded-xl h-full`,
        ].join(" ")}
      >
        {image}

        {showMore && (
          <Button
            variant="secondary"
            className="absolute -bottom-1 right-10 mb-3 flex rounded-md"
            onClick={showGallery}
          >
            <MoreHorizontal className="mr-2 h-4 w-4 " /> More Photos
          </Button>
        )}
      </Panel>
    </div>
  </LazyMotion>
);

export default PropertyImageCard;
