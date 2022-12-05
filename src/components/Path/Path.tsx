import { createRef, Fragment, useEffect, useRef, useState } from "react";


export interface PathProps {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    id: string,
    colors: Array<string>;
    onCircleDrawn?: Function
}

const radius = 7;
export default function Path(props: PathProps) {

    const path = buildPath(props);
    const circlePath = buildCirclePath(props);
    const input = Array.from(Array(18).keys())
    const colors = ["red", "red", "red"].reverse();
    const circlesRefs = useRef([]);
    circlesRefs.current = input.map((element, i) => circlesRefs.current[i] ?? createRef());

    const animationsRefs = useRef([]);
    animationsRefs.current = input.map((element, i) => animationsRefs.current[i] ?? createRef());

    useEffect(() => {
        props.onCircleDrawn && props.onCircleDrawn(circlesRefs, animationsRefs);
    }, []);

    return (
        <Fragment>
            <svg xmlns="http://www.w3.org/2000/svg" width={props.x2} height={100} >
                <path fill="none" stroke="#1a9497d4" strokeWidth="2" d={path} />
                {
                    input.map((elem, index) => {
                        return (
                            <circle ref={circlesRefs.current[index]} r={radius - 1} fill={props.colors[index % 3]} key={elem} id={`oc-${props.id}${elem}`} cx={props.x1 + radius} cy={props.y1} >
                                <animateMotion ref={animationsRefs.current[index]} dur="2s" begin={""} repeatCount="1" path={circlePath} id={`${props.id}${elem}`} />
                            </circle>
                        )
                    })
                }
                {
                    input.map((elem, index) => {
                        return (
                            <circle ref={circlesRefs.current[index + 9]} r={radius / 2} fill={colors[index]} key={elem} id={`ic-${props.id}${elem}`} cx={props.x1 + radius} cy={props.y1} >
                                <animateMotion ref={animationsRefs.current[index + 9]} dur="2s" begin={""} repeatCount="1" path={circlePath} id={`inner-${props.id}${elem}`} />
                            </circle>
                        )
                    })
                }
                <circle r={radius} fill={"rgba(0,255,255,1)"} cx={props.x1 + radius} cy={props.y1} >
                </circle>
                <circle r={radius} fill={"rgba(0,255,255,1)"} cx={props.x2 - radius} cy={props.y2} >
                </circle>
            </svg>
        </Fragment>
    )
}

const buildPath = (pathProps: PathProps) => {
    const start = pathProps.x1 + radius;
    const end = pathProps.x2 - radius;
    const midPoint = start + (end - start) / 2;
    return `M${start} ${pathProps.y1} C ${midPoint} ${pathProps.y1}, ${midPoint} ${pathProps.y2}, ${end} ${pathProps.y2}`
}

const buildCirclePath = (pathProps: PathProps) => {
    const newProps = { ...pathProps };
    newProps.x1 = 0;
    newProps.y1 = 0;
    newProps.x2 = pathProps.x2 - pathProps.x1 - 2 * radius;
    newProps.y2 = pathProps.y2 - pathProps.y1;
    const midPoint = newProps.x1 + (newProps.x2 - newProps.x1) / 2;
    return `M${newProps.x1} ${newProps.y1} C ${midPoint} ${newProps.y1}, ${midPoint} ${newProps.y2}, ${newProps.x2} ${newProps.y2}`
}
