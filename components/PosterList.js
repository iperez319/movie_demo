import React from 'react';
import {ButtonBase, Container, Typography} from "@material-ui/core";
import classes from "../styles/PosterList.module.css";

export default function PosterList({title, shows}) {
    const image_path = 'https://image.tmdb.org/t/p/w220_and_h330_face/'
    return (
        <>
            <Typography variant={'h4'}>{title}</Typography>
            <div className={classes.posterList}>
                {
                    shows.map((item, index) => <ButtonBase onClick={() => alert("HI")}
                                                                   style={{marginRight: '10px'}}><img
                        src={image_path + item.poster_path} className={classes.poster}
                        key={`popular-${index}`}/></ButtonBase>)
                }
            </div>
        </>
    )
}
