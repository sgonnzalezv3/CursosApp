import axios from "axios";
//indicar endpoint base en el cual trabajan los webservices
//axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.baseURL = 'https://coursesresource.azurewebsites.net/api';
//axios.defaults.baseURL = 'https://cursosapp.azurewebsites.net/api';
//axios.defaults.baseURL = 'https://cursogestion.azurewebsites.net/api'

// Agregar un interceptor para que todos los request que salen, incluyan en la cabecera el token!



axios.interceptors.request.use(
  (config) => {
    //capturar el token almacenado en el storage del browser
    const token_seguridad = window.localStorage.getItem("token_seguridad");
    //validar si existe
    if (token_seguridad) {
      config.headers.Authorization = "Bearer " + token_seguridad;
      return config;
    }
  },
  //por si hubo un error
  (error) => {
    return Promise.reject(error);
  });

  

//crear objeto generico que representa los request que se envian al servidor
const requestGenerico = {
  get: (url) => axios.get(url),
  //end point y json
  post: (url, body) => axios.post(url, body),
  put: (url, body) => axios.put(url, body),
  delete: (url) => axios.delete(url),
};
export default requestGenerico;
