using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using MediatR;
using Persistencia;

namespace Aplicacion.Cursos
{
    public class Eliminar
    {
        public class Ejecuta : IRequest
        {
            public Guid Id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly CursosContext _context;
            public Manejador(CursosContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var instructoresDB = _context.CursoInstructor.Where(x=> x.CursoId == request.Id);
                /*eliminando de la tabla lista instructores del curso en la tabla cursoInstructor*/
                foreach(var instructor in instructoresDB){
                    _context.CursoInstructor.Remove(instructor);
                }

                /*Obtener toda la lista de comentarios*/
                var comentariosDb = _context.Comentario.Where(x => x.CursoId == request.Id);
                foreach(var cmt in comentariosDb){
                    _context.Comentario.Remove(cmt);
                }
                var precioDB = _context.Precio.Where(x => x.CursoId == request.Id).FirstOrDefault();
                if(precioDB != null){
                    _context.Precio.Remove(precioDB);
                }


                var curso = await _context.Curso.FindAsync(request.Id);
                if (curso == null)
                {
                   // throw new System.Exception("The course doesn't exist");
                   //usamos nuestra excepcion
                   throw new ManejadorExcepcion(HttpStatusCode.NotFound , new {mensaje = "Course Not Found"});
                }
                _context.Remove(curso);

                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return Unit.Value;
                }
                
                throw new System.Exception("course delete were not saved");
            }
        }

    }
}