import { forwardRef } from "react";
import Draggable from "react-draggable";
import styles from "./Box.module.css";

export enum BoxType {
  OBSERVER = "observer",
  OBSERVABLE = "observable"
}
export const Box = forwardRef<HTMLDivElement, { left: number, top: number, html: string, colors: Array<string>, type: BoxType, onDrop?:Function }>((props, ref) => {

  const style = {
    top: `${props.top}em`,
    left: `${props.left}em`,
    position: "absolute" as const,
  }

  const dots = [1, 2, 3];
  const colors = ["blue", "violet", "rgb(8, 61, 63)"]

  return (
      <div style={style} ref={ref} className={styles.Box}>
        <div>
          {props.html}
        </div>

        {props.type === BoxType.OBSERVABLE &&
          <div>
            {
              dots.map((dot, i) => {
                return (
                  <span key={i} className={styles.dot} style={{ backgroundColor: props.colors ? props.colors[i] : colors[i] }} ></span>
                )
              })
            }
          </div>
        }
      </div>
  )
});

export default Box;
