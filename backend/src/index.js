import express from "express";
import cors from "cors";
import { getRecipeFromUrl } from "./recipeService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recipe", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const recipe = await getRecipeFromUrl(url);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Recipe Translator backend is running!");
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
