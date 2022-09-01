import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { logger } from "./middlewares/logger";
import rootReducer from "../store/reducers/rootReducer";
import thunk from "redux-thunk";

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(rootReducer, applyMiddleware(logger, thunk));

export default store;
