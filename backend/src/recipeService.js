import fetch from "node-fetch";
import { load } from "cheerio";
import 'dotenv/config';

// Google Translate helper
async function translateText(text, target = "en") {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY in env");

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      target
    }),
  });

  const data = await res.json();
  if (!data.data || !data.data.translations || !data.data.translations[0]) {
    throw new Error("Translation API failed: " + JSON.stringify(data));
  }

  return data.data.translations[0].translatedText;
}

// Fetch recipe and translate
export async function getRecipeFromUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
    const html = await res.text();
    const $ = load(html);

    let recipe = null;

    // Look for structured data (JSON-LD)
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).html());
        if (Array.isArray(json)) {
          json.forEach(item => {
            if (item["@type"] === "Recipe") recipe = item;
          });
        } else if (json["@type"] === "Recipe") {
          recipe = json;
        }
      } catch (err) {
      }
    });

    if (!recipe) return null;

    const ingredients = recipe.recipeIngredient || [];
    const instructions = Array.isArray(recipe.recipeInstructions)
      ? recipe.recipeInstructions.map(step => step.text || step)
      : [];

    // Translate name, ingredients, instructions
    const translatedName = await translateText(recipe.name || "Recipe");
    const translatedIngredients = await Promise.all(ingredients.map(i => translateText(i)));
    const translatedInstructions = await Promise.all(instructions.map(i => translateText(i)));

    return {
      name: translatedName,
      ingredients: translatedIngredients,
      instructions: translatedInstructions,
    };

  } catch (err) {
    throw new Error("Failed to fetch recipe: " + err.message);
  }
}