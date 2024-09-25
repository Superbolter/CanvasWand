import React, { useState } from "react";
import Color from "../colors/colors.js";
// Define the FormComponent outside of your useForm hook
const FormComponent = ({ setState, state, placeholder }) => {
  return (
    <form>
      <input
        className="correct"
        type="text"
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => setState(e.target.value)}
        style={{
          border: "1px solid " + Color.signalSuccess1,
          color: Color.signalSuccess1,
        }}
      />
    </form>
  );
};

export default function useCorrectForm(defaultState, placeholder) {
  const [state, setState] = useState(defaultState);

  return [
    state,
    <FormComponent
      state={state}
      setState={setState}
      placeholder={placeholder}
    />,
    setState,
  ];
}
