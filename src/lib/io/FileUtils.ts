export function getTableName(name: string): string {
	var f_name = stripSpaces(name);
	return f_name.substring(0, name.lastIndexOf('.'));
}

export function stripSpaces(name: string): string {
	var f_name = name.trim().replace('/s+/g', '_');
	return f_name.split(' ').join('_').replace('(|)/g', '');
}

export function checkNameForSpacesAndHyphens(column?: string | null) {
	if (!column) return ''; // Return an empty string for null or undefined values

	if (!column.match('^[a-zA-Z0-9]+$')) {
		column = ['"', column, '"'].join('');
	}

	return column;
}

export function getFileExtension(filename: string) {
	return filename.split('.').pop();
}
