import { apiFetch } from './apiClient';

export async function fetchForms(token: string) {
  return apiFetch('/api/forms', { token });
}

export async function fetchFormById(id: string, token: string) {
  return apiFetch(`/api/forms/${id}`, { token });
}

export async function fetchFormAnalytics(id: string, token: string) {
  return apiFetch(`/api/forms/${id}/analytics`, { token });
}

export async function saveForm(form: any, token: string) {
  return apiFetch('/api/forms', {
    method: 'POST',
    token,
    bodyData: form,
  });
}

export async function updateForm(id: string, form: any, token: string) {
  return apiFetch(`/api/forms/${id}`, {
    method: 'PUT',
    token,
    bodyData: form,
  });
}

export async function deleteForm(id: string, deleteFromDrive: boolean, token: string) {
  return apiFetch(`/api/forms/${id}?deleteFromDrive=${deleteFromDrive}`, {
    method: 'DELETE',
    token,
  });
}

export async function importGoogleForm(googleFormUrlOrId: string, token: string) {
  return apiFetch('/api/forms/import', {
    method: 'POST',
    token,
    bodyData: { googleFormUrlOrId },
  });
}

export async function exportToGoogleForms(id: string, token: string) {
  return apiFetch(`/api/forms/${id}/export`, {
    method: 'POST',
    token,
  });
}
