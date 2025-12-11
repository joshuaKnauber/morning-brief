import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { PodcastDashboard } from "@/components/podcast-dashboard";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const topics = useQuery(api.routes.topics.getUserTopics);
  const podcasts = useQuery(api.routes.podcasts.getUserPodcasts);
  const saveTopics = useMutation(api.routes.topics.saveTopics);

  const needsOnboarding = topics !== undefined && topics.length === 0;

  if (topics === undefined || podcasts === undefined) {
    return null; // Loading
  }

  return (
    <div>
      <OnboardingDialog
        open={needsOnboarding}
        onComplete={async (newTopics) => {
          await saveTopics({ topics: newTopics });
        }}
      />
      {!needsOnboarding && <PodcastDashboard podcasts={podcasts} />}
    </div>
  );
}
