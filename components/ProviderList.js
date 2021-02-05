import React from 'react';
import {Tooltip, Typography} from "@material-ui/core";

export default function ProviderList({providers, title}){
    const base_logo_path = 'https://image.tmdb.org/t/p/w45'
    return (
            <div style={!providers ? {display: 'none', marginTop: '10px'} : {marginTop: '10px'}}>
                <Typography variant={'h6'}>{title}</Typography>
                <div style={{overflowX: 'auto', marginTop: '5px'}}>
                    {
                        providers?.map(item => {
                            return <Tooltip title={item.provider_name} placement={'top'}><img src={base_logo_path + item.logo_path} style={{borderRadius: '5px', marginRight: '10px'}} key={`provider-${item.provider_id}`}/></Tooltip>
                        })
                    }
                </div>
            </div>
    )
}
