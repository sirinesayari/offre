/*eslint-disable*/
function isEmpty(value) {
    if (value === undefined || value === null || value === "") {
      return true;
    }
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return true;
    }
    if (typeof value === "string" && value.trim().length === 0) {
      return true;
    }
    return false;
  }
  
  export default isEmpty;
  