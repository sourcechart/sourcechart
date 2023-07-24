// Frequently used Queries and Workflows.

function getCustomerSegmentationQuery(columns: string[], table: string, attributes: string[]) {
	return `SELECT ${columns.join(', ')} FROM ${table}`;
}

export default { getCustomerSegmentationQuery };
