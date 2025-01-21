"use client";

import { updateCompanyProfileSchema } from "@/actions/schema";
import { updateTeamProfileAction } from "@/actions/update-team-profile-action";
import { CountrySelector } from "@/components/country-selector";
import {
  type AddressDetails,
  SearchAddressInput,
} from "@/components/search-address-input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@loopearn/ui/form";
import { Input } from "@loopearn/ui/input";
import { SubmitButton } from "@loopearn/ui/submit-button";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function UpdateProfileForm({ data, redirectTo }) {
  const isEdit = !!data;

  const createCustomer = useAction(updateTeamProfileAction);

  const form = useForm<z.infer<typeof updateCompanyProfileSchema>>({
    resolver: zodResolver(updateCompanyProfileSchema),
    defaultValues: {
      id: undefined,
      contact_name: undefined,
      city: undefined,
      country: undefined,
      postal_code: undefined,
      state: undefined,
      address_line_1: undefined,
      address_line_2: "",
      revalidatePath: undefined,
      redirectTo,
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        contact_name: data.contact_name,
        redirectTo: redirectTo,
      });
    }
  }, [data]);

  const onSelectAddress = (address: AddressDetails) => {
    form.setValue("address_line_1", address.address_line_1);
    form.setValue("address_line_2", address.address_line_2);
    form.setValue("city", address.city);
    form.setValue("state", address.state);
    form.setValue("country", address.country);
    form.setValue("postal_code", address.zip);
  };

  const { errors, isDirty, isValid } = form.formState;

  // Accessing errors
  console.log("errors", errors); // Object containing all errors

  // Checking if the form is dirty
  console.log("isDirty", isDirty); // True if any field has been changed

  // Checking if the form is valid
  console.log("isValid", isValid); // True if there are no errors

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createCustomer.execute)}
        className="flex w-full flex-col gap-4 text-left"
      >
        <div>
          <div className="space-y-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#878787] font-normal">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            {/* <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-[#878787] font-normal">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="acme.com"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-[#878787] font-normal">
                    Contact person
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SearchAddressInput
              onSelect={onSelectAddress}
              placeholder="Search for an address"
            />

            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-[#878787] font-normal">
                    Address Line 1
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123 Main St"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-[#878787] font-normal">
                    Address Line 2
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Suite 100"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#878787] font-normal">
                      Country
                    </FormLabel>
                    <FormControl>
                      <CountrySelector
                        defaultValue={field.value}
                        onSelect={(code, name) => {
                          field.onChange(name);
                          form.setValue("country", code);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#878787] font-normal">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="New York"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#878787] font-normal">
                      State / Province
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="NY" autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-[#878787] font-normal">
                      ZIP Code / Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="10001"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <SubmitButton
          className="mt-6 w-full"
          isSubmitting={createCustomer.isExecuting}
          disabled={createCustomer.isExecuting}
        >
          {isEdit ? "Update" : "Create"}
        </SubmitButton>
      </form>
    </Form>
  );
}
