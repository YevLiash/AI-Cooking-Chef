import {useEffect, useState} from 'react'
import Logo from './Components/Logo.jsx'
import GroceryForm from './Components/GroceryForm.jsx'
import GroceryList from './Components/GroceryList.jsx'
import ModalExist from './Components/ModalExist.jsx'
import GroceryActions from './Components/GroceryActions.jsx'
import Loader from './Components/Loader.jsx'
import RecipesList from './Components/RecipesList.jsx'

function App() {
  const [groceries, setGroceries] = useState(() => JSON.parse(localStorage.getItem('groceries')) || [])
  const [showModalExist, setShowModalExist] = useState(false)
  const [recipesList, setRecipesList] = useState(() => JSON.parse(localStorage.getItem('recipes')) || [])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    localStorage.setItem('groceries', JSON.stringify(groceries))
  }, [groceries])
  
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipesList))
  }, [recipesList])

  function addGrocery(value) {
    if (groceries.find(item => item.toLowerCase() === value.toLowerCase())) {
      setShowModalExist(true)
      return
    }

    setGroceries([...groceries, value])
  }

  function deleteGrocery(id) {
    setGroceries(groceries.filter((_, index) => {
      return id !== index
    }))
  }

  function clearAll() {
    setGroceries([])
    setRecipesList([])
  }

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
  const recipeCount = 3

  async function fetchingRecipes() {
    const groceriesApiString = groceries
      .map((item, index) => (index === 0 ? item : `+${item}`))
      .join(',')
    console.log(groceriesApiString)
    try {
      setIsLoading(true)
      const resList = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${groceriesApiString}&number=${recipeCount}&ignorePantry=true`)
      const dataList = await resList.json()

      const recipesWithInstructions = await Promise.all(
        dataList.map(async recipe => {
          const resInstructions = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=${API_KEY}`)
          const instructions = await resInstructions.json()

          return ({
            ...recipe,
            instructions: instructions[0]?.steps || []
          })
        })
      )
      if (recipesWithInstructions) {
        setRecipesList(recipesWithInstructions)
      }

    } catch (err) {
      setError('Something went wrong...')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#E9EEE7] min-h-screen">

      <div className="flex flex-col justify-center  max-w-[80%] mx-auto">
        <div className="mx-auto">
          <Logo />
        </div>
        <GroceryForm
          onAdd={addGrocery}
        />
        {groceries.length > 0 && <GroceryList
          groceries={groceries}
          onDelete={deleteGrocery}
        />}
        {showModalExist &&
          <ModalExist onClose={() => setShowModalExist(false)} />}

        {groceries.length >= 3 && <GroceryActions
          groceries={groceries}
          onClear={clearAll}
          onGetRecipes={fetchingRecipes}
        />}

        {isLoading && <Loader />}

        {recipesList.length > 0 && <RecipesList recipesList={recipesList} />}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default App
