import React from 'react';
import {ButtonBase, Container, IconButton, Typography} from "@material-ui/core";
import classes from "../styles/PosterList.module.css";
import Link from 'next/link';
import {Favorite} from "@material-ui/icons";
import Poster from "./Poster";

export default function PosterList({title, shows}) {
    return (
        <div style={{marginTop: '20px'}}>
            <Typography variant={'h4'}>{title}</Typography>
            <div className={classes.posterList}>
                {
                    shows.map((item) => <Poster show={item}/>)
                }
            </div>
        </div>
    )
}
