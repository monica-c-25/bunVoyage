import fetch from "node-fetch";
import { load } from "cheerio";


//Fetch a recipe from a URL and parse ingredients & instructions.
export async function getRecipeFromUrl(url) {
  try {
    const res = await fetch(url);
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

    return { name: recipe.name || "Recipe", ingredients, instructions };
  } catch (err) {
    throw new Error("Failed to fetch recipe: " + err.message);
  }
}

