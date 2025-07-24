export async function fetchData(url)
{
    const response = await fetch(url); // the data as db.
    const data = await response.json(); 

    return data;
}