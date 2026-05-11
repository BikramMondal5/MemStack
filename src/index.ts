import express from "express";
import dotenv from "dotenv";
import axios from "axios";

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

    console.log("\n====== GIT DIFF ======\n");

    console.log(diff);

  } catch (err) {
    console.error(err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});