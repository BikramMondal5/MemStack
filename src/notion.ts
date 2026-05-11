import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function saveToNotion(
  memory: string,
  parsed: any
) {
  try {
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },

      properties: {
        Name: {
          title: [
            {
              text: {
                content: "Engineering Memory",
              },
            },
          ],
        },

        Summary: {
          rich_text: [
            {
              text: {
                content: memory.slice(0, 1900),
              },
            },
          ],
        },

        Risk: {
          select: {
            name: parsed.insertions > 20 ? "Medium" : "Low",
          },
        },

        Files: {
          rich_text: [
            {
              text: {
                content: parsed.files
                  .map((f: any) => f.file)
                  .join(", "),
              },
            },
          ],
        },

        Timestamp: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    console.log("\nSaved to Notion successfully.\n");

  } catch (error) {
    console.error("Notion Error:", error);
  }
}
