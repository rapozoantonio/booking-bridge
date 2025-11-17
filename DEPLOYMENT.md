# Deployment Instructions

## Firebase Hosting Setup

### One-Time Setup

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Update `.firebaserc`** with your project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```
   Replace `your-actual-project-id` with your Firebase project ID.

4. **Initialize Firebase** (optional, if you need to reconfigure):
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

### Deploy to Production

1. **Build the application**:
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist` folder.

2. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

3. **Your app will be live at**:
   ```
   https://your-project-id.web.app
   ```

### Quick Deploy Script

Add this to your `package.json` scripts:
```json
"deploy": "npm run build && firebase deploy --only hosting"
```

Then simply run:
```bash
npm run deploy
```

## Environment Variables

Make sure your `.env` file has all Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: Environment variables are baked into the build, so rebuild after changing them.

## Firestore Security Rules

Don't forget to set up security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /places/{placeId} {
      allow read: if resource.data.isActive == true ||
                     (request.auth != null && request.auth.uid == resource.data.userId);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

## Continuous Deployment (Optional)

### GitHub Actions

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Troubleshooting

- **Build fails**: Check that all dependencies are installed (`npm install`)
- **Firebase deploy fails**: Verify you're logged in (`firebase login`)
- **Environment variables not working**: Rebuild the app after changing `.env`
- **404 on refresh**: Make sure `firebase.json` has the rewrites configuration
- **Slow loading**: Check that you're serving from `dist`, not `public`

## Custom Domain (Optional)

1. Go to Firebase Console → Hosting → Add custom domain
2. Follow the verification steps
3. Add DNS records as instructed
4. Wait for SSL certificate provisioning (can take 24 hours)
