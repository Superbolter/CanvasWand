import { Button, Icon } from '@material-ui/core';
import React from 'react';
// import { Button } from '../StyledComponents/components/Button';
import "./Select.css";
import { Typography } from '../StyledComponents/components/Typography';

function debounce(fn, delay) {
    let timer;
    const thisContext = this;
    const args = arguments;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            return fn.apply(thisContext, args);
        }, delay);
    };
}

class DropDownListItem extends React.Component {
    constructor(props) {
        super(props);
        this.debouncedToggleChangeListItem = debounce(
            this.toggleChangeListItem,
            100
        );
    }
    toggleChangeListItem = () => {
        const { listData, uniqueKey, onClick } = this.props;
        this.props.toggleChangeListItem(listData[uniqueKey], listData);

    };
    onKeyUp = e => {
        if (e.keyCode === 13) {
            const { listData, uniqueKey, onClick } = this.props;
            this.props.toggleChangeListItem(listData[uniqueKey], listData);
            // onClick(listData.id, listData)
        }
    };
    render() {
        const { listData, isChecked, placeholder, refId } = this.props;
        const id = listData.id
        let colorFilter = false
        if (listData.id.includes("colors__")) {
            colorFilter = true
        }
        return (
            <div
                tabIndex={0}
                className="drop-down__list-item"
                onClick={this.debouncedToggleChangeListItem}
                onKeyUp={this.onKeyUp}
            >
                {
                    colorFilter ? <span style={{ width: "20px", height: "20px", background: listData.value, border: "0.25px solid black" }}>

                    </span> : null
                }

                <input
                    tabIndex={-1}
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    value={listData.value}
                    placeholder={placeholder}
                />
                <label htmlFor={id}>{listData.label}</label>
            </div>
        );
    }
}

/**********************************/
// propTypes
/**********************************/
// DropDownListItem.propTypes = {
//     listData: PropTypes.object,
//     uniqueKey: PropTypes.string,
//     toggleChangeListItem: PropTypes.func,
//     isChecked: PropTypes.bool
// };

class MultiSelectDropDown extends React.Component {
    state = {
        isOpen: false
    };
    toggleIsOpen = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    // handle click outside ~ to close the dropdown
    componentWillMount() {
        document.addEventListener("mousedown", this.handleDocClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleDocClick, false);
    }
    handleDocClick = e => {
        if (!this.wrapper.contains(e.target)) {
            this.setState({
                isOpen: false
            });
        }
    };
    renderDropDownIcon = () => {
        if (this.props.customRenderDropDownIcon) {
            return this.props.customRenderDropDownIcon();
        } else {
            return <span className="drop-down-icon">▼</span>;
        }
    };
    renderSelected = () => {

        const { isOpen, placeholder } = this.state;
        const { selected, data, uniqueKey } = this.props;
        let labelContent = "";
        // if (!selected.length) {
        //     labelContent = "None Selected ";
        // } else if (selected.length === data.length) {
        //     labelContent = "All Selected";
        // } else if (selected.length === 1) {
        //     const selectedOne = data.find(item => item[uniqueKey] === selected[0]);
        //     labelContent = selectedOne.label;
        // } else {
        //     labelContent = `${selected.length} Selected`;
        // }
        const activeClass = isOpen ? "new-drop-down--is-open" : "";
        return (
            <Button variant="outlined" className={`new-drop-down__button ${activeClass}`} onClick={this.toggleIsOpen} style={{ borderRadius: "12px", padding: '16px', color: "#090909", textTransform: "none" }} >
                {/* <span>{this.props.placeholder}</span> */}
                <Typography as="p" modifiers="subtitle" >{this.props.placeholder}</Typography>
                <img style={{ width: "20px" }} src="Images/arrow-down-black.svg" alt="" srcset="" />
            </Button>
        );
    };


    renderDropDownList = () => {
        const {
            data,
            toggleChangeListItem,
            uniqueKey,
            selected,
            placeholder,
            activeFilters,
            refId,
            shouldHaveSelectAll,
            style,
            onClick,
            onDelete
        } = this.props;

        let data_ = [...data];

        if (shouldHaveSelectAll) {
            data_ = [{ label: "Select All", value: "ALL" }, ...data];
        }

        const getIsChecked = ({ listData, uniqueKey, selected, activeFilters }) => {
            let isChecked = false;
            // if (listData[uniqueKey] === "ALL") {
            //     if (selected.length === data.length) {
            //         isChecked = true;
            //     } else {
            //         isChecked = false;
            //     }
            // } else {
            //     isChecked = selected.indexOf(listData[uniqueKey]) > -1;

            // }

            if (activeFilters && activeFilters[listData.id]) {
                isChecked = true;
            }

            return isChecked;
        };

        return data_.map((listData, index) => {
            const isChecked = getIsChecked({ listData, uniqueKey, selected, activeFilters });
            return (
                <DropDownListItem
                    key={index}
                    toggleChangeListItem={toggleChangeListItem}
                    listData={listData}
                    uniqueKey={uniqueKey}
                    isChecked={isChecked}
                    placeholder={placeholder}
                    onClick={onClick}
                    onDelete={onDelete}
                />
            );
        });
    };
    render() {
        return (
            <div className="new-drop-down" ref={wrapper => (this.wrapper = wrapper)} style={this.props.style}>
                {this.renderSelected()}
                {this.state.isOpen && (
                    <div className="new-drop-down__list-wrapper">
                        {this.renderDropDownList()}
                    </div>
                )}
            </div>
        );
    }
}

export default MultiSelectDropDown;