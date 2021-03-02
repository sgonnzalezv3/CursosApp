using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Dominio;
using FluentValidation;
using MediatR;
using Persistencia;

namespace Aplicacion.Cursos
{
    public class Nuevo
    {
        //transaccion que se va a ejecutar en el web api a futuro para ejecutar la tarea
        //tambien sirve para insertar parametros
        public class Ejecuta : IRequest
        {

            //insertamos los parametros   
            public Guid? CursoId {get;set;}
            public string Titulo { get; set; }
            public string Descripcion { get; set; }
            public System.DateTime? FechaPublicacion { get; set; }
            public List<Guid> ListaInstructor { get; set; }
            public decimal Precio {get;set;}
            public decimal Promocion {get;set;}
        }
        //clase para validar
        public class EjecutaValidacion : AbstractValidator<Ejecuta>
        {
            public EjecutaValidacion()
            {
                RuleFor(x => x.Titulo).NotEmpty();
                RuleFor(x => x.Descripcion).NotEmpty();
                RuleFor(x => x.FechaPublicacion).NotEmpty();
            }
        }

        //clase que representa la logica
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly CursosContext _context;
            public Manejador(CursosContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                //cancelationToken es para cuando el cliente cancelar el request, para que no consuma memoria y no afecte la performance

                //Logica para insertar un nuevo valor en curso
                Guid _cursoId = Guid.NewGuid();

                if(request.CursoId != null){
                    _cursoId = request.CursoId ?? Guid.NewGuid();
                }
                var curso = new Curso
                {
                    CursoId = _cursoId,
                    Titulo = request.Titulo,
                    Descripcion = request.Descripcion,
                    FechaPublicacion = request.FechaPublicacion
                };

                _context.Curso.Add(curso);

                //Agregar datos a listaInstructor
                if (request.ListaInstructor != null)
                {
                    foreach (var id in request.ListaInstructor)
                    {
                        var cursoInstructor = new CursoInstructor
                        {
                            CursoId = _cursoId,
                            InstructorId = id
                        };
                        _context.CursoInstructor.Add(cursoInstructor);
                    }
                }
                /* Logica para agregar el precio*/

                var precioEntidad = new Precio{
                    CursoId = _cursoId,
                    PrecioActual = request.Precio,
                    Promocion = request.Promocion,
                    PrecioId = Guid.NewGuid()

                };
                _context.Precio.Add(precioEntidad);


                //valor retorna el numero de opearciones que se estan haciendo en la bd
                var valor = await _context.SaveChangesAsync();
                if (valor > 0)
                { // si es mayor que 0, proceso exitoso
                    return Unit.Value;
                }

                throw new System.Exception("No se ha podido insertar el curso");

            }
        }

    }
}