import React, { useState } from "react";
import Color from "../colors/colors.js";
// Define the FormComponent outside of your useForm hook
const FormComponent = ({ setState, state, label, placeholder, color }) => {
  console.log(color);
  return (
    <form>
      <label htmlFor={label} className="label">
        {label}
        <input
          className="input"
          type="text"
          id={label}
          value={state}
          placeholder={placeholder}
          onChange={(e) => setState(e.target.value)}
          onBlur={(e) => setState(e.target.value)}
          style={{ border: "1px solid " + Color[color] }}
        />
      </label>
    </form>
  );
};

export default function useForm(defaultState, label, placeholder, color) {
  const [state, setState] = useState(defaultState);

  return [
    state,
    <FormComponent
      state={state}
      setState={setState}
      label={label}
      placeholder={placeholder}
      color="#99E4E4E4"
    />,
    setState,
  ];
}
