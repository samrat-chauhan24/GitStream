// useState hook
import { useState } from "react";

function App(){
  
  let [count, setCount] = useState(0);
  function addValue(){
    // if(count < 20)
    setCount(count + 1)
  }    
  function decreaseValue(){
    // if(count > 0)
    setCount(count - 1)
  }

  // if(count < 0){
  //   setCount(count = 0);
  // }
  // if(count > 20){
  //   setCount(count = 20);
  // }
  return(
    <>
    <h1>Counter Functionality</h1>
    <p>counter: {count}</p>
    <button id="button" onClick={addValue} disabled = {count >= 20}>
      counter+
    </button>
    <button id="button1" onClick={decreaseValue} disabled = {count <= 0}>
      counter-
    </button>
    </>
  )
}
export default App