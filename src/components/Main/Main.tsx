import { createRef, RefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Observable, concatMap, take, map, of, switchMap, mergeMap, OperatorFunction, exhaustMap, mergeAll, fromEvent } from 'rxjs';
import Box, { BoxType } from '../box/Box';
import Path, { PathProps } from '../Path/Path';
import style from "./Main.module.css";

export interface SVGElement extends HTMLElement {
  beginElementAt(d: number): SVGElement;
}

export default function Main(props: { run: { run: number, operatorFunction: any } }) {

  const boxRef = useRef<HTMLDivElement>(null);
  const boxRef2 = useRef<HTMLDivElement>(null);
  const boxRef3 = useRef<HTMLDivElement>(null);

  const [pathProps, setPathProps] = useState<PathProps>({ x1: 0, x2: 0, y1: 0, y2: 0, id: "0", colors: [] });
  const [pathProps2, setPathProps2] = useState<PathProps>({ x1: 0, x2: 0, y1: 0, y2: 0, id: "1", colors: [] });

  const [animations, setAnimations] = useState<RefObject<SVGElement>[]>([]);

  const [animations2, setAnimations2] = useState<RefObject<SVGElement>[]>([]);
  const [circles2, setCircles2] = useState<RefObject<SVGElement>[]>([]);

  const setPath1 = (_circles: any, animations: any) => {
    setAnimations(() => {
      return animations.current;
    });
  }

  const setPath2 = (circles: any, animations: any) => {
    setAnimations2(() => {
      return animations.current;
    });
    setCircles2(() => {
      return circles.current;
    })
  }

  useEffect(() => {
    setPathProps(() => {
      return _setPathProps(boxRef, boxRef2)
    });
    setPathProps2(() => {
      return _setPathProps(boxRef2, boxRef3)
    });

  }, []);

 /*  const observableA: Observable<{ id: number, color: string }> = new Observable((subscriber) => {
    let index = 0;
    const colors = ["red", "#11a872", "orange"];
    setInterval(() => {
      subscriber.next({ id: index, color: colors[index] });
      index++;
    }, 3000);
  }); */
  const observableB: Observable<{ id: number, color: string }> = new Observable((subscriber) => {
    let index = 0;
    const colors = ["#00daff", "white", "violet"];
    setInterval(() => {
      subscriber.next({ id: index, color: colors[index] });
      index++;
    }, 2000);
  });

  const onDrop = (event: any) => {
    console.log(event, boxRef.current?.getBoundingClientRect())
  }

  useEffect(() => {
    let index = -1;
    let outerIndex = 0;
    let innerIndex = 9;
    const colors = ["red", "#11a872", "orange"];
    const observableA = fromEvent((boxRef.current as HTMLElement), 'click')
    .pipe(
      map(click => {
        index++;
        return { id: index, color: colors[index] }
      })
    );

    observableA.pipe(
      take(3),
      getOperatorFunction(props.run.operatorFunction)(a => {
        checkSVGElement(animations, a.id) && (animations[a.id].current as SVGElement).beginElementAt(0);
        return observableB.pipe(take(3), map(value => ({ colors: [a.color, value.color]})))
      }, )
    )
      .subscribe(a => {
        checkSVGElement(animations2, outerIndex) && (animations2[outerIndex].current as SVGElement).beginElementAt(0);
        checkSVGElement(animations2, innerIndex) && (animations2[innerIndex].current as SVGElement).beginElementAt(0);
        if (checkSVGElement(circles2, innerIndex)) {
          (circles2[innerIndex].current as SVGElement).style.fill = a.colors[0];
        }
        outerIndex ++;
        innerIndex ++;
      });
  }, [animations, props]);

  return (
    <div className={style.Main}>
      <Box ref={boxRef} top={0} left={0} html="Observable A: emits on click" colors={["orange", "#11a872", "red"]} type={BoxType.OBSERVABLE} onDrop={onDrop}></Box>
      <Path id={pathProps.id} x1={pathProps.x1} y1={pathProps.y1} x2={pathProps.x2} y2={pathProps.y2} colors={["red", "#11a872", "orange"]} onCircleDrawn={setPath1}></Path>
      <Box ref={boxRef2} top={3} left={30} html="Observable B: Emits each second 3 times, then stops" colors={["#00daff", "white", "violet"]} type={BoxType.OBSERVABLE}></Box>
      <Path id={pathProps2.id} x1={pathProps2.x1} y1={pathProps2.y1} x2={pathProps2.x2} y2={pathProps2.y2} colors={["violet", "white", "#00daff"]} onCircleDrawn={setPath2} ></Path>
      <Box ref={boxRef3} top={1} left={70} html="Observer" colors={[]} type={BoxType.OBSERVER}></Box>
    </div>
  )
}

const getOperatorFunction = (operatorFunction: string) => {
  switch (operatorFunction) {
    case "concatMap": return concatMap;
    case "mergeMap": return mergeMap;
    case "switchMap": return switchMap;
    case "exhaustMap": return exhaustMap;
    default: return concatMap
  }
}


const checkSVGElement = (elem: RefObject<SVGElement>[], index: number) => {
  return elem && elem[index] && elem[index].current;
}

const _setPathProps = (ref1: RefObject<HTMLDivElement>, ref2: RefObject<HTMLDivElement>) => {
  const offset = ref1.current?.offsetTop && ref1.current?.offsetTop * 2;
  return {
    x1: ref1.current?.getBoundingClientRect().width as number,
    y1: (ref1.current?.getBoundingClientRect().height as number + (offset as number)) / 2,
    x2: ref2.current?.getBoundingClientRect().left as number - (ref1.current?.getBoundingClientRect().left as number),
    y2: ref2.current?.getBoundingClientRect().y as number
      - (ref1.current?.getBoundingClientRect().top as number)
      + (ref2.current?.getBoundingClientRect().height as number + (offset as number)) / 2,
    id: "0",
    colors: []
  }
}


