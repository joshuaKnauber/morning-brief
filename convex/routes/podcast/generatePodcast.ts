"use node";

import { v } from "convex/values";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { action } from "../../_generated/server";
import { internal } from "../../_generated/api";

export const generatePodcastEpisode = action({
  args: {
    title: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args): Promise<{ podcastId: any; storageId: any; message: string }> => {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY is not set in environment variables");
    }

    const client = new ElevenLabsClient({
      apiKey,
    });

    const audioStream = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
      text: args.text,
      modelId: "eleven_monolingual_v1",
    });

    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const storageId = await ctx.storage.store(
      new Blob([audioBuffer], { type: "audio/mpeg" })
    );

    const podcastId = await ctx.runMutation(internal.routes.podcast.podcasts.savePodcast, {
      title: args.title,
      text: args.text,
      audioStorageId: storageId,
    });

    return {
      podcastId,
      storageId,
      message: "Podcast episode generated successfully!",
    };
  },
});
