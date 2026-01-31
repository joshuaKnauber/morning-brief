"use node";

import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";

/**
 * Google Cloud Text-to-Speech Configuration
 *
 * Voice Options:
 * - en-US-Journey-F: Female, conversational, latest neural voice (recommended)
 * - en-US-Journey-D: Male, conversational, latest neural voice
 * - en-US-Neural2-F: Female, high-quality neural voice
 * - en-US-Neural2-D: Male, high-quality neural voice
 * - en-US-Studio-O: Female, premium quality (Studio voices)
 * - en-US-Studio-M: Male, premium quality (Studio voices)
 *
 * See: https://cloud.google.com/text-to-speech/docs/voices
 */
const TTS_CONFIG = {
  VOICE: {
    LANGUAGE_CODE: "en-US" as const,
    NAME: "en-US-Journey-F" as const,
  },

  AUDIO: {
    ENCODING: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
    MIME_TYPE: "audio/mpeg" as const,
    PITCH: 0,
    SPEAKING_RATE: 1.0,
    VOLUME_GAIN_DB: 0,
  },
} as const;

export const generatePodcastEpisode = internalAction({
  args: {
    title: v.string(),
    text: v.string(),
    userId: v.id("users"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ podcastId: any; storageId: any; message: string }> => {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (!credentialsJson) {
      throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS_JSON is not set in environment variables",
      );
    }

    const credentials = JSON.parse(credentialsJson);

    const client = new TextToSpeechClient({
      credentials,
    });

    const [response] = await client.synthesizeSpeech({
      input: { text: args.text },
      voice: {
        languageCode: TTS_CONFIG.VOICE.LANGUAGE_CODE,
        name: TTS_CONFIG.VOICE.NAME,
      },
      audioConfig: {
        audioEncoding: TTS_CONFIG.AUDIO.ENCODING,
        pitch: TTS_CONFIG.AUDIO.PITCH,
        speakingRate: TTS_CONFIG.AUDIO.SPEAKING_RATE,
        volumeGainDb: TTS_CONFIG.AUDIO.VOLUME_GAIN_DB,
      },
    });

    if (!response.audioContent) {
      throw new Error("No audio content received from Google TTS");
    }

    const audioBuffer = typeof response.audioContent === 'string'
      ? new Uint8Array(Buffer.from(response.audioContent, 'binary'))
      : new Uint8Array(response.audioContent);
    const storageId = await ctx.storage.store(
      new Blob([audioBuffer], { type: TTS_CONFIG.AUDIO.MIME_TYPE }),
    );

    const podcastId = await ctx.runMutation(
      internal.routes.podcast.podcasts.savePodcast,
      {
        title: args.title,
        text: args.text,
        audioStorageId: storageId,
        userId: args.userId,
      },
    );

    return {
      podcastId,
      storageId,
      message: "Podcast episode generated successfully!",
    };
  },
});
