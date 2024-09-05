import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Paper, Select, MenuItem, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import convert from "convert-units";
import TextField from "@mui/material/TextField";
import { Typography } from "../../design_system/StyledComponents/components/Typography";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: "4px",
  },
  "& .MuiInputBase-input": {
    borderRadius: 8,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "'DM Sans', sans-serif",
    width: "30%",
  },
}));

const Properties = () => {
  const { measured } = useSelector((state) => state.drawing);
  const { length, width } = useSelector((state) => state.ApplicationState);
  const [lengthValue, setLengthValue] = useState(length);
  const [widthValue, setWidthValue] = useState(width);
  const [lengthMeasuredValue, setLengthMeasuredValue] = useState(measured);
  const [widthMeasuredValue, setWidthMeasuredValue] = useState(measured);

  useEffect(() => {
    const newLength = convert(length).from(measured).to(lengthMeasuredValue);
    setLengthValue(newLength);
    const newWidth = convert(width).from(measured).to(widthMeasuredValue);
    setWidthValue(newWidth);
    setLengthMeasuredValue(measured);
    setWidthMeasuredValue(measured);
  }, [length, measured, width]);

  const handleLengthChange = (event) => {
    const unit = event.target.value;
    const newLength = convert(lengthValue).from(lengthMeasuredValue).to(unit);
    setLengthValue(newLength);
    setLengthMeasuredValue(unit);
  };

  const handleWidthChange = (event) => {
    const unit = event.target.value;
    const newWidth = convert(widthValue).from(widthMeasuredValue).to(unit);
    setWidthValue(newWidth);
    setWidthMeasuredValue(unit);
  };
  return (
    <>
      <div className="height-input-container">
        <Typography className="height-text">Length</Typography>
        <Paper
          label={measured}
          variant="outlined"
          className="height-input-paper"
        >
          <TextField
            style={{
              width: "170%",
              height: "100%",
              border: "1px solid transparent",
            }}
            placeholder={measured}
            size="small"
            required={true}
            type="tel"
            value={lengthValue > 0 ? lengthValue.toFixed(2) : ""}
            disabled
            InputProps={{
              style: {
                fontSize: "16px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "400",
                borderRadius: "8px 0 0 8px",
                height: "100%",
              },
            }}
          />
          <Select
            input={<BootstrapInput />}
            MenuProps={{
              PaperProps: {
                style: {
                  borderRadius: "12px",
                },
              },
              MenuListProps: {
                sx: {
                  padding: "4px",
                },
              },
            }}
            renderValue={(lengthMeasuredValue) => {
              return (
                <Typography
                  modifiers={["subtitle"]}
                  style={{ color: "#6E757A" }}
                >
                  {lengthMeasuredValue === "in"
                    ? "inch"
                    : lengthMeasuredValue === "m"
                    ? "metre"
                    : lengthMeasuredValue}
                </Typography>
              );
            }}
            IconComponent={KeyboardArrowDownIcon}
            id="lengthUnit"
            onChange={handleLengthChange}
            value={lengthMeasuredValue}
            defaultValue={lengthMeasuredValue}
            style={{ height: "38px", width: "100%" }}
          >
            {["in", "m", "cm", "mm", "ft"].map((option, index) => (
              <MenuItem
                key={index}
                value={option}
                style={{
                  padding: "10px 8px 10px 12px",
                  borderRadius: "8px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor:
                    lengthMeasuredValue === option ? "#4B73EC" : "",
                }}
              >
                <Typography
                  modifiers={["subtitle2", "black600"]}
                  style={{
                    color: lengthMeasuredValue === option ? "white" : "",
                  }}
                >
                  {option === "in" ? "inch" : option === "m" ? "metre" : option}
                </Typography>
                {lengthMeasuredValue === option && (
                  <CheckIcon sx={{ color: "white", fontSize: "16px" }} />
                )}
              </MenuItem>
            ))}
          </Select>
        </Paper>
      </div>
      <div className="thickness-input-container">
        <Typography className="thickness-text">Thickness</Typography>
        <Paper
          label={measured}
          variant="outlined"
          className="height-input-paper"
        >
          <TextField
            style={{
              width: "170%",
              height: "100%",
              border: "1px solid transparent",
            }}
            placeholder={measured}
            size="small"
            required={true}
            type="tel"
            value={widthValue > 0 ? widthValue.toFixed(2) : ""}
            disabled
            InputProps={{
              style: {
                fontSize: "16px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "400",
                borderRadius: "8px 0 0 8px",
                height: "100%",
              },
            }}
          />
          <Select
            input={<BootstrapInput />}
            MenuProps={{
              PaperProps: {
                style: {
                  borderRadius: "12px",
                },
              },
              MenuListProps: {
                sx: {
                  padding: "4px",
                },
              },
            }}
            renderValue={(widthMeasuredValue) => {
              return (
                <Typography
                  modifiers={["subtitle"]}
                  style={{ color: "#6E757A" }}
                >
                  {widthMeasuredValue === "in"
                    ? "inch"
                    : widthMeasuredValue === "m"
                    ? "metre"
                    : widthMeasuredValue}
                </Typography>
              );
            }}
            IconComponent={KeyboardArrowDownIcon}
            id="lengthUnit"
            onChange={handleWidthChange}
            value={widthMeasuredValue}
            defaultValue={widthMeasuredValue}
            style={{ height: "38px", width: "100%" }}
          >
            {["in", "m", "cm", "mm", "ft"].map((option, index) => (
              <MenuItem
                key={index}
                value={option}
                style={{
                  padding: "10px 8px 10px 12px",
                  borderRadius: "8px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor:
                    widthMeasuredValue === option ? "#4B73EC" : "",
                }}
              >
                <Typography
                  modifiers={["subtitle2", "black600"]}
                  style={{
                    color: widthMeasuredValue === option ? "white" : "",
                  }}
                >
                  {option === "in" ? "inch" : option === "m" ? "metre" : option}
                </Typography>
                {widthMeasuredValue === option && (
                  <CheckIcon sx={{ color: "white", fontSize: "16px" }} />
                )}
              </MenuItem>
            ))}
          </Select>
        </Paper>
      </div>
    </>
  );
};

export default Properties;
