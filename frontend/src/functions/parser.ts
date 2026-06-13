import { apiFetch } from './apiClient';

export async function uploadExcelSpreadsheet(formData: FormData, token: string) {
  return apiFetch('/api/parser/upload', {
    method: 'POST',
    token,
    bodyData: formData,
  });
}
