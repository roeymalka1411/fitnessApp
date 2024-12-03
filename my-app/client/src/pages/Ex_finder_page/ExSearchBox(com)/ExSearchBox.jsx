import styles from './ExSearchBox.module.css'
import React, {useEffect, useState} from 'react'
import {fetchData} from '../../../Utils/fetchData.js'

function ExSearchBox({setSelectedObj}) // "selctedObj" state is passed as a prop that will be changed here. 
{
    const [search, setSearch] = useState('');
    const [exercisesData, setExercisesData] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);

    // Select Scroll Down condition:
    const ScrollActivateConditions = filteredExercises.length > 0 && search.length > 0;
    
    // fetching the data: 
    async function loadData() {
        const data = await fetchData("exercises.json");
        setExercisesData(data);
    };

    useEffect (() => {loadData()}, []); // fetch it once when the page renders.

    // filtering the data (top 5 exercises):
    async function filterData(){
        const filtered = exercisesData.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase())).slice(0,5); // top 5 results.
        setFilteredExercises(filtered);
    };

    useEffect(() => {filterData()}, [search, exercisesData]) // re-render the "filterData" function each time "search" or "exercisesData" changes.

    // handle selection from dropdown
    async function handleSelect(exerciseName){
        setSearch(exerciseName); // set "search" to be the option i chose.
        setFilteredExercises([]); // Clear the filtered exercises after selection
    }

    // Handle search button click:
    async function handleSearchBtn() {
        const searched_object = exercisesData.find(exercise => exercise.name === search) // return object by it's name.
        console.log(searched_object); 

        setSelectedObj(searched_object)
        setSearch(''); // clear the searchBox after pressing the searchBtn.
    }


    return(
        <>
            <div className = {styles.exerciseCollection}>
                <h1 className = {styles.header}>Discover Your Perfect Exercise</h1>
                <p className = {styles.headerElaboration}>"Discover Your Perfect Exercise" brings ease to finding workouts tailored to your goals. Simply search by name or muscle group, and explore targeted exercises to boost strength, flexibility, or overall fitness.</p>
                
                <h1 className = {styles.header}>Find By Name</h1>
                <p className = {styles.headerElaboration}>This search option lets users quickly find an exercise by its specific name.</p>
                
                <div className = {styles.searchWrapper}>
                    <input 
                        className = {styles.inputBox} 
                        value = {search}
                        onChange = {(e) => setSearch(e.target.value.toLowerCase())}
                        placeholder = "Search By Exercise Name..."
                        type = "text"
                    />

                    {ScrollActivateConditions && 
                    <ul className = {styles.suggestionList}>
                        {filteredExercises.map(exercise => 
                        <li 
                            key = {exercise.id}
                            onClick = {() => handleSelect(exercise.name)}
                            className = {styles.suggestionItem}
                        >
                            {exercise.name}
                        </li>)}
                    </ul>}

                    <button className = {styles.searchBtn} onClick = {handleSearchBtn}>Search</button>
                </div>
            </div>            
        </>
    );
}

export default ExSearchBox;