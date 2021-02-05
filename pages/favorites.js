import React, {useEffect, useState} from 'react';
import Poster from "../components/Poster";
import Head from "next/head";

export default function Favorites(){
    const [shows, setShows] = useState([]);
    useEffect(() =>{
        const data = localStorage.getItem('favoriteShows') ?? '[]';
        setShows(JSON.parse(data))
    }, [])
    return (
        <div style={{display: 'flex', padding: '40px 40px'}}>
            <Head>
                <title>My Favorites</title>
            </Head>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {
                    shows.map(item => <Poster show={item} key={`poster-${item.id}`}/>)
                }
            </div>
        </div>
    )
}
