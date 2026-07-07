# Configuration Supabase - Authentification

## 1. Configuration des Email Templates

Les tokens d'authentification sont redirigés via `/auth/callback`. Pour que les emails de réinitialisation de mot de passe fonctionnent:

### Étapes Supabase Dashboard:

1. **Allez à: Authentication > Email Templates > Reset Password**

2. **Remplacez le contenu par:**

Le lien dans le template doit être:
```
{{ .SiteURL }}/auth/callback#access_token={{ .Token }}&type=recovery&refresh_token={{ .RefreshToken }}
```

3. **Allez à: Authentication > URL Configuration**

Configurez:
- **Site URL (dev)**: `http://localhost:5173`
- **Site URL (prod)**: `https://closing-view.vercel.app`
- **Redirect URLs**: Ajoutez:
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/dashboard`
  - `https://closing-view.vercel.app/auth/callback`
  - `https://closing-view.vercel.app/dashboard`

## 2. Google OAuth (optionnel)

Si vous utilisez Google:
- Allez à: Authentication > Providers > Google
- Entrez votre Client ID et Client Secret
- Dans Google Cloud Console, ajoutez les URIs:
  - `https://cyetvowqszwztmndmmyq.supabase.co/auth/v1/callback` (remplacer votre ref)
  - `http://localhost:5173/auth/callback`
  - `https://closing-view.vercel.app/auth/callback`

## 3. Test

1. Allez à `http://localhost:5173/forgot-password`
2. Vérifiez votre email
3. Cliquez le lien - devrait afficher la page de reset password
