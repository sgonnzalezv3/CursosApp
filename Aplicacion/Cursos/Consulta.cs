using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Dominio;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistencia;

namespace Aplicacion.Cursos
{
    public class Consulta
    {
        /* Clase que representa lo que va delvolver cuando se ejecuta la clase consulta. consumir data*/
        public class ListaCursos : IRequest<List<CursoDto>>{}

        //Logica de la transaccion incorporarla
        public class Manejador : IRequestHandler<ListaCursos, List<CursoDto>>
        {
            private readonly CursosContext _context;
            private readonly IMapper _mapper;
            //Inyectando
            public Manejador(CursosContext context, IMapper mapper){
                _context = context;
                _mapper = mapper;
            }
            /*AutoMapper Permite convertir la data de una clase entitycore a una clase dto
            DataTransferObject
             */

            public async  Task<List<CursoDto>> Handle(ListaCursos request, CancellationToken cancellationToken)
            {
                // importar consumir al objeto de entityf desde la bd para devolver la lista de cursos
                var cursos = await _context.Curso
                .Include(x=> x.ComentarioLista)
                .AsSingleQuery()
                .Include(x=> x.PrecioPromocion)
                .AsSingleQuery()
                .Include(x=> x.InstructoresLink)
                .ThenInclude(x=> x.Instructor)
                .AsSingleQuery().ToListAsync();

                /*s solicita el dato origen y el segundo en dato destino que quiere que se convierta*/
                var cursosDto = _mapper.Map<List<Curso>, List<CursoDto>>(cursos);
                
                return cursosDto;
            }
        }

    }
}