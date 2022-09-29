import React from "react";
import "./style.css";
/**
 * @author
 * @function Card
 **/

const Card = (props) => {
  return (
    <div {...props} className="card">
      {(props.headerLeft || props.headerRight) && (
        <div className="cardHeader">
          {props.headerLeft && <div>{props.headerLeft}</div>}
          {props.headerRight && props.headerRight}
        </div>
      )}
      {props.children}
    </div>
  );
};

export default Card;
