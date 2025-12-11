import { Doc } from "../../convex/_generated/dataModel";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

type Podcast = Doc<"podcasts"> & { audioUrl: string | null };

type PodcastDashboardProps = {
  podcasts: Podcast[];
  onSelect: (podcast: Podcast) => void;
};

export function PodcastDashboard({
  podcasts,
  onSelect,
}: PodcastDashboardProps) {
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
      <div
        className="rounded-lg border p-6 space-y-2 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onSelect(latest)}
      >
        <p className="text-sm text-muted-foreground">Latest Brief</p>
        <h2 className="text-2xl font-semibold">{latest.title}</h2>
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
          <ItemGroup className="rounded-lg border divide-y">
            {previous.map((podcast) => (
              <Item
                key={podcast._id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => onSelect(podcast)}
              >
                <ItemContent>
                  <ItemTitle>{podcast.title}</ItemTitle>
                  {podcast.duration && (
                    <ItemDescription>
                      {Math.round(podcast.duration / 60)} min
                    </ItemDescription>
                  )}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      )}
    </div>
  );
}
