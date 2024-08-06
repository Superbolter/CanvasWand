import React, { useEffect } from "react";
import "./forms.css";
import useForm from "./simpleInput";
import useFormL from "./useFormL.js";
import useCorrectForm from "./correctForm.js";
/*
useFormL - Input text with label
Parameters in form are default value, label, placeholder, border color

useForm - Input text without label
Parameters in form are default value, placeholder, border color
*/
const Forms = (props) => {
  const [place, SetPlace] = useForm("", "Gurgaon default", "primary2");
  const [name, SetName] = useFormL(
    "",
    "Enter Your Name",
    "Rohan is default ig",
    "neutral1"
  );
  const [correct, SetCorrect] = useCorrectForm("", "Correct");
  // const []
  // useEffect(() => { eva.replace(), [] }

  return (
    <div>
      <div>{SetName}</div>
      <div>{SetPlace}</div>
      <div>{SetCorrect}</div>
      <i data-eva="github"></i>
    </div>
  );
};

export default Forms;
