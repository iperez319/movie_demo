import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import Poster from "../components/Poster";

export default function Favorites(){
    const [shows, setShows] = useState([]);
    useEffect(() =>{
        const data = localStorage.getItem('favoriteShows') ?? '[]';
        setShows(JSON.parse(data))
    }, [])
    return (
        <div style={{display: 'flex', justifyContent: 'center', padding: '40px 40px'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {
                    shows.map(item => <Poster show={item} key={`poster-${item.id}`}/>)
                }
            </div>
        </div>
    )
}
