import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { parseGitDiff } from "./parser";
import { generateEngineeringMemory } from "./ai";
import { saveToNotion } from "./notion";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Webhook received");

  const before = req.body.before;
  const after = req.body.after;

  const repo = req.body.repository.full_name;

  console.log("Before:", before);
  console.log("After:", after);

  try {
    const diffResponse = await axios.get(
      `https://api.github.com/repos/${repo}/compare/${before}...${after}`,
      {
        headers: {
          Accept: "application/vnd.github.v3.diff",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const diff = diffResponse.data;
    const parsed = parseGitDiff(diff);

    console.log("\n====== PARSED DIFF ======\n");

    console.log(parsed);

    const memory = await generateEngineeringMemory(parsed);

    console.log("\n====== ENGINEERING MEMORY ======\n");

    console.log(memory);

    await saveToNotion(memory || "", parsed);

  } catch (err) {
    console.error(err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
