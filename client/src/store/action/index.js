import { PRODUCTS_FETCH_SUCCESS } from "./actionType";

export const fetchProductSuccess = (payload) => {
  return { type: PRODUCTS_FETCH_SUCCESS, payload };
};

export const fetchProducts = () => {
  const baseUrl = "https://localhost:4000";
  const access_token = localStorage.getItem("access_token");
  return (dispatch, getState) => {
    //getState
    return fetch(`${baseUrl}/products`, {
      headers: {
        access_token: access_token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // setData(data);
        dispatch(fetchProductSuccess(data.data));
        console.log("getState Product>>>", getState());
      })
      .catch(console.log);
  };
};
