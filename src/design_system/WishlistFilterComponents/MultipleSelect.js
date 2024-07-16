import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '../StyledComponents/components/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';
import { onAddToFilter, onRemoveFromFilter } from '../../Actions/WishlistActions';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
require('./MultipleSelect.css')

const useStyles = makeStyles({


});

function CustomCheckBox(props) {
    const classes = useStyles();
    return (
        <div>
            <Checkbox color="primary" {...props} />
        </div>
    )
}




class MultipleSelect extends Component {


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
                <Typography style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} as="h6" modifiers={["header6", "medium"]} onClick={this.toggleFilters}>
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
                        this.props.filter.data.map((data, ind) => {
                            let isActive = false

                            let value = data.key
                            let res = _.find(this.props.activeFilters, function (obj) { return obj.type === type && obj.filter_key === key && obj.value === value; });
                            if (res) {
                                isActive = true
                            }
                            return <Typography key={ind} onClick={() => this.handleOnClick(isActive, data.key, data.name)} className={"multiple-select-item" + (isActive ? " filter-active" : "")} modifiers={["subtitle"]}><CustomCheckBox checked={isActive} style={{ padding: "0px", marginRight: "8px" }} /> {data.name}</Typography>
                        }


                        )
                    }
                </Collapse>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeFilters: state.wishlistReducer.activeFilters

})

const mapDispatchToProps = dispatch => ({
    onAddToFilter: (data) => dispatch(onAddToFilter(data)),
    onRemoveFromFilter: (data) => dispatch(onRemoveFromFilter(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(MultipleSelect)
