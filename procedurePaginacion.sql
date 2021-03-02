CREATE PROCEDURE usp_obtener_curso_paginacion (
	@NombreCurso nvarchar(500),
	@Ordenamiento nvarchar(500),
	@NumeroPagina int,
	@CantidadElementos int,
	@TotalRecords int OUTPUT,
	@TotalPaginas int OUTPUT

)AS
BEGIN
	SET NOCOUNT ON
	--EVITAR CONFLICTOS REALIZANDO LA CONSULTA
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	DECLARE @Inicio int
	DECLARE @Fin int

	IF @NumeroPagina = 1
		BEGIN
			SET @Inicio = (@NumeroPagina*@CantidadElementos) - @CantidadElementos
			SET @Fin = @NumeroPagina * @CantidadElementos
		END
	ELSE
		BEGIN
			SET @Inicio =  ((@NumeroPagina*@CantidadElementos) - @CantidadElementos) + 1
			SET @Fin = @NumeroPagina * @CantidadElementos
		END

	--tabla temporal
	CREATE TABLE #TMP(
		rowNumber int IDENTITY(1,1),
		ID uniqueidentifier
	)
	--variable que represente el query la consulta
	DECLARE @SQL nvarchar(max)
	SET @SQL = ' SELECT CursoId FROM Curso '

	IF @NombreCurso IS NOT NULL
		BEGIN
			SET @SQL = @SQL + ' WHERE Titulo LIKE ''%' + @NombreCurso +'%''  '
		END
	IF @Ordenamiento IS NOT NULL
		BEGIN
			SET @SQL = @SQL + ' ORDER BY ' + @Ordenamiento
		END


	INSERT INTO #TMP( ID )
	EXEC sp_executesql @SQL

	SELECT @TotalRecords =COUNT(*) FROM #TMP

	IF @TotalRecords > @CantidadElementos
		BEGIN
			SET @TotalPaginas = @TotalRecords / @CantidadElementos
			if(@TotalRecords % @CantidadElementos) > 0
				BEGIN
					SET @TotalPaginas = @TotalPaginas + 1
				END
		END
	ELSE
		BEGIN
			SET @TotalPaginas = 1
		END

		SELECT 
			c.CursoId,
			c.Titulo,
			c.Descripcion,
			c.FechaPublicacion,
			c.Foto,
			C.FechaCreacion,
			p.PrecioActual,
			p.Promocion

		FROM #TMP  t INNER JOIN  dbo.Curso c 
							ON t.ID = c.CursoId
					 LEFT JOIN Precio p
							ON c.CursoId = p.CursoId
	     WHERE t.rowNumber >= @Inicio AND t.rowNumber <= @Fin
END