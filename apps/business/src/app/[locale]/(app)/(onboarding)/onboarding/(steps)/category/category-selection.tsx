"use client";

import { updateCompanySchema } from "@/actions/schema";
import { updateTeamAction } from "@/actions/update-team-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Form } from "@loopearn/ui/form";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Icons } from "./icons";

const categoriesData = [
  { id: 1, name: "Services", icon: "Wrench" },
  { id: 2, name: "Retail and Wholesale", icon: "ShoppingBag" },
  { id: 3, name: "Manufacturing", icon: "Factory" },
  { id: 4, name: "Technology", icon: "Cpu" },
  { id: 5, name: "Agriculture and Natural Resources", icon: "Wheat" },
  { id: 6, name: "Hospitality and Tourism", icon: "UtensilsCrossed" },
  { id: 7, name: "Real Estate", icon: "Home" },
  { id: 8, name: "Education and Training", icon: "GraduationCap" },
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
        className="flex flex-col space-y-6 text-left"
      >
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesData.map((category) => {
              const Icon = Icons[category.icon as keyof typeof Icons];

              return (
                <Button
                  key={category.id}
                  type="button"
                  variant={
                    selectedCategory === category.id.toString()
                      ? "default"
                      : "outline"
                  }
                  className="h-full w-full"
                  onClick={() => handleCategoryChange(category.id.toString())}
                >
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="rounded-md p-2">
                      {Icon && <Icon className="h-10 w-10" />}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <Button
          className="mt-6 w-full"
          type="submit"
          disabled={updateTeam.status === "executing"}
        >
          {updateTeam.status === "executing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Next"
          )}
        </Button>
      </form>
    </Form>
  );
}
