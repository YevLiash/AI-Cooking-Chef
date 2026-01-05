function Recipe({recipe}) {
  return (
    <div className="flex flex-col gap-3">
      <img
        src={recipe.image}
        alt={`picture of ${recipe.title}`}
      />
      <p className="">
        {recipe.title}
      </p>
      <ol className="list-decimal list-inside">{recipe.instructions.map((item) =>
        <li
          key={item.number}
          className="mt-2"
        >
          {item.step}
        </li>
      )}</ol>
    </div>
  )
}

export default Recipe