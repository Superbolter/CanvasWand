
import React, { Component } from 'react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Typography } from '../StyledComponents/components/Typography';


require('./Carousel.css')






export default class Carousel extends Component {
    data = [
        {
            uri:  window.getRomeCdnUrl() + "/Images/Carousel/T3.jpg",
            content:
                <div>
                    <img loading='lazy' src=  {window.getRomeCdnUrl() + "/Images/welspun-testimonial.png"} alt="" style={{ marginBottom: "25px", width: "100px" }} />
                    <Typography as="h6" modifiers={["header6"]}>SuperBolter has futuristic approach and they understand their client's requirements well  to offer products and services. In Coordination and collaboration with SuperBolter we both can grow together</Typography>
                    <Typography style={{ marginTop: "12px" }} as="p" modifiers={["subtitle2", "medium"]}>Mr. Vijay</Typography>
                    <Typography style={{ marginTop: "8px" }} as="p" modifiers={["overline2", "grey"]}  >Regional Manager, Wellspun</Typography>
                </div>
        },
        {
            uri:  window.getRomeCdnUrl() +"/Images/Carousel/T2.png",
            content:
                <div>
                    <img loading='lazy' src= { window.getRomeCdnUrl() + "/Images/blau-testimonial.png" } alt="" style={{ marginBottom: "25px", width: "100px" }} />
                    <Typography as="h6" modifiers={["header6"]}>Saves time, has trusted vendor & access to millions of design concepts. 3D design for a floor plan is presented with all design concepts in less than a min.</Typography>
                    <Typography style={{ marginTop: "12px" }} as="p" modifiers={["subtitle2", "medium"]}>Mr. Siddarth</Typography>
                    <Typography style={{ marginTop: "8px" }} as="p" modifiers={["overline2", "grey"]}  >Blau Living</Typography>
                </div>
        },
        {
            uri:  window.getRomeCdnUrl() +"/Images/Carousel/T1.png",
            content:
                <div>
                    <Typography as="h6" modifiers={["header6"]}>It is a fun and interactive way of making a design. It is another way of doing things. I also like that it brings something that was usually a premium service to people who otherwise could not afford it.</Typography>
                    <div style={{ display: "flex", alignItems: "initial", marginTop: "12px" }}>
                        <img loading='lazy' src={ window.getRomeCdnUrl() + "/Images/vlad-testimonial.png"} alt="" style={{ width: "50px", height: "50px", boxShadow: "1px 1px 3px 0 rgb(0 ,0, 0,0.14)", borderRadius: "50%" }} />
                        <div style={{ marginLeft: "8px" }} >
                            <Typography as="p" modifiers={["subtitle2", "medium"]}>Mr. Vlad Pappa</Typography>
                            <Typography style={{ marginTop: "8px" }} as="p" modifiers={["overline2", "grey"]}  >20 Years of Architecture and Interior Designing,<br />European & middle eastern markets</Typography>
                        </div>
                    </div>
                </div>
        }
    ]

    constructor(props) {
        super(props)

        this.state = {
            activeIndex: 0
        }
    }

    componentDidMount() {
        this.slideRight()
    }

    slideLeft = () => {
        let activeIndex = this.state.activeIndex

        if (activeIndex === 0) {
            this.setState({ activeIndex: this.data.length - 1 })
        } else {
            this.setState({ activeIndex: activeIndex - 1 })
        }

    }
    slideRight = () => {
        let activeIndex = this.state.activeIndex
        this.setState({ activeIndex: (activeIndex + 1) % this.data.length })
    }


    render() {
        return (
            <div className="sb-carousel">
                <span onClick={this.slideLeft} className="sb-carousel__icon icon__pos--left">
                    <KeyboardArrowLeftIcon style={{ color: "white" }} />
                </span>
                <span onClick={this.slideRight} className="sb-carousel__icon icon__pos--right">
                    <KeyboardArrowRightIcon style={{ color: "white" }} />
                </span>
                <div className="sb-carousel__left">
                    <SwitchTransition>
                        <CSSTransition
                            key={"CAROUSEL__IMAGE__KEY__" + this.state.activeIndex}
                            timeout={{
                                enter: 5000,
                                exit: 500,

                            }}
                            classNames="carousel-sb-"
                            onEntered={this.slideRight}

                        >
                            <img loading='lazy' src={this.data[this.state.activeIndex].uri} alt="" />
                        </CSSTransition>
                    </SwitchTransition>
                </div>
                <div className="sb-carousel__right">
                    <SwitchTransition>
                        <CSSTransition
                            key={"CAROUSEL__IMAGE__KEY__" + this.state.activeIndex}
                            timeout={{
                                enter: 500,
                            }}
                            classNames="carousel-sb-text"
                        >

                            {this.data[this.state.activeIndex].content}
                        </CSSTransition>
                    </SwitchTransition>
                </div>
            </div>
        )
    }
}
