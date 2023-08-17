import { fileUploadStore } from './Stores';

export const createFileStore = (filename: string, fileSize: number, dataID: string) => {
	var tableColumnsSize = {
		filename: filename,
		datasetID: dataID,
		size: fileSize,
		fileextension: filename.split('.').pop()
	};

	fileUploadStore.update((fileUploadStore) => [...fileUploadStore, tableColumnsSize]);
};
