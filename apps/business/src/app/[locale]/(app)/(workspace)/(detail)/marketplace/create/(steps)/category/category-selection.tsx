"use client";

import { updateCompanySchema } from "@/actions/schema";
import { updateTeamAction } from "@/actions/update-team-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Form } from "@loopearn/ui/form";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { SubmitButton } from "@loopearn/ui/submit-button";
import { ToggleGroup, ToggleGroupItem } from "@loopearn/ui/toggle-group";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { NavigationFooter } from "../../navigation-footer";
import { Icons } from "../subcategory/icons";

const categoriesData = [
  { id: 1, name: "Services", icon: "Wrench" },
  { id: 2, name: "Retail and Wholesale", icon: "ShoppingBag" },
  { id: 3, name: "Manufacturing", icon: "Factory" },
  { id: 4, name: "Technology", icon: "Cpu" },
  { id: 5, name: "Agriculture and Natural Resources", icon: "Wheat" },
  { id: 6, name: "Hospitality and Tourism", icon: "UtensilsCrossed" },
  { id: 7, name: "Real Estate", icon: "Home" },
  { id: 8, name: "Education and Training", icon: "GraduationCap" }, // Updated to match SQL
  { id: 9, name: "Entertainment and Media", icon: "Film" },
  { id: 10, name: "Transportation and Logistics", icon: "Truck" },
  { id: 11, name: "Non-Profit Organizations", icon: "Heart" },
  { id: 12, name: "Arts and Crafts", icon: "Palette" },
  { id: 13, name: "Local Deals", icon: "MapPin" },
  { id: 14, name: "Goods", icon: "Package" },
  { id: 15, name: "Travel", icon: "Plane" },
  { id: 16, name: "Coupons", icon: "Ticket" },
  { id: 17, name: "Educational Services", icon: "BookOpen" }, // Updated to match SQL
  { id: 18, name: "Health & Wellness", icon: "Stethoscope" },
  { id: 19, name: "Beauty", icon: "Sparkles" },
  { id: 20, name: "Experiences", icon: "Compass" }, // Added to match SQL
];

export default function CategorySelection({
  businessId,
  initialCategoryId,
  redirectTo,
}: {
  businessId: string;
  initialCategoryId: string | null;
  redirectTo: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategoryId,
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue("category", categoryId);
  };

  const updateTeam = useAction(updateTeamAction);

  const form = useForm<z.infer<typeof updateCompanySchema>>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      id: businessId.toString(),
      category: selectedCategory,
    },
  });

  const onSubmit = (data: z.infer<typeof updateCompanySchema>) => {
    updateTeam.execute({
      id: data.id,
      category: data.category,
      redirectTo: redirectTo,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-12 text-left"
      >
        <ToggleGroup
          type="single"
          value={selectedCategory}
          onValueChange={(value) => {
            if (value) handleCategoryChange(value);
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categoriesData.map((category) => {
            const Icon = Icons[category.icon as keyof typeof Icons];
            return (
              <ToggleGroupItem
                key={category.id}
                value={category.id.toString()}
                className="h-full w-full transition-all duration-300 data-[state=on]:ring-1 data-[state=on]:ring-primary data-[state=on]:shadow-lg hover:bg-accent"
              >
                <div className="flex flex-col items-center justify-center text-center h-full p-4">
                  <div className="rounded-md p-2">
                    {Icon && (
                      <Icon
                        className={`h-10 w-10 ${
                          selectedCategory === category.id.toString()
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium">{category.name}</h3>
                  </div>
                </div>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        <NavigationFooter backStep="photos" currentStep={4}>
          <SubmitButton
            type="submit"
            variant="outline"
            isSubmitting={updateTeam.status === "executing"}
            disabled={updateTeam.status === "executing"}
          >
            Next
          </SubmitButton>
        </NavigationFooter>
      </form>
    </Form>
  );
}
