import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { SAMPLE_PODCAST_EPISODE } from "./samplePodcast";

// Test action to generate a sample podcast episode
export const generateSamplePodcast = action({
  handler: async (ctx): Promise<any> => {
    const result: any = await ctx.runAction(api.generatePodcast.generatePodcastEpisode, {
      title: SAMPLE_PODCAST_EPISODE.title,
      text: SAMPLE_PODCAST_EPISODE.text,
    });

    console.log("Podcast generated successfully!", result);
    return result;
  },
});
