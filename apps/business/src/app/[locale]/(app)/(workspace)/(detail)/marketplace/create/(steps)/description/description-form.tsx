"use client";

import type { marketplaceProfileSchema } from "@/actions/schema";
import { updateMarketplaceAction } from "@/actions/update-marketplace-action";
import AdvancedEditor from "@/components/editor/advanced-editor";
import { defaultEditorContent } from "@/utils/content";
import { isValidJSON } from "@/utils/is-valid-json";
import type { Business } from "@loopearn/supabase/types";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { SubmitButton } from "@loopearn/ui/submit-button";

import { useAction } from "next-safe-action/hooks";
import type { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { z } from "zod";
import { NavigationFooter } from "../../navigation-footer";
export function DescriptionForm({
  className,
  data,
  slug,
  redirectTo,
  ...props
}: {
  className: string;
  slug: string;
  data: Business;
  redirectTo: string;
}) {
  const action = useAction(updateMarketplaceAction);
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    data.profile_bio ? JSON.parse(data.profile_bio) : null,
  );

  const form = useForm<z.infer<typeof marketplaceProfileSchema>>({
    defaultValues: {
      slug: slug,
      profile_bio: data.profile_bio || undefined,
      marketplace_onboarding_step: "photos",
      redirectTo: redirectTo,
    },
  });

  useEffect(() => {
    if (data.profile_bio) {
      return;
    }
    const content = window.localStorage.getItem("novel-content");
    if (content) {
      setInitialContent(JSON.parse(content));
      form.setValue("profile_bio", JSON.stringify(content));
    } else {
      setInitialContent(defaultEditorContent);
      form.setValue("profile_bio", JSON.stringify(defaultEditorContent));
    }
  }, []);

  const onSubmit = async (
    formData: z.infer<typeof marketplaceProfileSchema>,
  ) => {
    await action.execute(formData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleOnChange = (content?: JSONContent | null) => {
    setInitialContent(content);
    const value = content ? JSON.stringify(content) : null;
    form.setValue("profile_bio", value ?? undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  console.log(form.formState.errors);
  console.log(form.formState.isValid);

  if (initialContent === null) {
    return null;
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    >
      <ScrollArea className="h-[calc(100vh-200px)] bg-background" hideScrollbar>
        <Controller
          control={form.control}
          name="profile_bio"
          render={({ field }) => (
            <AdvancedEditor
              initialContent={initialContent}
              onChange={handleOnChange}
            />
            // <Editor
            //   key={data.id}
            //   autoFocus={true}
            //   tabIndex={-1}
            //   initialContent={
            //     isValidJSON(field.value)
            //       ? JSON.parse(field.value as string)
            //       : undefined
            //   }
            //   onChange={handleOnChange}
            //   placeholder="Write something about your property..."
            //   disablePlaceholder
            //   className={cn(
            //     "transition-opacity text-lg",
            //     field.value
            //       ? "opacity-100"
            //       : "opacity-0 group-hover:opacity-100",
            //   )}
            // />
          )}
        />
      </ScrollArea>

      <NavigationFooter backStep="info" currentStep={2}>
        <SubmitButton
          type="submit"
          variant="outline"
          className="relative"
          isSubmitting={action.isExecuting}
          disabled={action.isExecuting}
        >
          Next
        </SubmitButton>
      </NavigationFooter>
    </form>
  );
}
