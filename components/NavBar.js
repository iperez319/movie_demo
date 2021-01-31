import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Button,
    ButtonBase,
    IconButton,
    InputBase,
    makeStyles,
    Toolbar,
    Typography,
    fade,
    Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import Link from "next/link";
import {Search} from "@material-ui/icons";
import {useDebounce} from '@react-hook/debounce';
import axios from 'axios';

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
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
            flexGrow: '',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
}))

export default function NavBar(){
    const classes = useStyles();
    const [query, setQuery] = useDebounce('', 250);
    const [queryText, setQueryText] = useState('');
    const [queryResults, setQueryResults] = useState([]);
    const image_path = 'https://image.tmdb.org/t/p/w92/'

    useEffect(() => {
        async function fetchResults(){
            const base = 'https://api.themoviedb.org/3';
            let result = await axios.get(base + '/search/tv', {params: {api_key: process.env.API_KEY, query, include_adult: false}})
            setQueryResults(result?.data?.results ?? [])
        };
        if(query !== "") fetchResults();
    }, [query])

    const generateSearchList = () => {

        if(queryResults.length === 0){
            return (
                <ListItem>
                    <ListItemText primary={'Not Found...'}/>
                </ListItem>
            )
        } else {
            return (queryResults.map((item) =>
                item.poster_path
                    ? <Link href={`/${item.id}`}>
                        <ListItem button>
                            <ListItemAvatar>
                                <img src={image_path + `${item.poster_path}`} alt={item.name} style={{height: '50px', borderRadius: '2px'}}/>
                            </ListItemAvatar>
                            <ListItemText primary={item.name}/>
                        </ListItem>
                    </Link>
                    : null))
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <ButtonBase as={Link} href={"/"} style={{padding: '10px'}}>
                        <Typography variant="h6">
                        TV Show Demo
                        </Typography>
                    </ButtonBase>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <Search />
                        </div>
                        <div style={{width: 'max-content', position: 'relative'}} onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                // Not triggered when swapping focus between children
                                setQuery('')
                                setQueryText('')
                            }
                        }}>
                            <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{'aria-label': 'search'}}
                            value={queryText}
                            onChange={(evt) => {
                                setQuery(evt.target.value);
                                setQueryText(evt.target.value);
                            }}
                            />
                            {
                                query !== ""
                                    ? <Paper style={{ position: "absolute", width: "100%", maxHeight: '255px', minHeight: '50px',overflowY: 'auto', zIndex: '100'}}>
                                        <List style={{width: '100%'}} dense>
                                            {
                                                generateSearchList()
                                            }
                                        </List>
                                    </Paper>
                                    : null
                            }
                        </div>
                    </div>
                    <div className={classes.title}></div>
                    <Button color="inherit" as={Link} href={'/favorites'}>My Favorites</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
