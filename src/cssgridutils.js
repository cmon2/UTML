var provideCSSGridUtils = module.exports = function(CSSGrid)
{
	CSSGrid.countRows = countRows;
	CSSGrid.countColumns = countColumns;
	
	return CSSGrid;
}

function countRows()
{
	return this.style.gridTemplateRows.split(" ").length;
}

function countColumns()
{
	return this.style.gridTemplateColumns.split(" ").length;
}