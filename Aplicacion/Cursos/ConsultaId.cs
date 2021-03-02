using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using AutoMapper;
using Dominio;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistencia;

namespace Aplicacion.Cursos
{
    public class ConsultaId
    {
        //clase cabezera de la consulta que permita agregar parametros

        public class CursoUnico : IRequest<CursoDto>
        {
            public Guid Id { get; set; }
        }
        //metodo donde se coloca la logica de la transaccion

        public class Manejador : IRequestHandler<CursoUnico, CursoDto>
        {
            private readonly CursosContext _context;
            private readonly IMapper _mapper;
            public Manejador(CursosContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<CursoDto> Handle(CursoUnico request, CancellationToken cancellationToken)
            {
                var curso = await _context.Curso
                .Include(x => x.ComentarioLista)
                .AsSingleQuery()
                .Include(x => x.PrecioPromocion)
                .AsSingleQuery()
                .Include(x => x.InstructoresLink)
                .ThenInclude(y => y.Instructor)
                .AsSingleQuery()
                .FirstOrDefaultAsync(a => a.CursoId == request.Id); // se obtiene apartir del id 
                if (curso == null)
                {
                    // throw new System.Exception("The course doesn't exist");

                    //usamos nuestra excepcion
                    throw new ManejadorExcepcion(HttpStatusCode.NotFound, new { course = "Course Not Found!" });
                }
                var cursoDto = _mapper.Map<Curso, CursoDto>(curso);
                return cursoDto;
            }
        }

    }
}