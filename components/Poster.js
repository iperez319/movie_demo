import React, {useEffect, useState} from 'react';
import Link from "next/link";
import classes from "../styles/Poster.module.css";
import {ButtonBase, IconButton} from "@material-ui/core";
import {Favorite} from "@material-ui/icons";

export default function Poster({show}){
    const [isFavorite, setIsFavorite] = useState(false);
    const image_path = 'https://image.tmdb.org/t/p/w220_and_h330_face/'
    const handleClick = (evt) => {
        evt.preventDefault();
        let storedData = localStorage.getItem('favoriteShows') ?? '[]';
        let parsedData = JSON.parse(storedData);
        console.log(parsedData);
        if(isFavorite){
            //Remove from store
            let newItems = parsedData.filter(item => item.id != show.id);
            localStorage.setItem('favoriteShows', JSON.stringify(newItems));
        } else {
            //Add to store
            const {id, vote_average, poster_path} = show;
            parsedData.push({id, vote_average, poster_path});
            localStorage.setItem('favoriteShows', JSON.stringify(parsedData))
        }
        setIsFavorite(!isFavorite);
    }

    useEffect(() => {
        const rawItems = localStorage.getItem('favoriteShows') ?? '[]'
        const items = JSON.parse(rawItems);
        setIsFavorite(items.find(item => item.id == show.id));
    }, [])

    return (
        <ButtonBase as={Link} href={`/${show.id}`} className={classes.buttonBaseContainer}>
            <img src={image_path + show.poster_path} className={classes.posterImage}/>
            <IconButton style={{color: isFavorite ? 'red' : ''}} className={classes.favoriteButton} onClick={handleClick}><Favorite/></IconButton>
            <div className={classes.ratingsContainer}>{show.vote_average ?? 0.0}</div>
        </ButtonBase>
    )
}
