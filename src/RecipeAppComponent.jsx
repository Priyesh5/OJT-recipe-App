import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css'
function RecipeAppComponent() {
  const [data, setData] = useState([]);
  const [recipesByCategoryArray, setrecipesByCategoryArray] = useState([]);
  const [recipeTitle, setRecipeTitle] = useState("Not Selected");
  const [recipeOrigin, setRecipeOrigin] = useState("Not Selected");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState("Not Selected");
  const [recipeImage, setRecipeImage] = useState("Not Selected");
    
  useEffect(()=>{
    if(data.length === 0){
      fetchData();
    } 
  });

  async function fetchData(){
    const result = await axios(
        'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
        );
        var categoryArray = ['Select Category'];
        var temp = result.data.meals;
        for(var i=0;i<temp.length;i++){
          categoryArray.push(temp[i].strCategory);
        }
        setData(categoryArray);
      }
      
      async function fetchRecipesByCategory(categoryname){
        const result = await axios(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryname}`,
          );
          await setRecipeList(result);
      }

      async function fetchRecipesBySearch(searchVal){
        console.log(searchVal);
        const result = await axios(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchVal}`,
          );
          console.log(result.data.meals);
          if(result.data.meals === null){
            alert("Data Not Found");
            document.getElementById('searchText').value = "";
          }
          else{
            await setRecipeList(result);
          }
      }

      function setRecipeList(result){
        var listOfRecipes = [];
          var temp = result.data.meals;
          if(temp !== null){
          for(var i=0;i<temp.length;i++){
            listOfRecipes.push(temp[i].strMeal);
          }
          setrecipesByCategoryArray(listOfRecipes);
          }
      }

      async function fetchRecipeCard(recipeName){
        const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
        var temp = result.data.meals;
        setRecipeTitle(temp[0].strMeal);
        setRecipeOrigin(temp[0].strArea);
        setRecipeSteps(temp[0].strInstructions);
        var ingredients = [];
        for(var i=1;i<20;i++){
          var ingredient = "strIngredient"+i;
          var quantity = "strMeasure"+i;
          if((temp[0][ingredient] !== "" || temp[0][ingredient] !== null) && (temp[0][quantity] !== "" || temp[0][quantity] !== "")){
            ingredients.push(`${temp[0][ingredient]} ${temp[0][quantity]}`);
          }
        }
        setRecipeIngredients(ingredients);
        setRecipeImage(temp[0].strMealThumb);
      }

    function handleChange(evt){
      var temp = evt.target.value;
      fetchRecipesByCategory(temp);
    }

    function handleClick(d){
      fetchRecipeCard(d);
    }
    
    function handleSearchClick(){
      var temp = document.getElementById('searchText').value;
      fetchRecipesBySearch(temp);
    }

    return (
      <div className="container">
        <div className="split left">
        <h4>
            <center>
              Pick a Recipe
            </center>
          </h4>
        <div className="form-group">
        {
            <select className="form-control" onChange={handleChange.bind(this)}>
              {
                data.map((d,i) => (
                <option key={i} value={d}>{d}</option>
                ))
             }
                </select> 
            }
        </div>
        <div className="form-group">
            <input type="text" id="searchText" placeholder="Search Here"/>
            <input type="button" value="Search" className="btn btn-primary" onClick={()=> handleSearchClick()}/>
        </div>
        <div>
          <table id="customers">
          <tbody>
               {
                  recipesByCategoryArray.map((d,i) => (
                      <tr colSpan="5" value={d} onClick={() => handleClick(d)} >{d}</tr>
                  ))
                }
             </tbody>
          </table>
        </div>
        </div>
        <div className="split right">
          <h4>
            <center>
              Recipe Card
            </center>
          </h4>
        <div className="form-group">
          <h5>Recipe Title:</h5>
              <label>{recipeTitle}</label>
        </div>
        <div className="form-group">
        <h5>Recipe Origin:</h5>
              <label>{recipeOrigin}</label>
        </div>
        <div className="form-group">
                <img src={recipeImage} alt="Unsupported"/>
        </div>
        <div className="form-group">
        <h5>Recipe Ingredients:</h5>
          <table id="customers">
          <tbody>
               {
                  recipeIngredients.map((d,i) => (
                      <tr colSpan="5" value={d}>{d}</tr>
                  ))
                }
             </tbody>
          </table>
        
        </div>
        <div className="form-group">
        <h5>Procedure:</h5>
              <label>{recipeSteps}</label>
        </div>
        </div>
      </div>
    );
}
        
export default RecipeAppComponent;