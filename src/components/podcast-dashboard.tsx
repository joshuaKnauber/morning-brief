import { Doc } from "../../convex/_generated/dataModel";

type Podcast = Doc<"podcasts"> & { audioUrl: string | null };

type PodcastDashboardProps = {
  podcasts: Podcast[];
};

export function PodcastDashboard({ podcasts }: PodcastDashboardProps) {
  if (podcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
        <p className="text-muted-foreground">
          Check back tomorrow morning for your first brief.
        </p>
      </div>
    );
  }

  const [latest, ...previous] = podcasts;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Latest podcast - featured */}
      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Latest Brief</p>
          <h2 className="text-2xl font-semibold">{latest.title}</h2>
        </div>
        {latest.audioUrl && (
          <audio controls className="w-full" src={latest.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )}
        {latest.duration && (
          <p className="text-sm text-muted-foreground">
            {Math.round(latest.duration / 60)} min
          </p>
        )}
      </div>

      {/* Previous podcasts */}
      {previous.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Previous Briefs</h3>
          <div className="space-y-3">
            {previous.map((podcast) => (
              <div
                key={podcast._id}
                className="rounded-md border p-4 space-y-2"
              >
                <p className="font-medium">{podcast.title}</p>
                {podcast.audioUrl && (
                  <audio controls className="w-full h-10" src={podcast.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
