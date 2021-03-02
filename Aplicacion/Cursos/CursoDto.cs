using System;
using System.Collections.Generic;

namespace Aplicacion.Cursos
{
    public class CursoDto
    {
        /* DTO clase especial orientada a entregar data especifica a un cliente  */
        public Guid CursoId { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public System.DateTime? FechaPublicacion { get; set; }
        public System.DateTime? FechaCreacion { get; set; }
        public byte[] Foto { get; set; }

        /* propiedad que represente la lista de instructores*/
        public ICollection<InstructorDto> Instructores {get;set;}
        public PrecioDto Precio{get;set;}
        public ICollection<ComentarioDto> Comentarios {get;set;}


    }
}