const colorStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return { ...styles, color: "black", cursor: "pointer" };
  },
};

export default colorStyles;
