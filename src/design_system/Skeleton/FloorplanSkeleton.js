import React, { Component } from 'react'
import Skeleton from '@mui/material/Skeleton';


export default class FloorplanSkeleton extends Component {
    render() {
        return (
            <div>
                <Skeleton variant="rect" height={230} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rect" width="100%" height={32} />

            </div>
        )
    }
}
