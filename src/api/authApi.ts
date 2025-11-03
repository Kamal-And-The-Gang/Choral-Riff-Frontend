import type { components } from "./types.generated";

// src/api/authApi.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'https://51.210.7.37/api';

export type RegisterDto = components['schemas']['RegisterDto'];
export type LoginDTO = components['schemas']['LoginDTO'];
export type UtilisateurDto = components['schemas']['UtilisateurDto'];

// --- Requête d'inscription ---
export async function registerUser(data: RegisterDto): Promise<UtilisateurDto> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erreur d'inscription");
  }

  return response.json();
}

// --- Requête de connexion ---
export async function loginUser(data: LoginDTO): Promise<Record<string, string>> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erreur de connexion");
  }
  return response.json();
}

  export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
  return response.json();
}