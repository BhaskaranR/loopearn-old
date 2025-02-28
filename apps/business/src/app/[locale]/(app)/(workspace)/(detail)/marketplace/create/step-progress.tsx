import { Progress } from "@loopearn/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full relative top-0 left-0 z-50">
      <Progress value={progress} className="rounded-none h-1" />
    </div>
  );
}
