import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { PencilSimple } from "@phosphor-icons/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { PodcastDashboard } from "@/components/podcast-dashboard";
import { PodcastPlayer } from "@/components/podcast-player";
import { Button } from "@/components/ui/button";

type Podcast = Doc<"podcasts"> & { audioUrl: string | null };

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const topics = useQuery(api.routes.topics.getUserTopics);
  const podcasts = useQuery(api.routes.podcasts.getUserPodcasts);
  const saveTopics = useMutation(api.routes.topics.saveTopics);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [showEditTopics, setShowEditTopics] = useState(false);

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

  const existingTopics = topics.map((t) => ({
    name: t.name,
    sources: t.sources ?? "",
  }));

  return (
    <div>
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 border-b">
        <img
          src="/ascii-art-text.png"
          alt="Morning Brief"
          className="h-8"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEditTopics(true)}
        >
          <PencilSimple className="size-4" />
          Edit Topics
        </Button>
      </header>

      <OnboardingDialog
        open={needsOnboarding || showEditTopics}
        onComplete={async (newTopics) => {
          await saveTopics({ topics: newTopics });
          setShowEditTopics(false);
        }}
        onClose={() => setShowEditTopics(false)}
        existingTopics={showEditTopics ? existingTopics : undefined}
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
