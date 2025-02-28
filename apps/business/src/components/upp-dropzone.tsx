import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard, DragDrop, FileInput, ProgressBar } from "@uppy/react";
import Tus from "@uppy/tus";
import Webcam from "@uppy/webcam";
/* eslint-disable */
import React, { useEffect, useState } from "react";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/file-input/dist/style.css";
import "@uppy/progress-bar/dist/style.css";
import "@uppy/image-editor/dist/style.css";
import { useMediaQuery } from "usehooks-ts";

interface IProps {
  supabaseStorageURL: string;
  storageBucket: string;
  folder: string;
  supabaseAnonKey: string;
  onUploadComplete: () => void;
  doneButtonHandler?: () => void;
}

export const UppyDropzone = ({
  supabaseStorageURL,
  storageBucket,
  folder,
  supabaseAnonKey,
  onUploadComplete,
  doneButtonHandler,
}: IProps) => {
  const [uppy, setUppy] = useState<Uppy>();
  const mdUp = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (!supabaseStorageURL) return;
    const up = new Uppy({
      restrictions: {
        allowedFileTypes: ["image/*"],
      },
      onBeforeFileAdded: (file) => {
        const name = `${Date.now()}_${file.name}`;
        Object.defineProperty(file.data, "name", {
          writable: true,
          value: name,
        });
        return { ...file, name, meta: { ...file.meta, name } };
      },
    })
      .use(ImageEditor, {
        id: "ImageEditor",
        quality: 0.8,
      })
      .use(Tus, {
        endpoint: supabaseStorageURL,
        headers: {
          authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        allowedMetaFields: [
          "bucketName",
          "objectName",
          "contentType",
          "cacheControl",
        ],
      });
    up.on("file-added", (file) => {
      console.log(`${folder}/${file.name}`);
      const supabaseMetadata = {
        bucketName: storageBucket,
        objectName: folder ? `${folder}/${file.name}` : file.name,
        contentType: file.type,
      };
      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };
    });

    up.on("complete", (result) => {
      onUploadComplete();
      // console.log('Upload complete! We’ve uploaded these files:', result.successful)
    });

    setUppy(up);

    return () => {
      if (uppy) uppy.close();
    };
  }, [supabaseStorageURL]);

  if (!uppy) return null;

  if (!mdUp) {
    return (
      <Dashboard
        uppy={uppy}
        height={350}
        width={340}
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          alignSelf: "start",
        }}
        onEnded={(e) => {
          console.log("Ended", e);
        }}
        plugins={["FileInput", "ProgressBar", "ImageEditor"]}
        showProgressDetails={true}
        proudlyDisplayPoweredByUppy={false}
        theme="light"
        doneButtonHandler={doneButtonHandler}
        metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
      />
    );
  }

  return (
    <Dashboard
      uppy={uppy}
      height={420}
      plugins={["FileInput", "ProgressBar", "ImageEditor"]}
      showProgressDetails={true}
      proudlyDisplayPoweredByUppy={false}
      theme="light"
      doneButtonHandler={doneButtonHandler}
      metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
    />
  );
};
