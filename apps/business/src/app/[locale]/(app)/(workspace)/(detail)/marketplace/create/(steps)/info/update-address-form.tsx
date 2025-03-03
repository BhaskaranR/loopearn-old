"use client";

import { addMarketplaceAddressAction } from "@/actions/add-marketplace-address";
import {
  type UpdateAddressFormValues,
  type addMarketplaceAddressSchema,
  updateAddressSchema,
} from "@/actions/schema";
import { CountrySelector } from "@/components/country-selector";
import {
  type AddressDetails,
  SearchAddressInput,
} from "@/components/search-address-input";
import { zodResolver } from "@hookform/resolvers/zod";
import countries from "@loopearn/location/country-flags";
import type { Business, BusinessAddress } from "@loopearn/supabase/types";
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
import { useForm } from "react-hook-form";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import type { z } from "zod";
import { NavigationFooter } from "../../navigation-footer";

export function UpdateAddressForm({
  business,
  address: initialData,
  slug,
  redirectTo,
}: {
  business: Business;
  address: BusinessAddress;
  slug: string;
  redirectTo: string;
}) {
  const action = useAction(addMarketplaceAddressAction);

  const form = useForm<UpdateAddressFormValues>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      business_id: business.id,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
      city: initialData?.city || business.city,
      country: initialData?.country || business.country,
      postal_code: initialData?.postal_code || business.postal_code,
      state: initialData?.state || business.state,
      address_line_1: initialData?.address_line_1 || business.address_line_1,
      address_line_2: initialData?.address_line_2 || business.address_line_2,
      slug: slug,
      marketplace_onboarding_step: "description",
      redirectTo,
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSelectAddress = async (address: AddressDetails) => {
    form.setValue("address_line_1", address.address_line_1);
    form.setValue("address_line_2", address.address_line_2 || "");
    form.setValue("city", address.city);
    form.setValue("state", address.state);
    form.setValue("postal_code", address.zip);

    if (address.country) {
      const countryCode = Object.values(countries).find(
        (country) => country.name === address.country,
      )?.code;
      form.setValue("country", countryCode || "US");
    }
    // Construct full address string for geocoding
    const fullAddress =
      `${address.address_line_1} ${address.address_line_2 || ""} ${address.city} ${address.state} ${address.zip}`.trim();

    try {
      const results = await getGeocode({ address: fullAddress });
      const { lat, lng } = await getLatLng(results[0]!);

      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleSubmit = (data: z.infer<typeof addMarketplaceAddressSchema>) => {
    action.execute({
      ...(data as z.infer<typeof addMarketplaceAddressSchema>),
      redirectTo: `${redirectTo}?slug=${slug}`,
    });
  };

  const { errors, isDirty, isValid } = form.formState;
  console.log("errors", errors);
  console.log("isDirty", isDirty);
  console.log("isValid", isValid);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4 text-left"
      >
        <div>
          <div className="space-y-2">
            <SearchAddressInput
              onSelect={onSelectAddress}
              placeholder="Search for an address"
            />

            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs  font-normal">
                    Address Line 1
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123 Main St"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs  font-normal">
                    Address Line 2{" "}
                    <span className="text-muted-foreground">(optional)</span>
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
                    <FormLabel className="text-xs  font-normal">
                      Country
                    </FormLabel>
                    <FormControl>
                      <CountrySelector
                        defaultValue={field.value || ""}
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
                    <FormLabel className="text-xs  font-normal">City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="New York"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel className="text-xs  font-normal">
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
                    <FormLabel className="text-xs  font-normal">
                      ZIP Code / Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="10001"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <NavigationFooter backStep="welcome" currentStep={1}>
          <SubmitButton
            variant="outline"
            isSubmitting={action.isExecuting}
            disabled={action.isExecuting}
          >
            Next
          </SubmitButton>
        </NavigationFooter>
      </form>
    </Form>
  );
}
