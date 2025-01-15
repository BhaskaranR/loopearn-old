import { createBusinessAction } from "@/actions/create-team-action";
import { createBusinessSchema } from "@/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@loopearn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { InfoTooltip } from "@loopearn/ui/tooltip";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

async function checkSlugUnique(slug: string) {
  const response = await fetch(`/api/business/exists?slug=${slug}`);
  const data = await response.json();
  return !data.exists;
}

type Props = {
  onOpenChange: (isOpen: boolean) => void;
};

export function CreateTeamModal({ onOpenChange }: Props) {
  const createBusiness = useAction(createBusinessAction, {
    onSuccess: () => onOpenChange(false),
  });

  const form = useForm<z.infer<typeof createBusinessSchema>>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: "",
      slug: "",
      redirectTo: "/",
    },
  });

  function onSubmit(values: z.infer<typeof createBusinessSchema>) {
    createBusiness.execute({
      name: values.name,
      slug: values.slug,
    });
  }

  return (
    <DialogContent className="max-w-[455px]">
      <div className="p-4 space-y-4 gap-4">
        <DialogHeader>
          <DialogTitle>Create business</DialogTitle>
          <DialogDescription>
            For example, you can use the name of your company.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 text-left"
          >
            <div>
              <label htmlFor="name" className="flex items-center space-x-2">
                <p className="block text-sm font-medium text-gray-700">
                  Business Name
                </p>
                <InfoTooltip
                  content={`This is the name of your business on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
                />
              </label>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        className="mt-2 block w-full"
                        placeholder="Acme, Inc."
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <label htmlFor="slug" className="flex items-center space-x-2">
                <p className="block text-sm font-medium text-gray-700">
                  Business Slug
                </p>
                <InfoTooltip
                  content={`This is your business's unique slug on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
                />
              </label>

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative mt-2 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-5 text-gray-500 sm:text-sm">
                          app.{process.env.NEXT_PUBLIC_APP_DOMAIN}
                        </span>
                        <Input
                          {...field}
                          className="rounded-l-none"
                          onBlur={async () => {
                            const unique = await checkSlugUnique(field.value);
                            if (!unique) {
                              form.setError("slug", {
                                message: "Slug is not unique",
                              });
                            }
                          }}
                        />
                        {form.formState.errors.slug && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <AlertCircle
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={createTeam.status === "executing"}
              className="w-full"
            >
              {createTeam.status === "executing" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Team"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
