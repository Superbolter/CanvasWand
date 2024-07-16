import Color from "../colors/colors.js";

function ButtonBg(bgColor, clear, size) {
  // background and padding size for the headings
  var borderColor = bgColor;
  const bgSize = {
    h1: ["auto", "80px"],
    h2: ["auto", "64px"],
    h3: ["auto", "56px"],
    h4: ["auto", "40px"],
    h5: ["auto", "32px"],
  };

  const paddingSize = {
    h1: "0px 32px",
    h2: "0px 32px",
    h3: "4px 32px",
    h4: "4px 24px",
    h5: "4px 24px",
  };
  borderColor = Color[bgColor];

  // Condition checking for transparent, else bgColor remains in the same state
  // Note that bgColor if transparent cannot be used for other things later
  if (clear === "1") {
    bgColor = "transparent";
  }

  // Specifications for btnBg
  var bg = {
    flexDirection: "row",
    padding: paddingSize[size],
    width: bgSize[size][0],
    height: bgSize[size][1],
    backgroundColor: Color[bgColor],
    borderRadius: "90px",
    position: "relative",
    border: "1px solid " + borderColor,
  };

  return bg;
}

export default ButtonBg;
