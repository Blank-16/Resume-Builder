import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../../config/env.js";
import type { ApiResponse, AISuggestResponse } from "../../types/shared.js";

const suggestSchema = z.object({
  field: z.enum(["summary", "experience_description"]),
  context: z.object({
    currentText:         z.string().optional(),
    position:            z.string().optional(),
    company:             z.string().optional(),
    existingExperience:  z.array(z.object({
      position:    z.string(),
      company:     z.string(),
      description: z.string(),
    })).optional(),
    skills: z.array(z.string()).optional(),
  }),
});

function buildPrompt(
  field: "summary" | "experience_description",
  context: z.infer<typeof suggestSchema>["context"]
): string {
  if (field === "summary") {
    const expLines = (context.existingExperience ?? [])
      .slice(0, 3)
      .map((e) => `- ${e.position} at ${e.company}`)
      .join("\n");
    const skillLine = context.skills?.slice(0, 8).join(", ") ?? "";
    return [
      "Write a professional resume summary (2-3 sentences, first person, no filler).",
      expLines ? `Experience:\n${expLines}` : "",
      skillLine ? `Skills: ${skillLine}` : "",
      context.currentText ? `Current draft: ${context.currentText}` : "",
      "Return ONLY the summary text. No preamble, no quotes.",
    ].filter(Boolean).join("\n\n");
  }

  return [
    `Write 3-4 concise resume bullet points for this role (start each with an action verb, quantify impact where possible).`,
    `Position: ${context.position ?? "unknown"}`,
    `Company: ${context.company ?? "unknown"}`,
    context.currentText ? `Current draft: ${context.currentText}` : "",
    "Return ONLY the bullet points, one per line, starting with •. No preamble.",
  ].filter(Boolean).join("\n");
}

export async function suggestContent(req: Request, res: Response): Promise<void> {
  if (!env.openaiKey) {
    res.status(503).json({ message: "AI suggestions are not configured on this server." });
    return;
  }

  const parsed = suggestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { field, context } = parsed.data;
  const prompt = buildPrompt(field, context);

  const baseUrl = env.openaiBaseUrl ?? "https://api.openai.com";
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${env.openaiKey}`,
    },
    body: JSON.stringify({
      model:       env.openaiModel,
      max_tokens:  400,
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a professional resume writing expert. Be concise, specific, and impactful." },
        { role: "user",   content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[AI] Request failed:", response.status, text);
    res.status(502).json({ message: "AI service returned an error. Please try again." });
    return;
  }

  const json = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const suggestion = json.choices[0]?.message?.content?.trim() ?? "";
  if (!suggestion) {
    res.status(502).json({ message: "AI returned an empty response." });
    return;
  }

  res.json({ message: "Suggestion generated", data: { suggestion } } satisfies ApiResponse<AISuggestResponse>);
}
