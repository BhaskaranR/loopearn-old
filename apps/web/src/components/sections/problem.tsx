import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Lock, Users } from "lucide-react";

const problems = [
  {
    title: "Low Customer Retention",
    description:
      "Businesses spend heavily to acquire customers but struggle to keep them engaged and coming back.",
    icon: Users,
  },
  {
    title: "Fragmented Loyalty Tools",
    description: "Managing rewards across different platforms is messy, inconsistent, and hard to scale.",
    icon: Layers,
  },
  {
    title: "Vendor Lock-In",
    description:
      "Proprietary solutions limit flexibility, making it costly and difficult to adapt or switch providers.",
    icon: Lock,
  },
];

export default function Component() {
  return (
    <Section title="Problem" subtitle="The Problems with Traditional Rewards">
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="space-y-4 p-6">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <problem.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
