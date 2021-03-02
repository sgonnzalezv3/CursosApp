using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Persistencia.DapperConexion;
using Persistencia.Paginacion;

namespace Persistencia.DapperConexion.Paginacion
{
    public class PaginacionRepositorio : IPaginacion
    {
        private readonly IFactoryConnection _factoryConnection;
        public PaginacionRepositorio(IFactoryConnection factoryConnection)
        {
            _factoryConnection = factoryConnection;
        }
        public async Task<PaginacionModel> devolverPaginacion(string storedProcedure, int numeroPagina, int cantidadElementos, IDictionary<string, object> parametrosFiltro, string ordenamientoColumna)
        {
            PaginacionModel paginacionModel = new PaginacionModel();
            List<IDictionary<string, object>> listReporte = null;
            int totalRecords = 0;
            int totalPaginas = 0;
            try
            {
                //crear la conexion
                var connection = _factoryConnection.GetConnection();

                //parametros
                DynamicParameters parametros = new DynamicParameters();


                //insertado todas las posibles filtros posibles del sp
                foreach (var param in parametrosFiltro)
                {
                    parametros.Add("@" + param.Key, param.Value);
                }

                //parametros ingresados
                parametros.Add("@NumeroPagina", numeroPagina);
                parametros.Add("@CantidadElementos", cantidadElementos);
                parametros.Add("@Ordenamiento", ordenamientoColumna);

                //parametros de vuelta que retorna el sp
                parametros.Add(@"TotalRecords", totalRecords, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
                parametros.Add(@"TotalPaginas", totalPaginas, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

                var result = await connection.QueryAsync(storedProcedure, parametros, commandType: System.Data.CommandType.StoredProcedure);
                listReporte = result.Select(x => (IDictionary<string, object>)x).ToList();

                //data de la lista
                paginacionModel.ListaRecords = listReporte;
                paginacionModel.numeroPaginas = parametros.Get<int>("@TotalPaginas");
                paginacionModel.TotalRecords = parametros.Get<int>("@TotalRecords");

            }
            catch (Exception e)
            {

                throw new Exception("no se pudo ejecutar el store procedure", e);
            }
            finally
            {
                _factoryConnection.CloseConnection();
            }
            return paginacionModel;
        }
    }
}