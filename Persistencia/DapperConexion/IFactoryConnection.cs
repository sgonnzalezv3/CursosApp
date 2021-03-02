using System.Data;

namespace Persistencia.DapperConexion
{
    public interface IFactoryConnection
    {
        //cerrar la conexion
         void CloseConnection();

         //devuelve un objeto de conexion de dapper
         IDbConnection GetConnection();
    }
}