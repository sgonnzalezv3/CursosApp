using System.Linq;
using Aplicacion.Cursos;
using AutoMapper;
using Dominio;

namespace Aplicacion
{
    public class MappingProflie : Profile
    {
        public MappingProflie()
        {

            /*Mapeo manual porque curso no tiene una collecion de instructores la cual el cursoDto espera*/
            CreateMap<Curso,CursoDto>()
            .ForMember(x=> x.Instructores, y => y.MapFrom(z => z.InstructoresLink.Select(a => a.Instructor).ToList()))
            .ForMember(x => x.Comentarios, y=> y.MapFrom(z => z.ComentarioLista))
            .ForMember(x => x.Precio, y=> y.MapFrom(z => z.PrecioPromocion));
            
            CreateMap<CursoInstructor,CursoInstructorDto>();
            CreateMap<Dominio.Instructor,InstructorDto>();
            CreateMap<Comentario,ComentarioDto>();
            CreateMap<Precio,PrecioDto>();
        }
    }
}