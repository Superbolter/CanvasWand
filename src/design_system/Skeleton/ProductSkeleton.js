import React, { Component } from 'react'
import Skeleton from '@mui/material/Skeleton';
import { withRouter } from 'react-router-dom';


class ProductSkeleton extends Component {
    render() {
        return (
            this.props.match.params.productType === "t" ?<div style={{ width: "100%" }}>
                     <Skeleton variant="rect" height={50} width="100%" />
            </div>:  <div style={{ width:"100%" }}>
                <Skeleton variant="rect" height={230} width="100%" />
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={150} />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Skeleton variant="rect" width={124} height={32} />
                </div>
            </div>
        )
    }
}


export default withRouter(ProductSkeleton)
