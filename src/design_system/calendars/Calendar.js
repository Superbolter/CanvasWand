import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";
import "../forms/forms.css";
import "../forms/Forms.js";
import Color from "../colors/colors";
const TestCal = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  return (
    <div className="input">
      <DatePicker
        value={selectedDay}
        onChange={setSelectedDay}
        inputPlaceholder="Choose Date"
        shouldHighlightWeekends
        colorPrimary={Color.primary1} // added this
        colorPrimaryLight={Color.primary1}
      />
    </div>
  );
};

export default TestCal;
