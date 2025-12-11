import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { PodcastDashboard } from "@/components/podcast-dashboard";
import { PodcastPlayer } from "@/components/podcast-player";

type Podcast = Doc<"podcasts"> & { audioUrl: string | null };

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const topics = useQuery(api.routes.topics.getUserTopics);
  const podcasts = useQuery(api.routes.podcasts.getUserPodcasts);
  const saveTopics = useMutation(api.routes.topics.saveTopics);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  const needsOnboarding = topics !== undefined && topics.length === 0;

  if (topics === undefined || podcasts === undefined) {
    return null; // Loading
  }

  if (selectedPodcast) {
    return (
      <PodcastPlayer
        podcast={selectedPodcast}
        onBack={() => setSelectedPodcast(null)}
      />
    );
  }

  return (
    <div>
      <OnboardingDialog
        open={needsOnboarding}
        onComplete={async (newTopics) => {
          await saveTopics({ topics: newTopics });
        }}
      />
      {!needsOnboarding && (
        <PodcastDashboard
          podcasts={podcasts}
          onSelect={setSelectedPodcast}
        />
      )}
    </div>
  );
}
