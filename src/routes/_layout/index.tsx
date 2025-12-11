import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OnboardingDialog } from "@/components/onboarding-dialog";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const saveTopics = useMutation(api.routes.topics.saveTopics);

  return (
    <div>
      <OnboardingDialog
        open={showOnboarding}
        onComplete={async (topics) => {
          await saveTopics({ topics });
          setShowOnboarding(false);
        }}
      />
    </div>
  );
}
