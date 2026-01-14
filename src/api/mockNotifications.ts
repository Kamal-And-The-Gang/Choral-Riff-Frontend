import type { NotificationDTO } from "../types/notificationTypes";

export const mockNotifications: NotificationDTO[] = [
  {
    id: 1,
    type: "INVITATION",
    message:
      'Vous êtes invité à rejoindre l\'ensemble "Harmonie Chorale" par Sophie L.',
    isRead: false, //  Non lu
    createdAt: new Date(Date.now() - 3600000).toISOString(), // Il y a 1 heure
    token: "mock-token-123", // ← nécessaire
    ensembleId: 101,
    ensembleNom: "Harmonie Chorale",
    invitationId: 501,
    status: "EN_ATTENTE", //  En attente d'action
    senderName: "Sophie L.",
  },
  {
    id: 2,
    type: "INVITATION",
    message: 'Vous avez été ajouté à l\'ensemble "Les Riffs Jazz" !',
    isRead: true, //  Lu, action déjà prise
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Il y a 1 jour
    ensembleId: 102,
    ensembleNom: "Les Riffs Jazz",
    invitationId: 502,
    status: "ACCEPTEE", //  Accepté
  },
  {
    id: 3,
    type: "MORCEAU_AJOUTE",
    message:
      'Le morceau "Ode à la Joie" a été ajouté à l\'ensemble Harmonie Chorale.',
    isRead: false, //  Non lu
    createdAt: new Date(Date.now() - 60000).toISOString(), // Il y a 1 minute
    ensembleId: 101,
    ensembleNom: "Harmonie Chorale",
  },
  {
    id: 4,
    type: "GENERAL",
    message: "Votre abonnement annuel a été renouvelé avec succès.",
    isRead: false, //  Non lu
    createdAt: new Date(Date.now() - 10000).toISOString(), // Il y a 10 secondes (très récente)
  },
  {
    id: 5,
    type: "GENERAL",
    message: "Bienvenue sur Choral Riff ! Découvrez les fonctionnalités.",
    isRead: true, // Lu
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // Il y a 1 mois
  },
  {
    id: 6,
    type: "INVITATION",
    message: 'Invitation à l\'ensemble "Choeur Baroque" refusée.',
    isRead: true, // Lu
    createdAt: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
    ensembleId: 103,
    ensembleNom: "Choeur Baroque",
    invitationId: 503,
    status: "REFUSEE", //  Refusé
  },
];
