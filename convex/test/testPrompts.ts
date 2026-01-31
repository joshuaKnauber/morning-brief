"use node";
import "dotenv/config"; // Load .env from convex folder
import "../src/prompts.gen";
import { generateObject, generateText } from "ai";
import { z } from "zod/v4";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { openrouter } from "../lib/ai";
import { reasearchPrompt } from "../src/prompts/research.prompt";
import { summarizePrompt } from "../src/prompts/summarize.prompt";
import { scriptPrompt } from "../src/prompts/script.prompt";
import { titlePrompt } from "../src/prompts/title.prompt";

// Mock Exa results - realistic fake data
const MOCK_EXA_RESULTS = {
  aiTopic: {
    topic: "Latest developments in AI coding assistants",
    results: [
      {
        text: `GitHub Copilot has released version 2.0 with significant improvements. The new version includes multi-file editing capabilities, better context understanding across entire codebases, and a new "workspace agent" feature that can autonomously complete complex tasks. Microsoft reports that developers using Copilot are completing tasks 55% faster on average. The update also introduces voice commands and improved support for 15 additional programming languages. Pricing remains at $10/month for individuals and $19/month for business users.`,
        url: "https://github.blog/copilot-2-release",
        title: "GitHub Copilot 2.0: The Future of AI-Assisted Development",
        publishedData: "2025-01-28",
      },
      {
        text: `Anthropic announced Claude Code, a command-line AI assistant for software development. Unlike browser-based tools, Claude Code runs directly in the terminal and can read, write, and execute code with user permission. Early adopters report significant productivity gains for tasks like debugging, refactoring, and writing tests. The tool integrates with existing development workflows and supports major version control systems.`,
        url: "https://anthropic.com/claude-code-announcement",
        title: "Anthropic Launches Claude Code CLI Tool",
        publishedData: "2025-01-25",
      },
    ],
  },
  cryptoTopic: {
    topic: "Bitcoin and cryptocurrency market trends",
    results: [
      {
        text: `Bitcoin reached $98,500 this week, approaching the psychological $100,000 barrier. Analysts attribute the surge to increased institutional adoption following the approval of spot Bitcoin ETFs. BlackRock's IBIT has accumulated over $15 billion in assets under management. However, some experts warn of potential volatility ahead of the Federal Reserve's next interest rate decision. Trading volumes have increased 40% month-over-month.`,
        url: "https://coindesk.com/bitcoin-approaches-100k",
        title: "Bitcoin Nears $100K Milestone Amid ETF Inflows",
        publishedData: "2025-01-29",
      },
      {
        text: `Ethereum's upcoming "Pectra" upgrade is scheduled for March 2025. The upgrade will increase blob capacity for Layer 2 rollups, potentially reducing transaction fees by up to 50%. Developers are also introducing account abstraction improvements that will simplify wallet interactions for mainstream users. The Ethereum Foundation estimates this could onboard millions of new users who were previously deterred by complexity.`,
        url: "https://ethereum.org/pectra-upgrade",
        title: "Ethereum Pectra Upgrade: What to Expect",
        publishedData: "2025-01-27",
      },
    ],
  },
};

const model = openrouter("tngtech/deepseek-r1t2-chimera:free");

async function testResearchPrompt() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Research Prompt (Query Generation)");
  console.log("=".repeat(60));

  const prompt = reasearchPrompt.toString({
    topicDescription: "Latest developments in AI coding assistants",
    hasSources: true,
    sources: "tech blogs, official company announcements",
  });

  console.log("\n📝 Generated Prompt:\n", prompt.slice(0, 500) + "...\n");

  const { object } = await generateObject({
    model,
    temperature: 0.2,
    schema: z.object({
      queries: z.array(z.string()).describe("Queries to search for"),
    }),
    prompt,
  });

  console.log("✅ Generated Queries:");
  object.queries.forEach((q, i) => console.log(`   ${i + 1}. ${q}`));
  return object.queries;
}

async function testSummarizePrompt() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Summarize Prompt");
  console.log("=".repeat(60));

  const websiteText = MOCK_EXA_RESULTS.aiTopic.results[0].text;
  const prompt = summarizePrompt.toString({ text: websiteText });

  console.log("\n📝 Input text length:", websiteText.length, "chars");

  const { text } = await generateText({
    model,
    temperature: 0.2,
    prompt,
  });

  console.log("✅ Summary:", text);
  return text;
}

async function testScriptPrompt() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Script Prompt (TTS-optimized)");
  console.log("=".repeat(60));

  // Format topics like the real function does
  const topics = [MOCK_EXA_RESULTS.aiTopic, MOCK_EXA_RESULTS.cryptoTopic];

  const formattedTopics = topics
    .map(
      (topic) => `
      Topic: ${topic.topic}
      Results: ${topic.results
        .map(
          (result) => `
        Text: ${result.text}
        URL: ${result.url}
        Title: ${result.title ?? "-"}
        Published Data: ${result.publishedData ?? "-"}
      `
        )
        .join("\n")}
    `
    )
    .join("\n");

  const prompt = scriptPrompt.toString({ formattedTopics });

  console.log("\n📝 Topics:", topics.map((t) => t.topic).join(", "));

  const { text } = await generateText({
    model,
    temperature: 0.2,
    prompt,
  });

  console.log("\n✅ Generated Script:\n");
  console.log("-".repeat(40));
  console.log(text);
  console.log("-".repeat(40));

  // Check for TTS violations
  const violations = [];
  if (text.includes("**") || text.includes("__"))
    violations.push("Contains markdown bold");
  if (text.includes("# ")) violations.push("Contains markdown headers");
  if (text.includes("[") && text.includes("]("))
    violations.push("Contains markdown links");
  if (/\d{4}/.test(text) && !text.includes("twenty"))
    violations.push("May contain unspoken numbers");
  if (text.includes("http://") || text.includes("https://"))
    violations.push("Contains raw URLs");

  if (violations.length > 0) {
    console.log("\n⚠️  TTS Violations detected:");
    violations.forEach((v) => console.log(`   - ${v}`));
  } else {
    console.log("\n✅ No obvious TTS violations detected");
  }

  return text;
}

async function testTitlePrompt(script: string) {
  console.log("\n" + "=".repeat(60));
  console.log("TEST: Title Prompt");
  console.log("=".repeat(60));

  const prompt = titlePrompt.toString({ script });

  const { object } = await generateObject({
    model,
    temperature: 0.2,
    schema: z.object({
      title: z.string().describe("The title of the podcast"),
    }),
    prompt,
  });

  console.log("\n✅ Generated Title:", object.title);
  return object.title;
}

async function generateFullMockPodcast() {
  console.log("\n" + "=".repeat(60));
  console.log("FULL PIPELINE: Mock Podcast Generation");
  console.log("=".repeat(60));

  // Step 1: Use mock Exa results (skip actual search)
  console.log("\n📡 Step 1: Using mock Exa research results...");
  const mockResearchResults = [MOCK_EXA_RESULTS.aiTopic, MOCK_EXA_RESULTS.cryptoTopic];

  // Step 2: Summarize each result (like the real pipeline does)
  console.log("\n📝 Step 2: Summarizing research results...");
  const summarizedTopics = await Promise.all(
    mockResearchResults.map(async (topic) => {
      const summarizedResults = await Promise.all(
        topic.results.map(async (result) => {
          const { text: summary } = await generateText({
            model,
            temperature: 0.2,
            prompt: summarizePrompt.toString({ text: result.text }),
          });
          console.log(`   ✓ Summarized: ${result.title?.slice(0, 40)}...`);
          return {
            ...result,
            text: summary,
          };
        })
      );
      return {
        topic: topic.topic,
        results: summarizedResults,
      };
    })
  );

  // Step 3: Generate script
  console.log("\n🎙️ Step 3: Generating podcast script...");
  const formattedTopics = summarizedTopics
    .map(
      (topic) => `
      Topic: ${topic.topic}
      Results: ${topic.results
        .map(
          (result) => `
        Text: ${result.text}
        URL: ${result.url}
        Title: ${result.title ?? "-"}
        Published Data: ${result.publishedData ?? "-"}
      `
        )
        .join("\n")}
    `
    )
    .join("\n");

  const { text: script } = await generateText({
    model,
    temperature: 0.2,
    prompt: scriptPrompt.toString({ formattedTopics }),
  });

  // Step 4: Generate title
  console.log("\n📌 Step 4: Generating title...");
  const { object: titleObj } = await generateObject({
    model,
    temperature: 0.2,
    schema: z.object({
      title: z.string().describe("The title of the podcast"),
    }),
    prompt: titlePrompt.toString({ script }),
  });

  // Output the full podcast
  console.log("\n" + "=".repeat(60));
  console.log("🎧 GENERATED PODCAST");
  console.log("=".repeat(60));
  console.log(`\n📌 Title: ${titleObj.title}`);
  console.log(`\n📊 Stats:`);
  console.log(`   - Word count: ${script.split(/\s+/).length}`);
  console.log(`   - Character count: ${script.length}`);
  console.log(`   - Estimated duration: ~${Math.round(script.split(/\s+/).length / 150)} min (at 150 wpm)`);

  console.log("\n📜 Full Script:\n");
  console.log("-".repeat(60));
  console.log(script);
  console.log("-".repeat(60));

  // TTS quality check
  console.log("\n🔍 TTS Quality Check:");
  const violations = [];
  if (script.includes("**") || script.includes("__"))
    violations.push("❌ Contains markdown bold");
  if (script.includes("# ")) violations.push("❌ Contains markdown headers");
  if (script.includes("[") && script.includes("]("))
    violations.push("❌ Contains markdown links");
  if (/https?:\/\//.test(script)) violations.push("❌ Contains raw URLs");
  if (/\$\d/.test(script)) violations.push("❌ Contains dollar signs with numbers");
  if (/\d{4}/.test(script)) violations.push("⚠️  Contains 4-digit numbers (may need spoken form)");

  if (violations.length > 0) {
    violations.forEach((v) => console.log(`   ${v}`));
  } else {
    console.log("   ✅ All checks passed - script is TTS-ready!");
  }

  // Save to files
  const outputDir = join(__dirname, "output");
  mkdirSync(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const scriptPath = join(outputDir, `podcast-${timestamp}.txt`);
  const jsonPath = join(outputDir, `podcast-${timestamp}.json`);

  // Save plain text script
  writeFileSync(scriptPath, `${titleObj.title}\n${"=".repeat(titleObj.title.length)}\n\n${script}`);

  // Save JSON with metadata
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        title: titleObj.title,
        script,
        generatedAt: new Date().toISOString(),
        stats: {
          wordCount: script.split(/\s+/).length,
          characterCount: script.length,
          estimatedDurationMinutes: Math.round(script.split(/\s+/).length / 150),
        },
        topics: mockResearchResults.map((t) => t.topic),
        ttsViolations: violations,
      },
      null,
      2
    )
  );

  console.log("\n💾 Saved to:");
  console.log(`   📄 ${scriptPath}`);
  console.log(`   📋 ${jsonPath}`);

  return { title: titleObj.title, script };
}

async function runAllTests() {
  console.log("\n🚀 Starting Prompt Tests with Mock Data\n");
  console.log("Model:", "tngtech/deepseek-r1t2-chimera:free");

  const args = process.argv.slice(2);
  const fullPipeline = args.includes("--full") || args.includes("-f");

  try {
    if (fullPipeline) {
      // Run full podcast generation pipeline
      await generateFullMockPodcast();
    } else {
      // Run individual prompt tests
      // Test 1: Research prompt
      await testResearchPrompt();

      // Test 2: Summarize prompt
      await testSummarizePrompt();

      // Test 3: Script prompt
      const script = await testScriptPrompt();

      // Test 4: Title prompt
      await testTitlePrompt(script);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ All tests completed!");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
