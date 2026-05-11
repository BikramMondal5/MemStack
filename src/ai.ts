import Groq from "groq-sdk";

export async function generateEngineeringMemory(parsedDiff: any) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are an AI Engineering Memory System.

Analyze the following structured git diff data and generate concise engineering memory.

Structured Diff:
${JSON.stringify(parsedDiff, null, 2)}

Generate:
1. Summary
2. Engineering Impact
3. Risk Level
4. Affected Files
5. Recommended Follow-up

Keep response concise, professional, and useful for future IDE AI agents.
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
