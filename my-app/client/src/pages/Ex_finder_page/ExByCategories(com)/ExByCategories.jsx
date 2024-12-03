import { useState, useEffect } from 'react';
import styles from './ExByCategories.module.css';
import { fetchData } from '../../../Utils/fetchData.js';

function ExByCategories() {
    // Categories and subcategories:
    const mainCategories = ["upper body", "lower body", "abs"];
    const lowerBodyCategories = ["abductors", "adductors", "calves", "glutes", "hamstrings", "quadriceps"];
    const absCategories = ["abdominals"];
    const upperBodyCategories = ["arms", "back", "chest", "neck", "traps"];
    const armsCategories = ["biceps", "forearms", "triceps"];
    const backCategories = ["lats", "lower back", "middle back"];

    // State for active category and exercises
    const [activeCategory, setActiveCategory] = useState('main'); // default category is 'main'.
    const [exercises, setExercises] = useState([]);

    // object to map the subcategories: 
    const subcategories = {
        upperbody: upperBodyCategories,
        lowerbody: lowerBodyCategories,
        abs: absCategories,
        arms: armsCategories,
        back: backCategories
    };

    // fetching the data and filter it to the active category
    async function loadExercises(category)
    {
        const response = await fetchData("exercises.json");
        const categoryExercises = response.filter(exercise => exercise.primaryMuscles.includes(category));
        setExercises(categoryExercises);
    }

    // rendering the data:
    useEffect(()=> {
        if (activeCategory && !subcategories[activeCategory]) // If there is active category that hasn't have subcategories.
        {
            loadExercises(activeCategory);
        }}, [activeCategory]); // load data when activeCategory changes.

    function handleClick(category)
    {
        const noSpacesCategory = category.replace(/\s+/g, '').toLowerCase(); // remove spaces from category name
        if (subcategories[noSpacesCategory]) {
            setActiveCategory(noSpacesCategory); // Show subcategories if they exist
        } else {
            setActiveCategory(category); // Show exercises if no subcategories exist
        }
    }
    
    return (
        <>
            {/* Main category buttons */}
            <h1 className = {styles.mainHeader}>Exercises By Body Part</h1>
            <button className = {styles.backBtn} onClick = {() => {setActiveCategory('main')}}>Reset Search</button>
            

            {activeCategory === 'main' && (
                <div className = {styles.ButtonsContainer}>
                    {mainCategories.map((category, index) => (<button className = {styles.categoryBtn} key = {index} onClick = {() => handleClick(category)}>{category}</button>))}
                </div>
            )}

            {/* Subcategory buttons */}
            {subcategories[activeCategory] && (
                <div className = {styles.ButtonsContainer}>
                    {subcategories[activeCategory].map((subcategory, index) => (<button className = {styles.categoryBtn} key = {index} onClick = {() => handleClick(subcategory)}>{subcategory}</button>))}
                </div>
            )}

            {/* Exercise buttons */}
            {!subcategories[activeCategory] && activeCategory !== 'main' && ( // "subcategories[activeCategory]": refers to the activeCategory property which is in the object named subcategories.
                <div>
                    <h2 className = {styles.listHeader}>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Exercises</h2> 
                    {exercises.length > 0 ? (
                        <ul className = {styles.listContainer}>
                            {exercises.map(exercise => (<li className = {styles.exerciseItem} key = {exercise.id}>{exercise.name}</li>))}
                        </ul>
                    ) : (
                    <p>Loading exercises...</p>
                    )}
                </div>
            )}
        </>
    );
}

export default ExByCategories;
