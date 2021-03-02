import { initialState } from "./sesionUsuarioReducer";

const intialState = {
  open: false,
  mensaje: "",
};
const openSnackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_SNACKBAR":
      return {
        ...state,
        open: action.openMensaje.open, //true-false
        mensaje: action.openMensaje.mensaje, //string
      };
    default:
      return state;
  }
};
export default openSnackbarReducer;
