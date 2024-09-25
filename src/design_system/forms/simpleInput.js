import React, { useState } from "react";
import Color from "../colors/colors.js";
import "./forms.css";
// Define the FormComponent outside of your useForm hook
// const FormComponent = ({ setState, state, placeholder, color }) => {
//   console.log(color);
//   return (
//       <input
//         className="input"
//         type="text"
//         value={state}
//         placeholder={placeholder}
//         onChange={(e) => setState(e.target.value)}
//         onBlur={(e) => setState(e.target.value)}
//         style={{ border: "1px solid " + Color[color] }}
//       />
//   );
// };

const FormComponent = ({ placeholder, color, state, change}) => {
  return (
       <input
        className="input"
        type="text"
        value={state}
        placeholder={placeholder}
        onChange={change}
        onBlur={change}
        style={{ border: "1px solid " + Color[color] }}
      />   
  )

}

export default FormComponent;

// export default function useFormL(defaultState, placeholder, color) {
//   const [state, setState] = useState(defaultState);

//   return [
//     state,
//     <FormComponent
//       state={state}
//       setState={setState}
//       placeholder={placeholder}
//       color="#99E4E4E4"
//     />,
//     setState,
//   ];
// }
