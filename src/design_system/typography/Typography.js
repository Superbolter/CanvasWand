import React from "react";
import { StyledText } from "./PrimitiveTextStyles";

class Typography extends React.Component {
  render() {
    const { textColor, size, weight, type, children, className } = this.props;
    let assignWeight = weight;
    if (!assignWeight) {
      if (size === "overline") {
        assignWeight = 2;
      } else if (size === "button") {
        assignWeight = 2;
      } else {
        assignWeight = 1;
      }
    }
    let tagType = type || "div";
    return (
      <StyledText
        size={size}
        assignWeight={assignWeight}
        textColor={textColor}
        as={tagType}
        className={className}
      >
        {children}
      </StyledText>
    );
  }
}

export default Typography;
