import Recipe from './Recipe.jsx'

function RecipesList({recipesList}) {
  return (
    <ul className="mt-8 flex flex-col gap-8">
      {recipesList.map(item => {
        return <Recipe
          key={item.id}
          recipe={item}
        ></Recipe>
      })}
    </ul>
  )
}

export default RecipesList