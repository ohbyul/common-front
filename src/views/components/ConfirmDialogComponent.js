import React from 'react';
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay
} from "@reach/alert-dialog";

const ConfirmDialogComponent = (props) => {
  return (
    <AlertDialogOverlay className="dialog_backdrop" leastDestructiveRef={props.cancelRef}>
      <AlertDialogContent className="dialog_content alert-dialog icon alert-neutral">
        <button className="alert-cls" onClick={props.rightClick}></button>
        <div className="popup-wrap popup-wrap-height">
          <AlertDialogLabel className="alert-ttl">{props.title}</AlertDialogLabel>
          <AlertDialogDescription className="dialog_description">
            {props.description.map((txt, index) => {
              return(
                <p key={index}>
                  {txt}
                </p>
                )
            })}
          </AlertDialogDescription>
        </div>
        <div className="btn-area right">
          <button className="btn-square fill" ref={props.cancelRef} onClick={props.leftClick}>
            {props.leftText}
          </button>
          <button className="btn-square" ref={props.cancelRef} onClick={props.rightClick}>
            {props.rightText}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialogOverlay>
  );
};

export default ConfirmDialogComponent;
