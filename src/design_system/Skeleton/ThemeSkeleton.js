import React, { Component } from 'react'
import Skeleton from '@material-ui/lab/Skeleton';


export default class ThemeSkeleton extends Component {
    render() {
        return (
            <div>
                <Skeleton variant="rect" height={230} />
                <Skeleton variant="text" width={100} />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Skeleton variant="rect" width={124} height={32} />
                </div>
            </div>
        )
    }
}
