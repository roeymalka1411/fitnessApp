import React, { useEffect, useState, useRef } from 'react'; 
import styles from './ExCard.module.css';

function ExCard({ selectedObj }) {
    // Image states handling (fetching and loading):
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const abortControlRef = useRef(null); // Reference for the AbortController to manage fetch request cancellation.

    // Card display states:
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const [cardDisplay, setCardDisplay] = useState(false);

    async function fetchImage() {
        if (selectedObj) {
            const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/exercises/${selectedObj.id}/0.jpg`;
            setCardDisplay(true);
            
            try {
                setIsLoading(true);
                const response = await fetch(url, {
                    signal: abortControlRef.current?.signal, // step 3: Pass the abort signal to the fetch call to allow cancellation of this request if needed.
                });
                if (response.ok) {
                    setImageUrl(url);
                } else {
                    setImageUrl(null);
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                setImageUrl(null);
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        abortControlRef.current?.abort(); // step 1: aborts any former http requests if it exists.
        abortControlRef.current = new AbortController(); // step 2: Create a new AbortController for the new fetch request.

        if (selectedObj) {
            fetchImage();
            setCardDisplay(true);
        } else {
            setCardDisplay(false);
        }

        /* clean up fucntion: runs only when selectObj changes and by that hides the card. return part is not related to the first part of the useEffect.
        how it works: each time before we display the card the clean up function executes (also before the first displaytion). */ 
        return () => setCardDisplay(false); 
    }, [selectedObj]);

    const toggleInstructions = () => {
        setShowFullInstructions(prev => !prev);
    };

    const closeCard = () => {
        setCardDisplay(false);
    };

    return (
        selectedObj && cardDisplay && (
            <div className={styles.cardContainer}>

                <h1 className={styles.title}>{selectedObj.name}</h1>
                <div className={styles.imageContainer}>
                    {isLoading ? (
                        <div className={styles.loader}></div>
                    ) : (
                        <img className={styles.image} src={imageUrl} alt={selectedObj.name} />
                    )}

                    <p className={styles.muscles}>
                        {selectedObj.primaryMuscles.map((muscle, index) => (
                            <span key={index} className={styles.muscleBox}>{muscle}</span>
                        ))}
                    </p>
                </div>
                
                <div className={styles.content}>
                    <button className={styles.closeBtn} aria-label="Close" onClick={closeCard}>x</button>
                    
                    <h3 className={styles.instructionsTitle}>Instructions</h3>
                    <div className={styles.instructions}>
                        <span>
                            {showFullInstructions 
                                ? selectedObj.instructions.join('. ') // Join the instructions with dot and space.
                                : selectedObj.instructions.join('. ').substring(0, 100) + (selectedObj.instructions.join('. ').length > 100 ? '... ' : '') // Shorten if more than 100 chars.
                            }
                        </span>
                        {selectedObj.instructions.join('. ').length > 100 && ( // Show "Read More" if the instructions are long.
                            <label className={styles.toogleLabel} onClick={toggleInstructions}>
                                {showFullInstructions ? ' Read Less' : ' Read More'}
                            </label>
                        )}
                    </div>
                </div>
            </div>
        )
    );
}

export default ExCard;