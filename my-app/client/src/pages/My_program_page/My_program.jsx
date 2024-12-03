import {useState} from 'react';
import styles from './My_program.module.css'
import Calendar from './Calendar(com)/Calendar';
import WorkoutsNamesList from './WorkoutsNamesList(com)/WorkoutsNamesList';

function My_program()
{
    const [data, setData] = useState([]);

    return(
        <>
        <div className = {styles.pageContainer}>
            <div className = {styles.leftSide}>
                <WorkoutsNamesList data = {data} setData = {setData} />
            </div>
            <div className = {styles.rightSide}>
                <Calendar/>
            </div>
        </div>
            
        </>
    );

}

export default My_program; 