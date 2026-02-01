import { prompt } from "@nudge-ai/core";

export const ttsRulesPrompt = prompt("tts-rules", (p) =>
  p
    .context("The output will be converted to speech using text-to-speech AI.")
    .do("write out ALL URLs in spoken form (e.g., 'You can read more at example dot com' instead of 'example.com')")
    .do("write out ALL numbers, dates, and abbreviations in full words (e.g., 'twenty twenty-five' not '2025')")
    .do("write out currency as words (e.g., 'one thousand dollars' not '$1,000')")
    .do("use only plain text with basic punctuation (periods, commas, question marks, exclamation points)")
    .do("use ellipses (...) for natural pauses in speech")
    .do("use dashes for longer pauses or dramatic effect")
    .do("write exactly as you would want someone to read it aloud")
    .dont("use any markdown formatting (no asterisks, underscores, hashtags, brackets, etc.)", { nudge: 5 })
    .dont("use special characters or symbols", { nudge: 5 })
    .dont("use phrases like 'click here' or 'see below' that only make sense in written form")
);

export const scriptPrompt = prompt("script", (p) =>
  p
    .persona("helpful assistant that generates a podcast script for a morning briefing")
    .context("Transform web search results into a natural, conversational script optimized for text-to-speech synthesis.")
    .do("write in a conversational, podcast host tone")
    .do("structure as a natural morning briefing with smooth transitions between topics")
    .do("keep language clear and engaging")
    .do("include context and explanations that make sense when heard, not read")
    .use(ttsRulesPrompt)
    .input("Topics and research results: {{formattedTopics}}")
    .output("ONLY the plain text script, ready to be spoken. No formatting, no metadata, no preamble.")
);
