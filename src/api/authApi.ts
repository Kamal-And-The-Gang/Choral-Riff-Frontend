// src/api/authApi.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export type RegisterData = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
};

export type LoginData = {
  email: string;
  motDePasse: string;
};

// --- Requête d'inscription ---
export async function registerUser(data: RegisterData) {
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
export async function loginUser(data: LoginData) {
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