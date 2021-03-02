using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistencia;

namespace Aplicacion.Documentos
{
    public class ObtenerArchivo
    {
        public class Ejecuta : IRequest<ArchivoGenerico>{
            public Guid Id {get;set;}
        }
        public class Manejador : IRequestHandler<Ejecuta, ArchivoGenerico>
        {
            private readonly CursosContext _context;
            public Manejador(CursosContext context)
            {
                _context = context;
            }
            public async Task<ArchivoGenerico> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                //Consultar documentos desde la BD

                var archivo = await _context.Documento.Where(x=> x.ObjetoReferencia == request.Id).FirstOrDefaultAsync();
                if(archivo == null){
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.NotFound , new {message = "No se encontró la imagen"});
                }
                var archivoGenerico = new ArchivoGenerico {
                    Data = Convert.ToBase64String(archivo.Contenido),
                    Nombre = archivo.Nombre,
                    Extension = archivo.Extension
                };
                return archivoGenerico;
            }
        }
    }
}