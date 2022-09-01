import { PRODUCTS_FETCH_SUCCESS } from "../action/actionType";

const initialState = { products: [], product: {} };

function productReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_FETCH_SUCCESS:
      console.log(action.payload, "<<<<<<<action payload");
      return { ...state, products: action.payload };

    default:
      return state;
  }
}

export default productReducer;
