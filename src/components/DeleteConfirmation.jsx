import { useEffect } from 'react'
import ProgressBar from './ProgressBar';

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {

  useEffect(() => {
    console.log('TIMER started')
    const timer = setTimeout(() => {
      onConfirm()
    }, TIMER)
    //return statement in useEffect is executed before executing the useEffect the next time based on the dependency.
    //i.e lets say useEfect is executing based on some dependecy ,befor execting the next time it would execute the return first and then it would go on .
    return () => {
      clearInterval(timer)
    }
  }, [onConfirm])

  //It is advisable to not use method which contain any state change inside it as dependency as it csn lead to inifinite loop.
  //use useCallback() hook when passing function as dependency in useEffect

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
