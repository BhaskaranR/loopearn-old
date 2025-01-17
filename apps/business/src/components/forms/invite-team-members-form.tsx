import {
  type InviteTeamMembersFormValues,
  inviteTeamMembersSchema,
} from "@/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Form, FormControl, FormField, FormItem } from "@loopearn/ui/form";
import { Icons } from "@loopearn/ui/icons";
import { Input } from "@loopearn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import { Loader2 } from "lucide-react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";

interface InviteTeamMembersFormProps {
  onSubmit: SubmitHandler<InviteTeamMembersFormValues>;
  isSubmitting: boolean;
}

export function InviteTeamMembersForm({
  onSubmit,
  isSubmitting,
}: InviteTeamMembersFormProps) {
  const form = useForm<InviteTeamMembersFormValues>({
    resolver: zodResolver(inviteTeamMembersSchema),
    defaultValues: {
      invites: [
        {
          email: "",
          role: "member",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "invites",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4">
          {fields.map((field, index) => (
            <div
              className="flex items-center justify-between mt-3 space-x-4"
              key={index.toString()}
            >
              <FormField
                control={form.control}
                key={field.id}
                name={`invites.${index}.email`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="jane@example.com"
                        type="email"
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`invites.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            variant="outline"
            type="button"
            className="mt-4 space-x-1"
            onClick={() => append({ email: undefined, role: "member" })}
          >
            <Icons.Add />
            <span>Add more</span>
          </Button>
          <div className="border-t-[1px] pt-4 mt-8 items-center !justify-between">
            <div>
              {Object.values(form.formState.errors).length > 0 && (
                <span className="text-sm text-destructive">
                  Please complete the fields above.
                </span>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Invite"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
