import React from 'react';
import {useRouter} from 'next/router';
import axios from "axios";
import {
    Chip,
    Container,
    makeStyles,
    Paper,
    Typography,
    Divider
} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab"
import PosterList from "../components/PosterList";
import ProviderList from "../components/ProviderList";
import {Image} from "@material-ui/icons";
import Head from "next/head";

export async function getStaticProps(context){

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
            streamLocations: streamLocations?.data?.results?.US ?? {},
        },
        revalidate: 450,
    }
}

export async function getStaticPaths(){
    const base = 'https://api.themoviedb.org/3';
    const popularPromise = axios.get(base + "/tv/popular", {params: {api_key: process.env.API_KEY}})
    const topRatedPromise = axios.get(base + "/tv/top_rated", {params: {api_key: process.env.API_KEY}})
    const trendingPromise = axios.get(base + "/trending/tv/day", {params: {api_key: process.env.API_KEY}})

    const [popularShows, topRatedShows, trendingShows] = await Promise.all([popularPromise, topRatedPromise, trendingPromise]);
    const popularIds = popularShows?.data?.results?.map(item => ({params: {id: item.id.toString()}})) ?? [];
    const topRatedIds = topRatedShows?.data?.results?.map(item => ({params: {id: item.id.toString()}})) ?? [];
    const trendingIds = trendingShows?.data?.results?.map(item => ({params: {id: item.id.toString()}})) ?? [];

    return {
        paths: [...popularIds, ...topRatedIds, ...trendingIds],
        fallback: true,
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
    },
    sectionTitle: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '27px',
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}))

export default function ShowDetail({showDetails, cast, similarShows, streamLocations}){
    const classes = useStyles();
    const base_poster_path = 'https://image.tmdb.org/t/p/w342';
    const base_profile_path = 'https://image.tmdb.org/t/p/w138_and_h175_face'
    const base_season_poster_path = 'https://image.tmdb.org/t/p/w130_and_h195_bestv2'

    const router = useRouter();

    const CastList = () => {
        return cast.length > 0 ? (<div style={{marginTop: '20px'}}>
            <Typography variant={'h4'} className={classes.sectionTitle}>Cast</Typography>
            <div style={{display: 'flex', overflowY: 'auto', marginTop: '10px'}}>
                {
                    cast.map(item => (
                        <Paper style={{width: 'min-content', marginRight: '30px'}} key={`cast-${item.id}`}>
                            <img src={base_profile_path + item.profile_path} style={{borderTopLeftRadius: '4px', borderTopRightRadius: '4px'}}/>
                            <div style={{padding: '10px', maxHeight: '150px', overflow: 'auto'}}>
                                <Typography variant={'body1'}
                                            style={{fontWeight: 'bold'}}>{item.name}</Typography>
                                <Typography variant={'body1'}>{item.character}</Typography>
                            </div>
                        </Paper>
                    ))
                }
            </div>
        </div>) : null;
    }
    const Tags = () => {
        return (
            <div style={{overflow: 'auto', marginTop: '5px'}}>
                {
                    showDetails.genres.map(item => <Chip label={item.name} className={classes.chips} color={'primary'} key={`tag-${item.name}`}/>)
                }
            </div>
        )
    }
    const Creator = () => {
        return (
            showDetails.created_by.length > 0 ?
            <>
                <Typography variant={'body1'} style={{fontWeight: 'bold', marginTop: '20px'}}>
                    {showDetails?.created_by[0]?.name}
                </Typography>
                <Typography variant={'body1'}>Creator</Typography>
            </> : null
        )
    }
    const SeasonPoster = ({season}) => {
        return (
            season.poster_path
                ? <img src={base_season_poster_path + season.poster_path} style={{borderRadius: '4px 0px 0px 4px'}}/>
                : <div style={{width: '130px', height: '195px', backgroundColor: '#646464', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px 0px 0px 4px', flexShrink: 0}}>
                    <Image style={{color: '#dbdbdb', fontSize: '45px'}}/>
                  </div>
        )
    }
    const SeasonPreview = () => {
        return (
                <div style={{marginTop: '20px'}}>
                    <Typography variant={'h4'} className={classes.sectionTitle}>Seasons</Typography>
                    {
                        showDetails.seasons.map(season => {
                            const air_date = new Date(season.air_date)
                            return ( season.season_number !== 0 ?
                                <Paper style={{width: '100%', position: "relative", marginBottom: '10px', display: 'flex', height: '195px'}}>
                                    <SeasonPoster season={season}/>
                                    <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
                                        <span style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '-5px'}}>{season.name}</span>
                                        <div style={{marginBottom: '5px', display: 'flex'}}>
                                            <span style={{fontSize: '17px', fontWeight: '500'}}>{season.episode_count} Episodes</span>
                                            <Divider orientation='vertical' style={{margin: '0px 5px'}}/>
                                            <span style={{fontSize: '17px', fontWeight: '500'}}>{air_date.getFullYear()}</span>
                                        </div>
                                        <Typography variant={'body1'} style={{display: '-webkit-box', WebkitLineClamp : '4', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '96px'}}>{season.overview ? season.overview : `Season ${season.season_number} of ${showDetails.name} aired on ${air_date.toLocaleDateString()}` }</Typography>
                                    </div>
                                </Paper> : null
                            )
                        })
                    }
                </div>
    )
    }

    const MainPage = () => {
        return (
            <Container style={{marginTop: '20px', paddingBottom: '40px'}}>
                <Head>
                    <title>{showDetails.name}</title>
                </Head>
                <div style={{display: 'flex', alignItems: 'center'}} className={classes.infoContainer}>
                    <img src={base_poster_path + showDetails.poster_path} className={classes.posterImage}/>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px'}}>
                        <Typography variant={'h3'} as={'p'}>{showDetails.name}{showDetails.first_air_date ? ' (' + (new Date(showDetails.first_air_date)).getFullYear().toString() + ')' : ''}</Typography>
                        <Tags/>
                        <Typography variant={'subtitle1'}
                                    style={{fontStyle: 'italic', marginTop: '10px'}}>{showDetails.tagline}</Typography>
                        <Typography variant={'h6'} style={{marginTop: '10px'}}>Overview</Typography>
                        <Typography variant={'body1'}>{showDetails.overview}</Typography>

                        <ProviderList providers={streamLocations?.flatrate} title={"Stream"}/>
                        <ProviderList providers={streamLocations?.buy} title={'Buy'}/>
                        <Creator/>
                    </div>
                </div>
                <SeasonPreview/>
                <CastList/>
                <PosterList shows={similarShows.results ?? []} title={'Similar Shows'}/>
            </Container>
        )
    }
    const SkeletonPage = () => {
        return (
            <Container style={{marginTop: '20px', paddingBottom: '40px'}}>
                <Head>
                    <title>Loading...</title>
                </Head>
                <div style={{display: 'flex', alignItems: 'center'}} className={classes.infoContainer}>
                    <Skeleton variant={'rect'} width={345} height={513}/>
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px'}}>
                        <Skeleton variant={'text'} width={500} height={60}/>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {
                                [1, 2, 3].map(item => <Skeleton variant={'rect'} width={70} height={32} style={{marginRight: '10px', borderRadius: '10px'}}/>)
                            }
                        </div>
                        <Skeleton variant={'text'} width={400} height={28} style={{marginTop: '10px'}}/>
                        <Skeleton variant={'text'} width={100} height={32} style={{marginTop: '10px'}}/>
                        <Skeleton variant={'text'} width={500} height={125} style={{marginTop: '-20px'}}/>
                        <Skeleton variant={'text'} width={100} height={32} style={{marginTop: '10px'}}/>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {
                                [1, 2, 3].map(item => <Skeleton variant={'rect'} width={60} height={60} style={{marginRight: '10px', borderRadius: '10px'}}/>)
                            }
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    return router.isFallback ? <SkeletonPage/> : <MainPage/>
}
