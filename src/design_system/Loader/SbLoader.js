import React from 'react';
import animationData from '../../lottie/sb-loader.json'
import Lottie from "react-lottie";



const style = {
    width: "100%",
    height: "100%",
    background: "rgb(255 255 255 / 80%)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0px",
    zIndex: "100"
}
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};


const SbLoader = () => {

 

    return (
        <div style={style}>
            <div style={{ maxWidth: "200px" }}>
                <Lottie isClickToPauseDisabled={true} options={defaultOptions} />
            </div>
        </div>
    )
}


export default SbLoader;