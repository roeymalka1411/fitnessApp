import styles from './Build_program.module.css'
import Build_program_explanation from './Build_program_explanation(com)/Build_program_explanation.jsx'
import ExistedWorkouts from './ExistedWorkouts(com)/ExistedWorkouts.jsx'
// import NewWorkout from './NewWorkout(com)/NewWorkout.jsx'


function Build_program()
{
    return(
        <>
           <Build_program_explanation/> 
           <ExistedWorkouts/>
           {/*NewWorkout*/}
        </>
    );
}

export default Build_program; 
