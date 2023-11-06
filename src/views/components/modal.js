import React, { createContext, useState, useContext } from 'react'
import ConfirmDialogComponent from './ConfirmDialogComponent'
export const ModalContext = createContext({
  submit: () => { },
  close: () => { }
})

export default function ModalProvider({ children }) {
  const cancelRef = React.useRef();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogObject, setConfirmDialogObject] = useState({
    description: '',
    leftText: '',
    rightText: '',
    leftClick: null,
    rightClick: null
  })
  const submit = (confirmDialogObject) => {
    setConfirmDialogObject(confirmDialogObject)
    setShowConfirmDialog(true)
  };
  const close = () => {
    setShowConfirmDialog(false)
  }
  return <ModalContext.Provider value={{ submit, close }}>
    {children}
    {showConfirmDialog &&
      <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
        leftText={confirmDialogObject.leftText}
        rightText={confirmDialogObject.rightText}
        leftClick={confirmDialogObject.leftClick}
        rightClick={confirmDialogObject.rightClick}
      />}
  </ModalContext.Provider>
}
