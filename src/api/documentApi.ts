import type { components } from "./types.generated";

export type DocumentDto = components["schemas"]["DocumentDto"];

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// --- GET ---
export async function getAllDocuments(): Promise<DocumentDto[]> {
  const res = await fetch(`${BASE_URL}/documents`);
  if (!res.ok) throw new Error("Erreur lors du chargement des documents");
  return res.json();
}

export async function getDocumentById(id: number): Promise<DocumentDto> {
  const res = await fetch(`${BASE_URL}/documents/${id}`);
  if (!res.ok) throw new Error("Erreur lors du chargement du document");
  return res.json();
}

export async function getDocumentsByMorceau(morceauId: number): Promise<DocumentDto[]> {
  const res = await fetch(`${BASE_URL}/documents/morceau/${morceauId}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des documents du morceau");
  return res.json();
}

export async function getDocumentsByUtilisateur(utilisateurId: number): Promise<DocumentDto[]> {
  const res = await fetch(`${BASE_URL}/documents/utilisateur/${utilisateurId}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des documents de l'utilisateur");
  return res.json();
}

export async function getDocumentsByEnsemble(ensembleId: number): Promise<DocumentDto[]> {
  const res = await fetch(`${BASE_URL}/documents/ensemble/${ensembleId}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des documents de l'ensemble");
  return res.json();
}

// --- UPLOAD ---
export async function uploadDocument(
  file: File,
  type: string,
  format: string,
  morceauId: number,
  utilisateurId: number
): Promise<DocumentDto> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("format", format);
  formData.append("morceauId", morceauId.toString());
  formData.append("utilisateurId", utilisateurId.toString());

  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Erreur lors de l'upload du document");
  return res.json();
}