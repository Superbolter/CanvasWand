import React, { Component } from 'react'
import { connect } from 'react-redux'
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';;
import _ from 'lodash';
import { onAddToSearchFilter, onRemoveFromSearchFilter } from '../../Actions/HomeSetupActions';
import Menu from '@mui/material/Menu';
import { Button } from '../StyledComponents/components/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

class MultipleSelectSearch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            anchorEl: null
        }
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        })
    };

    handleClose = () => {
        this.setState({
            anchorEl: null
        })
    };

    handleOnClick = (isActive, value, name) => {

        let obj = {
            filter_key: this.props.filter.filter_key,
            type: this.props.filter.type,
            value: value,
            name: name,
            label: this.props.filter.name
        }

        if (isActive) {
            this.props.onRemoveFromSearchFilter(obj)
        } else {
            this.props.onAddToSearchFilter(obj)
        }
    }

    render() {
        let key = this.props.filter.filter_key
        let type = this.props.filter.type
        return (
            <div style={{ marginRight: "16px", marginBottom: "16px" }}>
                <Button onClick={this.handleClick} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} modifiers={["outlineBlack", "small"]}>{this.props.filter.name}<ArrowDropDownIcon style={{ marginLeft: "10px" }} /></Button>
                <Menu anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    getContentAnchorEl={null}
                >
                    {
                        this.props.filter.data.map((data) => {
                            let isActive = false

                            let value = data.key
                            let res = _.find(this.props.activeFilters, function (obj) { return obj.type === type && obj.filter_key === key && obj.value === value; });
                            if (res) {
                                isActive = true
                            }
                            return <MenuItem onClick={() => this.handleOnClick(isActive, data.key, data.name)} style={{ dispatch: "flex", alignItems: "center", justifyContent: "flex-start" }}><Checkbox checked={isActive} style={{ padding: "0px", marginRight: "8px" }} />{data.name}</MenuItem>
                        }
                        )
                    }
                </Menu>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeFilters: state.homeSetupReducer.activeFilters

})

const mapDispatchToProps = dispatch => ({
    onAddToSearchFilter: (data) => dispatch(onAddToSearchFilter(data)),
    onRemoveFromSearchFilter: (data) => dispatch(onRemoveFromSearchFilter(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(MultipleSelectSearch)
