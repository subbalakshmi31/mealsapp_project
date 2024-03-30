/*here we are using localStorage to ensure that the user's favourite meal list is preserved even if the user
 reloads or closes the browser. 
*/
/* this if condition is basically to check if local storage has favourite meals list, if its not there then we
need to initailze favouriteMealsList to empty array. we are using JSON.stringify() to convert our array to string
as localStorage supports only strings.
*/
if (localStorage.getItem("favouriteMealsList") == null) {
    localStorage.setItem("favouriteMealsList", JSON.stringify([]));
}

// its fetch meals from api and return it
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}

// its show's all meals card in main acording to search input value
function showMealsList(){
    // for getting input value from the search bar
    let inputValue = document.getElementById("meals-search").value;
    // for getting the favourite meals list from localStorage and converting it into array
    let arr=JSON.parse(localStorage.getItem("favouriteMealsList"));
    // URL for API endpoint to search meals
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
    // Initializing an empty HTML string for appending meal cards
    let html = "";
    // for fetching meals from the API using the URL and input value
    let meals=fetchMealsFromApi(url,inputValue);
    // for handling the API response data
    meals.then(data=>{
        // this condition is to check if there are any meals according to our search
        if (data.meals) {
            // Loop through each meal in the API response
            data.meals.forEach((element) => {
                let isFav=false;
                // to check if the current meal id is present in the favourite meals list
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                // generating HTML for the meal card based on whether it's a favourite meal or not
                if (isFav) {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-center">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Recipe</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavouriteMealsList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-center">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Recipe</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavouriteMealsList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            // to display a message if no meal is found 
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

/* this function will be called when user clicks on "Recipe" button */
async function showMealDetails(mealId) {
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let contentToBeDisplayed="";
    // to fetch meal details from API using mealId
    await fetchMealsFromApi(url,mealId).then(data=>{
        // append fetched meal details to contentToBeDisplayed variable
        contentToBeDisplayed += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instructions</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
    });
    document.getElementById("main").innerHTML = contentToBeDisplayed;
}

// this function is to show all meal items of favouriteMealsList in favourites component
async function showFavouriteMealsList() {
    // to convert favouriteMealsList into an array 
    let favouriteMealsArray=JSON.parse(localStorage.getItem("favouriteMealsList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    //this variable is to store the content to be displayed of favouriteMealsList
    let contentToBeDisplayed ="";
    //if there are no meals in favouriteMealsArray then if block will be executed 
    if (favouriteMealsArray.length==0) {
        contentToBeDisplayed += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                Oops! You dont have any favourite meals
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
    //if there are meals in favouriteMealsArray then else block will be executed
    else {
        for (let index = 0; index < favouriteMealsArray.length; index++) {
    /* each element of favouriteMealsArray will be passed to fetchMealsFromApi function and after getting response, 
    corresponding details of each meal will be displayed in favourites component. */
           await fetchMealsFromApi(url,favouriteMealsArray[index]).then(data=>{
                contentToBeDisplayed += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-center">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">Recipe</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavouriteMealsList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                            </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites-body").innerHTML = contentToBeDisplayed;
}

/* this function is basically for adding/removing a particular meal from favouriteMealsList. this function will
be called when user clicks on heart icon(favourites icon). when user clicks, it will toggle the present state of that . */
function addRemoveToFavouriteMealsList(id) {
    // to convert favouriteMealsList into an array 
    let favouriteMealsArray = JSON.parse(localStorage.getItem("favouriteMealsList"));
    let isInFavourites = false;
    for (let index = 0; index < favouriteMealsArray.length; index++) {
        if (id == favouriteMealsArray[index]) {
            isInFavourites = true;
        }
    }
/* if we click on heart icon(favourites icon) of meal which is already present in favouriteMealsList i.e., if we want to remove
the meal from favouriteMealsArray then if block will be executed. splice method will remove the meal from the 
favouriteMealsArray. flash msg will be generated accordingly*/
    if (isInFavourites) {
        let number = favouriteMealsArray.indexOf(id);
        favouriteMealsArray.splice(number, 1);
        // flashbar function will be called with msg and time
        flashbar('meal removed from your favourites',1000);
    }
/* if we click on heart icon(favourites icon) of meal which is not present in favouriteMealsList i.e., if we want to add the meal 
to favouriteMealsArray then else block will be executed. push method will add the meal to the favouriteMealsArray. 
flash msg will be generated accordingly */
    else{
        favouriteMealsArray.push(id);
        // flashbar function will be called with msg and time
        flashbar('meal added to your favourites',1000);
    }
/* as favouriteMealsArray is changed, we need to update the corresponding favouriteMealsList in local storage */
    localStorage.setItem("favouriteMealsList",JSON.stringify(favouriteMealsArray));
    showMealsList();
    showFavouriteMealsList();
}

// to get the flash container element
const flashContainer = document.getElementById('flash-container');
// function to display a flashbar with a message and fade out after some time
function flashbar(message,time){
  // to create a new <p> element
  const para = document.createElement('p');
  // add 'flash' class to the <p> element
  para.classList.add('flash');
  // to set the innerHTML of the <p> element with the message and add a close icon
  para.innerHTML = `${message} <span>&times</span>`;
  // add 'info' class to the <p> element
  para.classList.add('info');
  // append the <p> element to the flash container
  flashContainer.appendChild(para);
  // add 'fadeout' class to the <p> element
  para.classList.add('fadeout');

  // to set a timeout to remove the <p> element from the flash container after specified time
  setTimeout(()=>{
    flashContainer.removeChild(para);
  },time);
}
