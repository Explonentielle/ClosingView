# 🔐 SUPABASE CONFIGURATION GUIDE

**Problème:** Reset Password pointe vers localhost:3000 en local et prod  
**Solution:** Configurer les Authorized URLs dans Supabase

---

## 🛠️ CONFIGURATION SUPABASE

### Étape 1: Accéder au Dashboard Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet ClosingView
3. Allez à **Authentication** → **URL Configuration**

### Étape 2: Configurer les Authorized URLs

#### Pour le Développement Local

1. Cliquez sur **Site URL**
   - Si vous utilisez Vite (port 5173): `http://localhost:5173`
   - Si vous utilisez un autre port: `http://localhost:VOTRE_PORT`

2. Cliquez sur **Redirect URLs** et ajoutez:
   ```
   http://localhost:5173
   http://localhost:5173/dashboard
   http://localhost:5173/reset-password
   http://127.0.0.1:5173
   http://127.0.0.1:5173/dashboard
   http://127.0.0.1:5173/reset-password
   ```

#### Pour la Production

1. Cliquez sur **Site URL**
   - `https://yourdomain.com`

2. Cliquez sur **Redirect URLs** et ajoutez:
   ```
   https://yourdomain.com
   https://yourdomain.com/dashboard
   https://yourdomain.com/reset-password
   https://www.yourdomain.com
   https://www.yourdomain.com/dashboard
   https://www.yourdomain.com/reset-password
   ```

### Étape 3: Configurer Google OAuth (si utilisé)

1. Allez à **Authentication** → **Providers** → **Google**
2. Ajoutez les Authorized redirect URIs:
   ```
   http://localhost:5173
   https://yourdomain.com
   https://www.yourdomain.com
   ```

---

## 💻 CONFIGURATION CÔTÉ CODE

### Fichier: `src/lib/config.ts`

Ce fichier gère automatiquement les URLs selon l'environnement:

```typescript
// Development: utilise window.location.origin (auto-détecte le port)
// Production: utilise window.location.origin (votre domaine)
```

**Personnalisation:**

Si vous avez besoin de domaines spécifiques, modifiez:

```typescript
export const AUTHORIZED_URLS = {
  development: [
    'http://localhost:5173',      // ← Votre port Vite
    'http://127.0.0.1:5173',
  ],
  production: [
    'https://yourdomain.com',     // ← Votre domaine prod
    'https://www.yourdomain.com',
  ],
};
```

### Fichier: `src/services/auth.ts`

Utilise automatiquement la bonne URL:

```typescript
export async function resetPassword(email: string): Promise<boolean> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getResetPasswordUrl(),  // ← Auto-détecte l'URL
  });
  // ...
}
```

---

## 🔗 EMAIL RESET PASSWORD TEMPLATE

### Configuration dans Supabase

1. Allez à **Authentication** → **Email Templates**
2. Sélectionnez **Reset Password**
3. Vérifiez que le lien pointe vers votre domaine:

```html
<!-- Ce lien dans l'email doit être comme ça: -->
<a href="{{ .SiteURL }}/reset-password?token={{ .TokenHash }}">
  Réinitialiser votre mot de passe
</a>
```

Supabase remplace automatiquement `{{ .SiteURL }}` avec la valeur configurée dans **URL Configuration**.

---

## 🧪 TESTING CHECKLIST

### Local Development

- [ ] **Forgot Password:**
  - [ ] Allez à http://localhost:5173/forgot-password
  - [ ] Entrez un email
  - [ ] Cliquez "Envoyer"
  - [ ] Vérifiez que l'email de reset arrive
  - [ ] Cliquez le lien dans l'email
  - [ ] Vérifiez que vous êtes redirigé à http://localhost:5173/reset-password

- [ ] **Reset Password:**
  - [ ] Entrez un nouveau mot de passe
  - [ ] Confirmez le mot de passe
  - [ ] Cliquez "Réinitialiser"
  - [ ] Vérifiez que vous êtes redirigé au dashboard

- [ ] **Google OAuth:**
  - [ ] Cliquez "Continuer avec Google"
  - [ ] Complétez l'authentification
  - [ ] Vérifiez que vous êtes redirigé au dashboard

### Production

- [ ] **Forgot Password:**
  - [ ] Allez à https://yourdomain.com/forgot-password
  - [ ] Vérifiez que tout fonctionne end-to-end

- [ ] **Reset Password:**
  - [ ] Complétez le flow de reset
  - [ ] Vérifiez la redirection

---

## ❓ TROUBLESHOOTING

### Problème: Email de reset pointe vers localhost:3000

**Cause:** Les Authorized URLs ne sont pas configurées correctement

**Solution:**
1. Vérifiez que vous avez ajouté votre domaine dans Supabase
2. Attendez quelques minutes que les changements se propagent
3. Testez avec une nouvelle adresse email

### Problème: Redirect URL mismatch error

**Cause:** L'URL de redirection ne correspond pas aux Authorized URLs

**Solution:**
1. Vérifiez le message d'erreur exact
2. Comparez avec les URLs configurées dans Supabase
3. Assurez-vous que `http://` vs `https://` correspond

### Problème: Google OAuth ne fonctionne pas

**Cause:** Google Cloud OAuth n'est pas configuré correctement

**Solution:**
1. Allez à Google Cloud Console
2. Vérifiez que les Authorized redirect URIs incluent:
   - http://localhost:5173 (dev)
   - https://yourdomain.com (prod)
3. Vérifiez le Client ID et Secret dans Supabase

---

## 📝 RÉSUMÉ

| Environnement | Site URL | Redirect URLs |
|---|---|---|
| **Local** | http://localhost:5173 | http://localhost:5173/dashboard, /reset-password |
| **Production** | https://yourdomain.com | https://yourdomain.com/dashboard, /reset-password |

**Code Côté:** Le code utilise automatiquement `window.location.origin` pour détecter le bon domaine ✅

**Config Supabase:** Vous DEVEZ ajouter les URLs dans le Dashboard Supabase ✅

---

## 🚀 NEXT STEPS

1. [ ] Configurer les Authorized URLs dans Supabase
2. [ ] Tester le reset password en local
3. [ ] Déployer en prod
4. [ ] Tester le reset password en prod
5. [ ] Configurer les emails (SMTP custom si besoin)

---

**Status:** Guide complet ✅
