import { useState } from "react";

export default function RecipeForm({ onFetch }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onFetch(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter recipe URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Fetch Recipe</button>
    </form>
  );
}