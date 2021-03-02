using System;

namespace Persistencia.DapperConexion.Instructor
{
    public class InstructorModel
    {
        /*clase modelo que representa el mapeo de la bd*/
        public Guid InstructorId {get;set;}
        public string Nombre{get;set;}
        public string Apellidos{get;set;}
        public string Grado {get;set;}
        public DateTime? FechaCreacion{get;set;}
    }
}