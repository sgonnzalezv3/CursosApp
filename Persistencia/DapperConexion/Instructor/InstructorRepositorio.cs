using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;

namespace Persistencia.DapperConexion.Instructor
{
    //implementando la interfaz IInstructor
    public class InstructorRepositorio : IInstructor
    {
        //Factoria de conexion
        private readonly IFactoryConnection _factoryConnection;
        public InstructorRepositorio(IFactoryConnection factoryConnection)
        {
            _factoryConnection = factoryConnection;
        }

        public async Task<int> Actualiza(Guid instructorId, string nombre, string apellidos, string grado)
        {
            var storeProcedure = "usp_instructor_editar";
            try
            {
                var connection = _factoryConnection.GetConnection();
                var resultados = await connection.ExecuteAsync(
                    storeProcedure,
                    new
                    {
                        InstructorId = instructorId,
                        Nombre = nombre,
                        Apellidos = apellidos,
                        Grado = grado
                    },
                    commandType: System.Data.CommandType.StoredProcedure
                );
                _factoryConnection.CloseConnection();
                return resultados;
            }
            catch (System.Exception)
            {

                throw new Exception("No se ha podido editar la data del instructor");
            }
        }

        public async Task<int> Elimina(Guid id)
        {
            var storeProcedure = "usp_instructor_elimina";
            try
            {
                var connection = _factoryConnection.GetConnection();
                var resultado = await connection.ExecuteAsync(
                    storeProcedure,
                    new
                    {
                        InstructorId = id
                    },
                    commandType: System.Data.CommandType.StoredProcedure
                );
                _factoryConnection.CloseConnection();
                return resultado;
            }
            catch (System.Exception e)
            {

                throw new Exception("No se ha podido eliminar el instructor", e);
            }
        }

        public async Task<int> Nuevo(Guid? instructorId, string nombre, string apellidos, string grado)
        {
            var storeProcedure = "usp_instructor_nuevo";
            try
            {
                var connection = _factoryConnection.GetConnection();
                Guid _instructorId = Guid.NewGuid();
                if (instructorId == null)
                {
                    instructorId = _instructorId;
                }

                var resultado = await connection.ExecuteAsync(
                     storeProcedure, //nombre de SP
                     new
                     { //valores que se van a insertar
                         InstructorId = instructorId,
                         Nombre = nombre,
                         Apellidos = apellidos,
                         Grado = grado
                     },
                     commandType: System.Data.CommandType.StoredProcedure // tipo de operacion
                     );
                _factoryConnection.CloseConnection();
                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception("no se pudo guardar el nuevo instructor", e);
            }
        }

        public async Task<IEnumerable<InstructorModel>> ObtenerLista()
        {
            IEnumerable<InstructorModel> instructorList = null;
            //nombree al store procedure            
            var storeProcedure = "usp_Obtener_Instructores";
            try
            {
                //llamar la cadena de conexion
                var connection = _factoryConnection.GetConnection();
                //hacer la consulta de la data
                //                                              nombre del storeprocedure, parametros y tipo de transaccion o query.
                instructorList = await connection.QueryAsync<InstructorModel>(storeProcedure, null, commandType: System.Data.CommandType.StoredProcedure);
            }
            catch (Exception e)
            {
                throw new Exception("error en la consulta de datos", e);
            }
            finally
            {
                //cerrar la conexion
                _factoryConnection.CloseConnection();
            }
            //retornar data obtenida
            return instructorList;
        }

        public async Task<InstructorModel> ObtenerPorId(Guid id)
        {
            //crear el SP
            var storeProcedure = "usp_obtenerbyid_instructor";
            InstructorModel instructor = null;
            try
            {
                var connection = _factoryConnection.GetConnection();
                instructor = await connection.QueryFirstAsync<InstructorModel>(
                  storeProcedure,
                  new
                  {
                      Id = id
                  },
                  commandType: System.Data.CommandType.StoredProcedure
                );
                return instructor;
            }
            catch (System.Exception e)
            {

                throw new Exception("No se ha podido encontrar el instructor", e);
            }
        }
    }
}