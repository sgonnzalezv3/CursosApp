import HttpCliente from "../Servicios/HttpClient";

export const guardarCurso = async (curso, imagen) => {
  //definir los edpoints
  const endPointCurso = "/cursos";
  const promesaCurso = HttpCliente.post(endPointCurso, curso);
  //si existe...
  if (imagen) {
    const endPointImagen = "/documento";
    const promesaImagen = HttpCliente.post(endPointImagen, imagen);
    return await Promise.all([promesaCurso, promesaImagen]);
  } else {
    //si es nula la imagen
    return await Promise.all([promesaCurso]);
  }
};
//Implementar la paginación
export const PaginacionCurso = (paginador) => {
  return new Promise((resolve, eject) => {
    HttpCliente.post("/cursos/report", paginador).then((response) => {
      resolve(response);
      console.log("santiCursos",response);

    });
  });
};
