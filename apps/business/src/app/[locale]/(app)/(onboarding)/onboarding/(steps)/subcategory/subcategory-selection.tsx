"use client";

import { updateCompanySchema } from "@/actions/schema";
import { updateTeamAction } from "@/actions/update-team-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@loopearn/ui/button";
import { Card } from "@loopearn/ui/card";
import { Form } from "@loopearn/ui/form";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Icons } from "./icons";

const categoriesData = [
  {
    id: 1,
    name: "Professional Services",
    description: "Services offered by professionals.",
    icon: "Wrench",
    categoryId: 1,
  },
  {
    id: 2,
    name: "Personal Services",
    description: "Services for personal needs.",
    icon: "Wrench",
    categoryId: 1,
  },
  {
    id: 3,
    name: "IT and Tech Services",
    description: "Technology and IT services.",
    icon: "Wrench",
    categoryId: 1,
  },
  {
    id: 4,
    name: "Healthcare Services",
    description: "Medical and healthcare services.",
    icon: "Wrench",
    categoryId: 1,
  },
  {
    id: 5,
    name: "Financial Services",
    description: "Financial and banking services.",
    icon: "Wrench",
    categoryId: 1,
  },
  {
    id: 6,
    name: "Retail",
    description: "Retail businesses and shops.",
    icon: "ShoppingBag",
    categoryId: 2,
  },
  {
    id: 7,
    name: "Wholesale",
    description: "Wholesale distribution services.",
    icon: "ShoppingBag",
    categoryId: 2,
  },
  {
    id: 8,
    name: "E-Commerce",
    description: "Online shopping platforms.",
    icon: "ShoppingBag",
    categoryId: 2,
  },
  {
    id: 9,
    name: "Heavy Industry",
    description: "Large-scale industrial operations.",
    icon: "Factory",
    categoryId: 3,
  },
  {
    id: 10,
    name: "Light Industry",
    description: "Small-scale industrial operations.",
    icon: "Factory",
    categoryId: 3,
  },
  {
    id: 11,
    name: "Food and Beverage",
    description: "Food and drink services.",
    icon: "Factory",
    categoryId: 3,
  },
  {
    id: 12,
    name: "Software Development",
    description: "Creating software applications.",
    icon: "Cpu",
    categoryId: 4,
  },
  {
    id: 13,
    name: "Hardware",
    description: "Computer hardware services.",
    icon: "Cpu",
    categoryId: 4,
  },
  {
    id: 14,
    name: "Tech-Enabled Services",
    description: "Services enhanced by technology.",
    icon: "Cpu",
    categoryId: 4,
  },
  {
    id: 15,
    name: "Agriculture",
    description: "Farming and agricultural services.",
    icon: "Wheat",
    categoryId: 5,
  },
  {
    id: 16,
    name: "Natural Resources",
    description: "Exploitation of natural resources.",
    icon: "Wheat",
    categoryId: 5,
  },
  {
    id: 17,
    name: "Agri-Business",
    description: "Agricultural business operations.",
    icon: "Wheat",
    categoryId: 5,
  },
  {
    id: 18,
    name: "Accommodation",
    description: "Lodging and accommodation services.",
    icon: "UtensilsCrossed",
    categoryId: 6,
  },
  {
    id: 19,
    name: "Food and Beverage",
    description: "Dining and food services.",
    icon: "UtensilsCrossed",
    categoryId: 6,
  },
  {
    id: 20,
    name: "Travel Services",
    description: "Travel and tourism services.",
    icon: "UtensilsCrossed",
    categoryId: 6,
  },
  {
    id: 21,
    name: "Event Management",
    description: "Organizing and managing events.",
    icon: "UtensilsCrossed",
    categoryId: 6,
  },
  {
    id: 22,
    name: "Development",
    description: "Real estate development services.",
    icon: "Home",
    categoryId: 7,
  },
  {
    id: 23,
    name: "Brokerage",
    description: "Real estate brokerage services.",
    icon: "Home",
    categoryId: 7,
  },
  {
    id: 24,
    name: "Property Management",
    description: "Managing real estate properties.",
    icon: "Home",
    categoryId: 7,
  },
  {
    id: 25,
    name: "Schools and Colleges",
    description: "Educational institutions.",
    icon: "GraduationCap",
    categoryId: 8,
  },
  {
    id: 26,
    name: "Skill Development",
    description: "Training and skill development.",
    icon: "GraduationCap",
    categoryId: 8,
  },
  {
    id: 27,
    name: "Test Prep and Coaching",
    description: "Preparation and coaching services.",
    icon: "GraduationCap",
    categoryId: 8,
  },
  {
    id: 28,
    name: "Content Production",
    description: "Creating media content.",
    icon: "Film",
    categoryId: 9,
  },
  {
    id: 29,
    name: "Media Platforms",
    description: "Platforms for media distribution.",
    icon: "Film",
    categoryId: 9,
  },
  {
    id: 30,
    name: "Gaming",
    description: "Video game development and services.",
    icon: "Film",
    categoryId: 9,
  },
  {
    id: 31,
    name: "Event Production",
    description: "Producing and managing events.",
    icon: "Film",
    categoryId: 9,
  },
  {
    id: 32,
    name: "Freight and Logistics",
    description: "Transportation and logistics services.",
    icon: "Truck",
    categoryId: 10,
  },
  {
    id: 33,
    name: "Passenger Services",
    description: "Transportation for passengers.",
    icon: "Truck",
    categoryId: 10,
  },
  {
    id: 34,
    name: "Supply Chain Management",
    description: "Managing supply chains.",
    icon: "Truck",
    categoryId: 10,
  },
  {
    id: 35,
    name: "Charities",
    description: "Non-profit charitable organizations.",
    icon: "Heart",
    categoryId: 11,
  },
  {
    id: 36,
    name: "Advocacy Groups",
    description: "Groups advocating for causes.",
    icon: "Heart",
    categoryId: 11,
  },
  {
    id: 37,
    name: "Educational NGOs",
    description: "Non-governmental educational organizations.",
    icon: "Heart",
    categoryId: 11,
  },
  {
    id: 38,
    name: "Fine Arts",
    description: "Artistic and creative services.",
    icon: "Palette",
    categoryId: 12,
  },
  {
    id: 39,
    name: "Crafts",
    description: "Handmade crafts and goods.",
    icon: "Palette",
    categoryId: 12,
  },
  {
    id: 40,
    name: "Design Services",
    description: "Design and creative services.",
    icon: "Palette",
    categoryId: 12,
  },
  {
    id: 41,
    name: "Dining",
    description: "Restaurants and dining services.",
    icon: "MapPin",
    categoryId: 13,
  },
  {
    id: 42,
    name: "Spas",
    description: "Spa and wellness services.",
    icon: "MapPin",
    categoryId: 13,
  },
  {
    id: 43,
    name: "Fitness",
    description: "Fitness and health services.",
    icon: "MapPin",
    categoryId: 13,
  },
  {
    id: 44,
    name: "Electronics",
    description: "Electronic goods and services.",
    icon: "Package",
    categoryId: 14,
  },
  {
    id: 45,
    name: "Fashion",
    description: "Clothing and fashion services.",
    icon: "Package",
    categoryId: 14,
  },
  {
    id: 46,
    name: "Home Essentials",
    description: "Essential goods for the home.",
    icon: "Package",
    categoryId: 14,
  },
  {
    id: 47,
    name: "Vacation Packages",
    description: "Travel and vacation packages.",
    icon: "Plane",
    categoryId: 15,
  },
  {
    id: 48,
    name: "Hotel Stays",
    description: "Hotel accommodation services.",
    icon: "Plane",
    categoryId: 15,
  },
  {
    id: 49,
    name: "Travel Services",
    description: "Travel agency services.",
    icon: "Plane",
    categoryId: 15,
  },
  {
    id: 50,
    name: "Promo Codes",
    description: "Discount codes for shopping.",
    icon: "Ticket",
    categoryId: 16,
  },
  {
    id: 51,
    name: "Discounts for Retailers",
    description: "Retail discount offers.",
    icon: "Ticket",
    categoryId: 16,
  },
  {
    id: 52,
    name: "Yoga Classes",
    description: "Yoga and wellness classes.",
    icon: "Stethoscope",
    categoryId: 17,
  },
  {
    id: 53,
    name: "Nutrition Counseling",
    description: "Diet and nutrition advice.",
    icon: "Stethoscope",
    categoryId: 17,
  },
  {
    id: 54,
    name: "Gym Memberships",
    description: "Memberships for gyms and fitness centers.",
    icon: "Stethoscope",
    categoryId: 17,
  },
  {
    id: 55,
    name: "Wellness Retreats",
    description: "Retreats focused on wellness.",
    icon: "Stethoscope",
    categoryId: 17,
  },
  {
    id: 56,
    name: "Hair Salons",
    description: "Hair styling and salon services.",
    icon: "Sparkles",
    categoryId: 18,
  },
  {
    id: 57,
    name: "Nail Salons",
    description: "Nail care and salon services.",
    icon: "Sparkles",
    categoryId: 18,
  },
  {
    id: 58,
    name: "Skincare Services",
    description: "Skincare and beauty services.",
    icon: "Sparkles",
    categoryId: 18,
  },
  {
    id: 59,
    name: "Makeup Classes",
    description: "Classes for makeup techniques.",
    icon: "Sparkles",
    categoryId: 18,
  },
  {
    id: 60,
    name: "Adventure Tours",
    description: "Tours focused on adventure activities.",
    icon: "Compass",
    categoryId: 19,
  },
  {
    id: 61,
    name: "Concerts",
    description: "Live music and concert events.",
    icon: "Compass",
    categoryId: 19,
  },
  {
    id: 62,
    name: "Theater Shows",
    description: "Live theater performances.",
    icon: "Compass",
    categoryId: 19,
  },
  {
    id: 63,
    name: "Cooking Classes",
    description: "Classes for cooking and culinary skills.",
    icon: "Compass",
    categoryId: 19,
  },
];

export default function SubcategorySelection({
  businessId,
  categoryId,
  tags,
  redirectTo,
}: {
  businessId: string;
  categoryId: number;
  tags: string[];
  redirectTo: string;
}) {
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    tags.map(Number),
  );

  const subCategories = categoriesData.filter(
    (subCategory) => subCategory.categoryId === categoryId,
  );

  const toggleSubCategory = (subCategoryId: number) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId],
    );
    // form.setValue(
    //   "tags",
    //   selectedSubCategories.map((id) => id.toString()),
    // );
  };

  const updateTeam = useAction(updateTeamAction);

  const form = useForm<z.infer<typeof updateCompanySchema>>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      id: businessId.toString(),
      tags: selectedSubCategories.map((id) => id.toString()),
    },
  });

  const handleSubmit = () => {
    updateTeam.execute({
      id: businessId.toString(),
      tags: selectedSubCategories.map((id) => id.toString()),
      redirectTo: redirectTo,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-6 text-left"
      >
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <div className="space-y-4">
            {subCategories.map(({ id, name, description, icon: IconName }) => {
              const Icon = Icons[IconName as keyof typeof Icons];
              return (
                <Card
                  key={id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    selectedSubCategories.includes(id)
                      ? "ring-1 ring-primary shadow-lg"
                      : "hover:bg-accent"
                  }`}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-full p-6 justify-start text-left"
                    onClick={() => toggleSubCategory(id)}
                  >
                    <div className="flex items-center space-x-4">
                      {Icon && (
                        <Icon
                          className={`h-6 w-6 shrink-0 ${
                            selectedSubCategories.includes(id)
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      )}
                      <div>
                        <h3 className="text-base font-medium">{name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Button>
                </Card>
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
