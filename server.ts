import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  // Will use process.env.GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Endpoint 1: Evaluate Writing Task
  app.post("/api/evaluate-writing", async (req, res) => {
    try {
      const { writingText, topic } = req.body;

      if (!writingText || !topic) {
        return res.status(400).json({ error: "Missing writingText or topic" });
      }

      if (!apiKey) {
        // Fallback for visual elegance even if key is missing during initial local setup
        console.warn("GEMINI_API_KEY is not defined. Using mock evaluation.");
        return res.json({
          estimated_band: 6.5,
          strength: "Good paragraph coherence",
          weakness: "Repetitive word choices",
          feedback: "Your paragraph introduces the topic well. To reach band 7.0+, try substituting simpler verbs with more academic alternatives and vary your structure."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Topic: ${topic}\n\nStudent's Writing Sample (2-3 sentences):\n"${writingText}"\n\nEvaluate this quick writing task for IELTS.`,
        config: {
          systemInstruction: "You are an official IELTS writing examiner. Given a short 2-3 sentence introductory or argument sample, estimate an overall Band Score (between 5.0 and 9.0 in steps of 0.5), and analyze its strength and weakness in the Lexical Resource and Grammatical Range categories. You must respond in the specified JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimated_band: {
                type: Type.NUMBER,
                description: "Estimated IELTS writing band score, from 5.0 to 9.0 in 0.5 increments."
              },
              strength: {
                type: Type.STRING,
                description: "A clear, concise strength of this sample (under 12 words)."
              },
              weakness: {
                type: Type.STRING,
                description: "A clear, actionable weakness of this sample (under 12 words)."
              },
              feedback: {
                type: Type.STRING,
                description: "Brief professional examiner feedback explaining the band and how to improve (1-2 sentences)."
              }
            },
            required: ["estimated_band", "strength", "weakness", "feedback"]
          }
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Error in evaluate-writing:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate writing sample." });
    }
  });

  // API Endpoint 2: Generate Study Plan
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { name, targetBand, currentBand, gap, daysRemaining, strength, weakness } = req.body;

      if (!apiKey) {
        return res.json({
          title: "Your High-Impact IELTS Study Plan",
          day1: {
            title: "Day 1: Expand Vocabulary Range",
            tasks: [
              "Review common synonyms for your weakest word types.",
              "Rewrite your snapshot sentence using 3 higher-level academic words.",
              "Practice writing 2 introductions under a strict 3-minute timer."
            ]
          },
          day2: {
            title: "Day 2: Master Complex Grammar Templates",
            tasks: [
              "Formulate 3 complex/compound sentences using although, whereas, or despite.",
              "Practice writing coherent paragraph transitions.",
              "Submit a short 3-sentence response and self-correct grammatical slips."
            ]
          },
          day3: {
            title: "Day 3: Speed, Strategy, and Review",
            tasks: [
              "Simulate an official Task 2 timing breakdown (40 minutes total).",
              "Execute a rapid structural outline of a brand new writing prompt.",
              "Check your final practice against standard coherence and cohesion keys."
            ]
          },
          finalAdvice: "Stay focused! You only need to bridge a small gap to achieve your target."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Student Name: ${name || "Candidate"}
Target Band Score: ${targetBand}
Estimated Current Band Score: ${currentBand}
Days Until Exam: ${daysRemaining}
Writing Strength: ${strength}
Writing Weakness: ${weakness}
Estimated Score Gap: ${gap} band points.`,
        config: {
          systemInstruction: "You are an expert IELTS prep coach. Generate a high-yield, extremely practical 3-day study plan specifically designed to close the gap and address the student's weakness. The study plan must have 3 days, with exactly 3 concise, highly actionable bullet points per day. Output ONLY in the specified JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              day1: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "tasks"]
              },
              day2: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "tasks"]
              },
              day3: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "tasks"]
              },
              finalAdvice: { type: Type.STRING }
            },
            required: ["title", "day1", "day2", "day3", "finalAdvice"]
          }
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Error in generate-plan:", error);
      res.status(500).json({ error: error.message || "Failed to generate study plan." });
    }
  });

  // Serve static assets and configure SPA routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
