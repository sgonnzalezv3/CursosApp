import HttpCliente from "../Servicios/HttpClient";
import axios from "axios";

//invacando axios para que permite hacer un request y response valido sin token
const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;

//solo instancia se usa en login y registrarusuario porque no deben usar el token de seguridad para consumir algo del asp.net

export const registroUsuario = (usuario) => {
  /* Indicando que no va terminar esta funcion hasta que el server no haya retornado los valores solicitados */
  return new Promise((resolve, eject) => {
    // se envia un request dado el endpoint y la data (usuario) y devuele un objeto response
    instancia.post("/usuario/registrar", usuario).then((response) => {
      // confirmar el proceso para continuar con la logica
      resolve(response);
      console.log("Se ha registrado", response.status);

    }).catch((error) => {
      console.log("Credenciales incorrectas", error);
    });
  });
};

export const obtenerUsuarioActual = (dispatch) => {
  return new Promise((resolve, eject) => {
    //invocar a un endpoint que devuelva la data del usuario

    // se envia un request dado el endpoint y la data (usuario) y devuele un objeto response
    HttpCliente.get("/usuario").then((response) => {
      //existe o no existe la data de imagenPerfil
      if (response.data && response.data.imagenPerfil) {
        //capturar la data de imgen perfil
        let fotoPerfil = response.data.imagenPerfil;
        //nueva representacion de la foto
        const nuevoFile =
          "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
        //cargarlo
        response.data.imagenPerfil = nuevoFile;
      }
      dispatch({
        type: "INICIAR_SESION",
        sesion: response.data,
        autenticado: true,
      });
      resolve(response);
    }).catch((error) => {
      console.log('error actualizar ', error);
      resolve(error);
    })
  });
};
/* Tiene un paramaetro el cual es usuario */
export const actualizarUsuario = (usuario, dispatch) => {
  return new Promise((resolve, eject) => {
    HttpCliente.put("/usuario", usuario)
      .then((response) => {
        //actualizar el reducer

        //evaluar la data aver si tiene la imagende perfil
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }
        //refrescar la data del usuario actual
        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

//funcion que permite realizar login
//dispatch para obtener la data del usuario en sesion
export const loginUsuario = (usuario, dispatch) => {
  return new Promise((resolve, eject) => {
    instancia.post("/usuario/login", usuario)
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }

        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};
