import { useState } from "react";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Topic = {
  name: string;
  sources: string;
};

type OnboardingDialogProps = {
  open: boolean;
  onComplete: (topics: Topic[]) => void;
};

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicName, setTopicName] = useState("");
  const [sources, setSources] = useState("");

  const handleAddTopic = () => {
    if (!topicName.trim()) return;

    const newTopic: Topic = {
      name: topicName.trim(),
      sources: sources.trim(),
    };

    setTopics([...topics, newTopic]);
    setTopicName("");
    setSources("");
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (topics.length > 0) {
      onComplete(topics);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome! Set up your morning brief</DialogTitle>
          <DialogDescription>
            Add topics you want to follow. For each topic, you can optionally
            specify news sources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Topic name (e.g., AI, Finance)"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <Input
              placeholder="Sources (optional, comma-separated)"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddTopic}
              disabled={!topicName.trim()}
            >
              Add Topic
            </Button>
          </div>

          {topics.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your topics:</p>
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-md border p-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {topic.sources}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-6 w-6"
                      onClick={() => handleRemoveTopic(index)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleComplete}
            disabled={topics.length === 0}
          >
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
