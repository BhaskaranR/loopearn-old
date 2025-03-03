"use client";

import { updateMarketplaceAction } from "@/actions/update-marketplace-action";
import { UppyDropzone } from "@/components/upp-dropzone";
import { env } from "@/env.mjs";
import { supabaseLoader } from "@/utils/supabase-image-loader";
import { createClient } from "@loopearn/supabase/client";
import type { Business } from "@loopearn/supabase/types";
import { Button } from "@loopearn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@loopearn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@loopearn/ui/dropdown-menu";
import { useToast } from "@loopearn/ui/use-toast";
import { Loader2 } from "lucide-react";
import { FileUp, MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { NavigationFooter } from "../../navigation-footer";

interface PhotosFormProps {
  business: Business;
  slug: string;
  redirectTo: string;
}

export function PhotosForm({ slug, business, redirectTo }: PhotosFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<string[]>(business?.profile_photos || []);
  const supabaseClient = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const action = useAction(updateMarketplaceAction);

  const handleUploadComplete = async () => {
    const { data } = await supabaseClient.storage
      .from("images")
      .list(`${business.id}`);

    if (data && data.length > 0) {
      const fileNames = data.map((file) => file.name);
      const images = fileNames.map((file) => ({
        regular: file,
        thumbnail: file,
        small: file,
      }));
      setFiles(fileNames);
      action.execute({
        profile_photos: fileNames,
        slug: slug,
      });
    }
  };

  const handleRemove = async (file: string) => {
    const { error } = await supabaseClient.storage
      .from("images")
      .remove([`${business.id}/${file}`]);

    if (!error) {
      const newFiles = files.filter((_file) => _file !== file);

      action.execute({
        profile_photos: newFiles,
        slug: slug,
      });

      setFiles(newFiles);
    } else {
      toast({
        description: "Error removing image",
        variant: "destructive",
      });
    }
  };

  const handleMakeCover = async (file: string) => {
    const index = files.findIndex((_file) => _file === file);
    const newFiles = [...files];
    newFiles.splice(index, 1);
    newFiles.unshift(file);

    setFiles(newFiles);

    action.executeAsync({
      profile_photos: newFiles,
      slug: slug,
    });
  };

  const handleNext = async () => {
    if (files.length <= 3) {
      toast({
        description: "Add at least 4 images",
        variant: "destructive",
      });

      return;
    }
    setIsSubmitting(true);
    router.push(redirectTo);
  };

  console.log(business.id);

  return (
    <div>
      <div className="flex h-full w-full flex-auto grow flex-col items-start justify-start gap-3 text-left align-middle md:pb-20">
        <div className="mb-100 grid h-[100vh] w-full gap-3  py-20 pb-40  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="border-dotted-2 h-[200px] w-full border md:w-[230px]"
              >
                <FileUp className="mr-2 h-5 w-5 text-muted-foreground" /> Add
                Images
              </Button>
            </DialogTrigger>
            <DialogContent className="h-screen  max-h-screen min-w-full overflow-y-scroll md:h-fit md:min-w-fit">
              <DialogHeader>
                <DialogTitle className="text-md">Add Images</DialogTitle>
              </DialogHeader>
              <UppyDropzone
                supabaseAnonKey={env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                onUploadComplete={handleUploadComplete}
                supabaseStorageURL={env.NEXT_PUBLIC_SUPABASE_UPLOAD_URL}
                storageBucket="images"
                folder={business.id}
                doneButtonHandler={() => setOpen(false)}
              />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {(files || []).map((file, index) => (
            <div
              key={`${business.id}-${file}`}
              className="relative h-[200px] w-full md:w-[220px] lg:h-[200px] lg:w-[220px] xl:h-[200px] xl:w-[230px]"
            >
              <Image
                src={`/images/${business.id}/${file}`}
                loader={supabaseLoader}
                alt="Property Image"
                fill
              />

              {index === 0 && (
                <div className="absolute left-2 top-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1 py-0 text-xs"
                  >
                    Cover Photo
                  </Button>
                </div>
              )}
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full font-semibold  text-black"
                    >
                      <MoreHorizontal strokeWidth={2.25} className="h-4 w-4 " />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50">
                    {index > 0 && (
                      <DropdownMenuItem onClick={() => handleMakeCover?.(file)}>
                        <span>Make cover photo</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleRemove?.(file)}>
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavigationFooter backStep="description" currentStep={3}>
        <Button
          type="button"
          variant="outline"
          className="relative"
          onClick={handleNext}
          disabled={files.length <= 3 || isSubmitting}
        >
          {isSubmitting ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Next"
          )}
        </Button>
      </NavigationFooter>
    </div>
  );
}
