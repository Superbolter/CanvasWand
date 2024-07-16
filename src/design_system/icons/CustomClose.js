import React from 'react'
import CloseIcon from '@material-ui/icons/Close';

require('./CustomClose.css')

function CustomClose(props) {
    return (
        <CloseIcon className="close-icon-custom" {... props} />
    )
}

export default CustomClose

