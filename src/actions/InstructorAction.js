import HttpCliente from "../Servicios/HttpClient";

export const guardarInstructor = async (instructor, imagen) => {
  //definir los edpoints
  const endPointInstructores = "/instructor";
  const promesaInstructor = HttpCliente.post(endPointInstructores, instructor);
  //si existe...
  if (imagen) {
    const endPointImagen = "/documento";
    const promesaImagen = HttpCliente.post(endPointImagen, imagen);
    return await Promise.all([promesaInstructor, promesaImagen]);
  } else {
    //si es nula la imagen
    return await Promise.all([promesaInstructor]);
  }
};
//Implementar la paginación
export const PaginacionInstructor = (paginador) => {
    return new Promise((resolve, eject) => {
      HttpCliente.post("/Instructor/report", paginador).then((response) => {
        resolve(response);
      });
    });
  };