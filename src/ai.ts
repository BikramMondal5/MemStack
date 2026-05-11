import Groq from "groq-sdk";

export async function generateEngineeringMemory(
  parsedDiff: any,
  commitMessage = ""
) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = process.env.GROQ_SYSTEM_PROMPT;

    if (!systemPrompt) {
      throw new Error("GROQ_SYSTEM_PROMPT is not configured.");
    }

    const prompt = `${systemPrompt}

Commit Message:
${commitMessage || "Not provided"}

Changed Files:
${parsedDiff.files.map((file: any) => file.file).join(", ") || "None"}

Structured Diff:
${JSON.stringify(parsedDiff, null, 2)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error("Groq Error:", error);

    return "Failed to generate engineering memory.";
  }
}
