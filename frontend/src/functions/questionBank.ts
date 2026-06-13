import { apiFetch } from './apiClient';

export async function fetchQuestionBank(token: string) {
  return apiFetch('/api/question-bank', { token });
}

export async function saveQuestionToBank(question: any, token: string) {
  return apiFetch('/api/question-bank', {
    method: 'POST',
    token,
    bodyData: question,
  });
}

export async function deleteQuestionFromBank(id: string, token: string) {
  return apiFetch(`/api/question-bank/${id}`, {
    method: 'DELETE',
    token,
  });
}
