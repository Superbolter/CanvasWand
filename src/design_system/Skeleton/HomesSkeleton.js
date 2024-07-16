import React, { Component } from 'react'
import Skeleton from '@material-ui/lab/Skeleton';


export default class HomesSkeleton extends Component {
    render() {
        return (
            <div>
                <Skeleton variant="rect" height={230} />
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={60} />

            </div>
        )
    }
}
