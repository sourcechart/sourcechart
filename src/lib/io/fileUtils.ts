export function getTableName(name: string): string {
	var f_name = stripSpaces(name);
	return f_name.substring(0, name.lastIndexOf('.'));
}

export function stripSpaces(name: string): string {
	var f_name = name.trim().replace('/s+/g', '_');
	return f_name.split(' ').join('_').replace('(|)/g', '');
}

export const generateID = () => '_' + Math.random().toString(36).substr(2, 9);