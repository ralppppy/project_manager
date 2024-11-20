const LayoutController = () => {
  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key].includes(value));
  };

  return {
    getKeyByValue,
  };
};
export default LayoutController;
