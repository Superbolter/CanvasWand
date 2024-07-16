import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import { Typography } from '../StyledComponents/components/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Checkbox from '@material-ui/core/Checkbox';
import { onAddToFilter, onRemoveFromFilter } from '../../Actions/WishlistActions';
import _ from 'lodash';

require('./MultipleSelect.css')
class RangeMultipleSelect extends Component {


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

    handleOnClick = (isActive, startKeyValue, endKeyValue, name) => {

        let obj = {
            start_key: this.props.filter.start_key,
            end_key: this.props.filter.end_key,
            type: this.props.filter.type,
            startKeyValue: startKeyValue,
            endKeyValue: endKeyValue,
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

        let startKey = this.props.filter.start_key
        let endkey = this.props.filter.end_key
        let type = this.props.filter.type

        return (
            <div style={{ marginTop: "32px" }} >
                <Typography style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} as="h6" modifiers={["header6", "medium"]} onClick={this.toggleFilters}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                        {
                            this.props.filter.name
                        }
                        {
                            _.find(this.props.activeFilters, function (obj) {

                                return obj.type === type && obj.start_key === startKey && obj.end_key === endkey;
                            }) ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4B73EC", marginLeft: "8px" }}></div> : null
                        }

                    </span>
                    {this.state.showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Typography>

                <Collapse in={this.state.showFilters}>
                    {
                        this.props.filter.data.map((data) => {
                            let isActive = false

                            let startKeyValue = data.start_key
                            let endKeyValue = data.end_key
                            let res = _.find(this.props.activeFilters, function (obj) {

                                return obj.type === type && obj.start_key === startKey && obj.end_key === endkey && obj.startKeyValue === startKeyValue && obj.endKeyValue === endKeyValue;
                            });

                            if (res) {
                                isActive = true
                            }
                            return <Typography onClick={() => this.handleOnClick(isActive, data.start_key, data.end_key, data.name)} className={"multiple-select-item" + (isActive ? " filter-active" : "")} as="p" modifiers={["subtitle"]}><Checkbox checked={isActive} style={{ padding: "0px", marginRight: "8px" }} color="primary" /> {data.name}</Typography>
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

export default connect(mapStateToProps, mapDispatchToProps)(RangeMultipleSelect)
