import { z } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors.map(e => ({ champ: e.path.join('.'), message: e.message }))
      });
    }
  };
}

export const registerSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  telephone: z.string().optional(),
  role: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(1, 'Mot de passe requis')
});

export const bienSchema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  type: z.enum(['LOCATION', 'VENTE']),
  prix: z.coerce.number().positive('Le prix doit être positif'),
  surface: z.coerce.number().positive('La surface doit être positive').optional(),
  chambres: z.coerce.number().int().positive().optional(),
  sallesBain: z.coerce.number().int().positive().optional(),
  localisation: z.string().min(3, 'La localisation est requise'),
  ville: z.string().min(2, 'La ville est requise'),
  quartier: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional()
});

export const messageSchema = z.object({
  contenu: z.string().min(1, 'Le message ne peut pas être vide'),
  destinataireId: z.string().uuid(),
  annonceId: z.string().uuid()
});
