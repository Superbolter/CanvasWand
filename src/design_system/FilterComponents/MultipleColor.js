import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';;
import { Typography } from '../StyledComponents/components/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Checkbox from '@mui/material/Checkbox';
import _ from 'lodash';
import { onAddToFilter, onRemoveFromFilter } from '../../Actions/ProductsCatalogActions';

require('./MultipleSelect.css')


class MultipleColor extends Component {

    // static propTypes = {
    //     filter: PropTypes.object.isRequired
    // }


    constructor(props) {
        super(props)

        this.state = {
            showFilters: false
        }
    }


    toggleFilters = () => {
        let showFilters = this.state.showFilters
        this.setState({
            showFilters: !showFilters
        })
    }


    handleOnClick = (isActive, value, name) => {

        let obj = {
            filter_key: this.props.filter.filter_key,
            type: this.props.filter.type,
            value: value,
            name: name,
            label: this.props.filter.name
        }

        if (isActive) {
            this.props.onRemoveFromFilter(obj)
        } else {
            this.props.onAddToFilter(obj)
        }
    }

    render() {
        let key = this.props.filter.filter_key
        let type = this.props.filter.type
        return (
            <div style={{ marginTop: "32px" }}>
                <Typography  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} as="h6" modifiers={["header6", "medium"]} onClick={this.toggleFilters}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                        {
                            this.props.filter.name
                        }
                        {
                            _.find(this.props.activeFilters, function (obj) { return obj.type === type && obj.filter_key === key; })
                                ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4B73EC", marginLeft: "8px" }}></div> : null
                        }
                    </span>{this.state.showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Typography>

                <Collapse in={this.state.showFilters}>
                    {
                        this.props.filter.data.map((data, index) => {
                            let isActive = false

                            let value = data.key
                            let res = _.find(this.props.activeFilters, function (obj) { return obj.type === type && obj.filter_key === key && obj.value === value; });
                            if (res) {
                                isActive = true
                            }
                            return <Typography key={index} onClick={() => this.handleOnClick(isActive, data.key, data.name)} className={"multiple-select-item" + (isActive ? " filter-active" : "")} modifiers={["subtitle"]}><Checkbox checked={isActive} style={{ padding: "0px", marginRight: "8px" }} color="primary" /><span style={{ width: "24px", height: "24px", borderRadius: "50%", marginRight: "8px", background: data.key }}></span> {data.name}</Typography>
                        }
                        )
                    }
                </Collapse>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeFilters: state.productsCatalogReducer.activeFilters
})

const mapDispatchToProps = dispatch => ({
    onAddToFilter: (data) => dispatch(onAddToFilter(data)),
    onRemoveFromFilter: (data) => dispatch(onRemoveFromFilter(data))
})




export default connect(mapStateToProps, mapDispatchToProps)(MultipleColor)

