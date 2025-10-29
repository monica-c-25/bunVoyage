import { useState } from "react";
import RecipeForm from "./components/RecipeForm";
import RecipeDisplay from "./components/RecipeDisplay";
import { fetchRecipe } from "./services/api";
import './App.css';

function App() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (url) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchRecipe(url);
      setRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>BunVoyage</h1>
      <RecipeForm onFetch={handleFetch} />
      {loading && <p>Loading...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
      {recipe && <RecipeDisplay recipe={recipe} />}
    </div>
  );
}

export default App;

