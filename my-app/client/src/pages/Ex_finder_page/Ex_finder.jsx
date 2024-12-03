import styles from './Ex_finder.module.css'
import ExSearchBox from './ExSearchBox(com)/ExSearchBox.jsx';
import ExCard from './ExCard(com)/ExCard.jsx';

import {useState} from 'react';

function Ex_finder()
{
    const [selectedObj, setSelectedObj] = useState(null); // state will be passed as a prop to "ExCard.jsx" and "ExSearchBox.jsx".

    return (
        <>
            <div className = {styles.pageContainer}>
                <div className = {styles.leftSide}>
                    <ExSearchBox setSelectedObj = {setSelectedObj}/> {/* passing "setSelectedObj" state function to ExSearchBox */}
                </div>
                <div className = {styles.rightSide}>
                    <ExCard selectedObj = {selectedObj}/> {/* passing "setSelectedObj" state object to ExSearchBox */}
                </div>
            </div>
        </>
    );
}

export default Ex_finder;
