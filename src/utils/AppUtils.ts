const getStateColor = (state:string) => {
  switch (state) {
    case "Online":
      return "green";
    case "Offline":
      return "red";
    case "Warning":
      return "orange";
    default:
      return "gray";
  }
}

export default getStateColor;

