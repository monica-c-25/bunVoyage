// Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchRecipe(url) {
  const res = await fetch(`${BASE_URL}/recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

