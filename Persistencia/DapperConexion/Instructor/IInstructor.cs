using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Persistencia.DapperConexion.Instructor
{
    public interface IInstructor
    {
         // operaciones para realizar a la tabla instructor

         //definir modelo de datos
         //interfaz que representa las opreaciones que se van a realizar
         Task<IEnumerable<InstructorModel>> ObtenerLista();

         Task<InstructorModel> ObtenerPorId(Guid id);

         //es int porque retorna la lista de transacciones que se han hecho
         Task<int> Nuevo(Guid? instructorId, string nombre, string apellidos, string grado);
         Task<int> Actualiza(Guid instructorId, string nombre, string apellidos, string grado);
         Task<int> Elimina(Guid id);

         
         
    }
}