export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
console.log(BACKEND_URL);
interface RequestOptions extends RequestInit {
  token?: string;
  bodyData?: any;
}

export async function apiFetch(path: string, options: RequestOptions = {}) {
  const { token, bodyData, headers = {}, ...rest } = options;
  
  const defaultHeaders: Record<string, string> = {};
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  if (bodyData && !(bodyData instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    } as HeadersInit,
  };

  if (bodyData) {
    config.body = bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData);
  }

  const url = path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
  const response = await fetch(url, config);
  
  return response;
}
