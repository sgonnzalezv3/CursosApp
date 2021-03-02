/* almacenar globalmente la data del usuario que está en sesion
    en la app */

/*1) definir los valores que almacena */
/*2) logica que va ejecutar dependiendo de lo que el usuario quiere hacer */
/*3) Exportar la funcion */

//valores que va a almacenar el reducer
export const initialState = {
  usuario: {
    nombreCompleto: "",
    email: "",
    username: "",
    foto: "",
  },
  //estado de la sesion del usuario
  autenticado: false,
};

//manejar la data que se va modificar
//action determina lo que se va hacer con la data
const sesionUsuarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion, // trae data en json de los datos del usuario
        autenticado: action.autenticado,
      };
    case "SALIR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
      };
    case "ACTUALIZAR_USUARIO":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
      };
    default:
      return state;
  }
};
export default sesionUsuarioReducer;
