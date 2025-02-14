const APIKey = "554dba92ad784afcba27b3d5fd21a970";


async function findRecipes() {
    const ingredientInput = document.getElementById("ingredient-input").value.toLowerCase();

    if(!ingredientInput){
        alert("Please enter an ingredient");
        return;
    }
    
    const ingredients = ingredientInput.replace(/\s+/g, ""); // To remove spaces
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${APIKey}`;

    try {
        const response = await fetch(url);
        const recipes = await response.json();
        displayRecipes(recipes);
    }
    catch(error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again.");
    }
    
} 

function displayRecipes(recipes){
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = ""; // Clear previous recipes

    if (recipes.length === 0){
        recipeList.innerHTML = `<li>No recipes found for these ingredients</li>`
        return;
    }

    recipes.forEach(recipe => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <h4>${recipe.title}</h4>
            <img src="${recipe.image}" alt="${recipe.title}">
            <button onclick="viewDetails(${recipe.id})">View</button> 
            <button class="favorite-btn" onclick="addToFavorites('${recipe.title}')">⭐</button>
        `;
        recipeList.appendChild(listItem); 
    });
}


async function viewDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${APIKey}`;

    try {
        const response = await fetch(url);
        const recipe = await response.json();

        // Create modal container and content
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // create a close button
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.innerHTML = '&times;';

        // create the recipe title, ingredients, and instructions

        const title = document.createElement('h3');
        title.innerText = `Recipe: ${recipe.title}`;
        const ingredients = document.createElement('p');
        ingredients.innerText = `Ingredients: ${recipe.extendedIngredients.map(ingredient => ingredient.name).join(", ")}`;
        const instructions = document.createElement('p');
        instructions.innerText = `Instructions: ${recipe.instructions || "No instructions available."}`;    
        // Append elements to the modal content
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(ingredients);
        modalContent.appendChild(instructions);
        // Append modal content to the modal container
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        modal.style.display = 'block';
        // Close the modal when the user clicks on the close button
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            modal.remove();  // Remove the modal from the DOM
        }
        // Close the modal if the user clicks anywhere outside of the modal
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                modal.remove();  // Remove the modal from the DOM
            }
        }
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert("An error occurred while fetching recipe details. Please try again.");
    }
}


let favoriteRecipes =[];

function addToFavorites(recipeName) {
    if (!favoriteRecipes.includes(recipeName)) {
        favoriteRecipes.push(recipeName);
        localStorage.setItem("favorites", JSON.stringify(favoriteRecipes))
        updateFavorites();
        alert(`${recipeName} has been added to your favorites.`);
    } else {
        alert(`${recipeName} is already in your favorites.`);
    }
}


function updateFavorites() {
    const favList = document.getElementById("favorite-list");
    favList.innerHTML = ""; // Clear previous favorites

    favoriteRecipes.forEach(recipeName => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${recipeName} 
            <button onclick="removeFromFavorites('${recipeName}')">❌</button>
        `;
       favList.appendChild(listItem);
    });
}

function removeFromFavorites(recipeName) {
    favoriteRecipes = favoriteRecipes.filter(recipe => recipe !== recipeName);
    localStorage.setItem("favorites", JSON.stringify(favoriteRecipes));
    updateFavorites();
}

