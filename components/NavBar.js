import React from 'react';
import {AppBar, Button, ButtonBase, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import Link from "next/link";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))

export default function NavBar(){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <ButtonBase as={Link} href={"/"} style={{padding: '10px'}}>
                        <Typography variant="h6">
                        News
                        </Typography>
                    </ButtonBase>
                    <div className={classes.title}></div>
                    <Button color="inherit">TV Show Demo</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
