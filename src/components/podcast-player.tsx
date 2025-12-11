import { useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "@phosphor-icons/react";
import { Doc } from "../../convex/_generated/dataModel";
import { Orb } from "@/components/ui/orb";
import { Button } from "@/components/ui/button";

type Podcast = Doc<"podcasts"> & { audioUrl: string | null };

type PodcastPlayerProps = {
  podcast: Podcast;
  onBack: () => void;
};

export function PodcastPlayer({ podcast, onBack }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4"
        onClick={onBack}
      >
        <ArrowLeft className="size-5" />
        Back
      </Button>

      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        <div className="w-64 h-64">
          <Orb agentState={isPlaying ? "talking" : null} />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{podcast.title}</h1>
          {podcast.duration && (
            <p className="text-sm text-muted-foreground">
              {Math.round(podcast.duration / 60)} min
            </p>
          )}
        </div>

        <Button size="lg" onClick={togglePlay} className="rounded-full size-16">
          {isPlaying ? (
            <Pause className="size-8" weight="fill" />
          ) : (
            <Play className="size-8" weight="fill" />
          )}
        </Button>

        {podcast.audioUrl && (
          <audio
            ref={audioRef}
            src={podcast.audioUrl}
            onEnded={handleEnded}
            className="hidden"
          />
        )}
      </div>
    </div>
  );
}
