using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistencia.Paginacion;

namespace Aplicacion.Instructores
{
    public class PaginacionInstructor
    {
        public class Ejecuta : IRequest<PaginacionModel>
        {

            //filtro por Nombre
            public string Nombre { get; set; }
            public int NumeroPagina { get; set; }
            public int CantidadElementos { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecuta, PaginacionModel>
        {
            private readonly IPaginacion _paginacion;
            public Manejador(IPaginacion paginacion)
            {
                _paginacion = paginacion;
            }
            public async Task<PaginacionModel> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                //indicar el nombre del sp encargado de la paginacion
                var storedProcedure = "usp_obtener_instructor_paginacion";
                //cualquier columna que pertenzca a la tabla
                var odernamiento = "Nombre";
                //crear diccionario 
                var parametros = new Dictionary<string, object>();
                parametros.Add("NombreInstructor", request.Nombre);

                return await _paginacion.devolverPaginacion(storedProcedure, request.NumeroPagina, request.CantidadElementos, parametros, odernamiento);


            }
        }
    }
}