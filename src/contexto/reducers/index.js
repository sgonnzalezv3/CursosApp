/*importar reducers  */
import sesionUsuarioReducer from "./sesionUsuarioReducer";
import openSnackbarReducer from "./openSnackBarReducer";

export const mainReducer = ({ sesionUsuario, openSnackbar }, action) => {
  return {
      //se sobreescribe dependiendo al action que invoque los reducers
      
    sesionUsuario: sesionUsuarioReducer(sesionUsuario, action),
    openSnackbar: openSnackbarReducer(openSnackbar, action),
  };
};
