import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay
} from "@reach/alert-dialog";

const AlertDialogComponent = (props) => {
  let message = typeof props.description == "string"? props.description.split('\\n')
   : props.description? props.description[0].split('\\n') : '';

  return (
    <AlertDialogOverlay className="dialog_backdrop" data-no-focus-lock leastDestructiveRef={props.cancelRef}>
      <AlertDialogContent className="dialog_content alert-dialog icon alert-neutral">
        <button className="alert-cls" onClick={props.close}></button>
        <div className="popup-wrap popup-wrap-height">
          <AlertDialogLabel className="alert-ttl"></AlertDialogLabel>
          <AlertDialogDescription className="dialog_description">
            {
              message &&
                message.map((txt, index) => {
                  return(
                    <p key={index}>
                      {txt}
                    </p>
                  )
                })
            }
          </AlertDialogDescription>
        </div>          
        <div className="btn-area right">
          <button className="btn-square fill" ref={props.cancelRef} onClick={props.close}>
            확인
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialogOverlay>
  );
};

export default AlertDialogComponent;
