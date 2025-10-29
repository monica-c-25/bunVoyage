export default function RecipeDisplay({ recipe }) {
  return (
    <div>
      <h2>{recipe.name}</h2>

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
    </div>
  );
}
