import React from 'react';
import {useRouter} from 'next/router';
import axios from "axios";
import {Chip, Container, makeStyles, Paper, Typography} from "@material-ui/core";
import PosterList from "../components/PosterList";
import ProviderList from "../components/ProviderList";

export async function getServerSideProps(context){
    const {id} = context.params;
    const base = 'https://api.themoviedb.org/3';
    const showDetailsPromise = axios.get(base + `/tv/${id}`, {params: {api_key: process.env.API_KEY}});
    const creditsPromise = axios.get(base + `/tv/${id}/credits`, {params: {api_key: process.env.API_KEY}});
    const similarShowsPromise = axios.get(base + `/tv/${id}/similar`, {params: {api_key: process.env.API_KEY}});
    const streamPromise = axios.get(base + `/tv/${id}/watch/providers`, {params: {api_key: process.env.API_KEY}});

    const [showDetails, credits, similarShows, streamLocations] = await Promise.all([showDetailsPromise, creditsPromise, similarShowsPromise, streamPromise]);

    const cast = credits.data.cast.filter(c => c.known_for_department == "Acting" && c.profile_path)

    return {
        props: {
            showDetails: showDetails.data,
            cast,
            similarShows: similarShows.data,
            streamLocations: streamLocations?.data?.results?.US,
        }
    }
}

const useStyles = makeStyles(theme => ({
    posterImage: {
        borderRadius: '5px',
        [theme.breakpoints.down('sm')]: {
            height: '250px',
            marginBottom: '20px',
        },
    },
    chips: {
        marginRight: '10px'
    },
    infoContainer: {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        }
    }
}))

export default function ShowDetail({showDetails, cast, similarShows, streamLocations}){
    const classes = useStyles();
    const base_poster_path = 'https://image.tmdb.org/t/p/w342';
    const base_profile_path = 'https://image.tmdb.org/t/p/w138_and_h175_face'

    console.log(streamLocations);
    return (
        <Container style={{marginTop: '20px', paddingBottom: '40px'}}>
            <div style={{display: 'flex', alignItems: 'center'}} className={classes.infoContainer}>
                <img src={base_poster_path + showDetails.poster_path} className={classes.posterImage}/>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px'}}>
                    <Typography
                        variant={'h3'}>{showDetails.name}{showDetails.first_air_date ? ' (' + (new Date(showDetails.first_air_date)).getFullYear().toString() + ')' : ''}</Typography>
                    <div style={{overflow: 'auto'}}>
                        {
                            showDetails.genres.map(item => <Chip label={item.name} className={classes.chips} color={'primary'}/>)
                        }
                    </div>
                    <Typography variant={'subtitle1'}
                                style={{fontStyle: 'italic', marginTop: '10px'}}>{showDetails.tagline}</Typography>
                    <Typography variant={'h6'} style={{marginTop: '10px'}}>Overview</Typography>
                    <Typography variant={'body1'}>{showDetails.overview}</Typography>

                    <ProviderList providers={streamLocations?.flatrate} title={"Stream"}/>
                    <ProviderList providers={streamLocations?.buy} title={'Buy'}/>

                    <Typography variant={'body1'} style={{
                        fontWeight: 'bold',
                        marginTop: '20px'
                    }}>{showDetails?.created_by[0]?.name ?? ''}</Typography>
                    {showDetails.created_by ? <Typography variant={'body1'}>Creator</Typography> : null}
                </div>
            </div>
            <div style={{marginTop: '20px'}}>
                <Typography variant={'h4'}>Cast</Typography>
                <div style={{display: 'flex', overflowY: 'auto', marginTop: '10px'}}>
                    {
                        cast.map(item => (
                            <Paper style={{width: 'min-content', marginRight: '30px'}}>
                                <img src={base_profile_path + item.profile_path} style={{borderTopLeftRadius: '4px', borderTopRightRadius: '4px'}}/>
                                <div style={{padding: '10px'}}>
                                    <Typography variant={'body1'}
                                               style={{fontWeight: 'bold'}}>{item.name}</Typography>
                                    <Typography variant={'body1'}>{item.character}</Typography>
                                </div>
                            </Paper>
                        ))
                    }
                </div>
            </div>
            <PosterList shows={similarShows.results ?? []} title={'Similar Shows'}/>
        </Container>
    );
}
