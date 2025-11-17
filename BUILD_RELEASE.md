# Release Build Guide - Booking Bridge Mobile Apps

This guide provides step-by-step instructions for building production-ready releases of the Booking Bridge mobile apps for submission to the Apple App Store and Google Play Store.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [iOS Release Build](#ios-release-build)
3. [Android Release Build](#android-release-build)
4. [Version Management](#version-management)
5. [Testing Releases](#testing-releases)
6. [Common Issues](#common-issues)

---

## Prerequisites

### General Requirements
- Node.js 16+ installed
- Git installed
- All dependencies installed: `npm install`
- Web app builds successfully: `npm run build`

### iOS Requirements
- macOS (required)
- Xcode 14+ (download from Mac App Store)
- CocoaPods installed: `sudo gem install cocoapods`
- Apple Developer Account ($99/year)
- Valid signing certificate and provisioning profile

### Android Requirements
- Android Studio (latest version)
- JDK 11 or later
- Android SDK (API 23-35)
- Google Play Developer Account ($25 one-time)
- Release keystore created

---

## iOS Release Build

### Step 1: Prepare the Web Build

```bash
# Clean previous builds
rm -rf build/

# Build the web app
npm run build

# Sync to iOS
npx cap sync ios
```

### Step 2: Open Project in Xcode

```bash
# Open the iOS project
npm run mobile:ios

# Or manually:
open ios/App/App.xcworkspace
```

**IMPORTANT:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

### Step 3: Configure Signing

1. In Xcode, select the **App** target in the project navigator
2. Go to **Signing & Capabilities** tab
3. Configure the following:
   - **Team**: Select your Apple Developer team
   - **Bundle Identifier**: `com.bookingbridge.app`
   - **Automatically manage signing**: ✓ Checked (recommended)

### Step 4: Set Version Information

1. In Xcode, select the **App** target
2. Go to **General** tab
3. Under **Identity**, set:
   - **Display Name**: `Booking Bridge`
   - **Version**: `1.0.0` (increment for each release)
   - **Build**: `1` (increment for each upload)

### Step 5: Build Archive

1. In Xcode menu bar:
   - Select **Product** > **Scheme** > **App**
   - Select **Product** > **Destination** > **Any iOS Device (arm64)**

2. Create archive:
   - Select **Product** > **Archive**
   - Wait for build to complete (may take several minutes)

3. The Organizer window will open automatically

### Step 6: Validate Archive

1. In Organizer, select your archive
2. Click **Validate App**
3. Select your signing options:
   - Choose **Automatically manage signing**
   - Select your distribution certificate
4. Click **Validate**
5. Fix any errors if validation fails

### Step 7: Upload to App Store Connect

1. In Organizer, click **Distribute App**
2. Choose **App Store Connect**
3. Click **Next**
4. Select **Upload**
5. Choose signing options (Automatically manage signing recommended)
6. Click **Upload**
7. Wait for upload to complete

### Step 8: Submit for Review

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **App Store** tab
4. Click the **+** button to create a new version
5. Fill in all required information:
   - **What's New in This Version**
   - **App Previews and Screenshots**
   - **Promotional Text** (optional)
   - **Description**
   - **Keywords**
   - **Support URL**
   - **Marketing URL** (optional)
   - **Privacy Policy URL**
6. Select the build you just uploaded
7. Complete **App Review Information**
8. Click **Save** then **Submit for Review**

### iOS Build Checklist

- [ ] Web app built successfully
- [ ] iOS project synced with latest web build
- [ ] Signing configured correctly
- [ ] Version and build numbers incremented
- [ ] App icons added (all required sizes)
- [ ] Screenshots prepared (6.7", 6.5", 5.5")
- [ ] App description and metadata prepared
- [ ] Archive builds without errors
- [ ] Archive validates successfully
- [ ] Privacy policy URL is live
- [ ] Support URL is live
- [ ] Submitted to App Store Connect

---

## Android Release Build

### Step 1: Prepare the Web Build

```bash
# Clean previous builds
rm -rf build/

# Build the web app
npm run build

# Sync to Android
npx cap sync android
```

### Step 2: Create Release Keystore (First Time Only)

If you haven't created a keystore yet:

```bash
# Navigate to a secure location (NOT in the project directory)
cd ~/secure-keys/

# Generate keystore
keytool -genkey -v -keystore booking-bridge-release.keystore \
  -alias booking-bridge \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Follow the prompts to set:
# - Keystore password (SAVE THIS!)
# - Key password (SAVE THIS!)
# - Your name/organization details
```

**CRITICAL:**
- Store this keystore file in a SECURE location
- NEVER commit it to git
- BACKUP the keystore and passwords
- If you lose this, you cannot update your app!

### Step 3: Configure Signing

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=booking-bridge
storeFile=/absolute/path/to/booking-bridge-release.keystore
```

**Note:** This file is in `.gitignore` and will NOT be committed.

### Step 4: Update Build Configuration for Signing

Edit `android/app/build.gradle` and add signing configuration:

```gradle
// Add this near the top, after 'apply plugin'
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing configuration ...

    // Add signing configs
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 5: Update Version Information

Edit `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.bookingbridge.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2        // INCREMENT for each release
    versionName "1.0.1"  // UPDATE for each version
    // ... rest of config
}
```

**Version Rules:**
- `versionCode`: Integer that must increase with each release
- `versionName`: Semantic version string shown to users

### Step 6: Build Signed AAB

Option A: Using Android Studio (Recommended)

1. Open Android Studio:
   ```bash
   npm run mobile:android
   ```

2. In Android Studio:
   - Select **Build** > **Generate Signed Bundle / APK**
   - Choose **Android App Bundle**
   - Click **Next**
   - Select your keystore file
   - Enter keystore password
   - Select key alias
   - Enter key password
   - Click **Next**
   - Choose **release** build variant
   - Click **Finish**

3. AAB will be generated at:
   ```
   android/app/release/app-release.aab
   ```

Option B: Using Command Line

```bash
cd android

# Build release AAB
./gradlew bundleRelease

# AAB will be at:
# app/build/outputs/bundle/release/app-release.aab
```

### Step 7: Test the Release Build

Before uploading, test the release build:

```bash
# Install the internal test AAB using bundletool
# Download bundletool from: https://github.com/google/bundletool/releases

java -jar bundletool-all.jar build-apks \
  --bundle=app/build/outputs/bundle/release/app-release.aab \
  --output=app-release.apks \
  --mode=universal

# Extract and install
unzip -p app-release.apks universal.apk > app-release.apk
adb install app-release.apk
```

### Step 8: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create new app if first release)
3. Go to **Release** > **Production**
4. Click **Create new release**
5. Upload the AAB file
6. Fill in release notes:
   ```
   Initial release of Booking Bridge - Hospitality Link Hub

   Features:
   - Create unlimited property pages
   - Manage booking platform links
   - QR code generation
   - Custom domains support
   - Analytics dashboard
   ```
7. Review and rollout to production

### Step 9: Complete Store Listing (First Release Only)

1. **App details:**
   - App name: `Booking Bridge`
   - Short description: `Create link-in-bio pages for hotels and vacation rentals`
   - Full description: (See APP_STORE_ASSETS.md)

2. **Graphics:**
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots: Minimum 2 (see APP_STORE_ASSETS.md)

3. **Categorization:**
   - Application type: App
   - Category: Business
   - Tags: business, productivity, hospitality

4. **Contact details:**
   - Email
   - Phone (optional)
   - Website

5. **Privacy Policy:**
   - Add your privacy policy URL

6. **App content:**
   - Complete content rating questionnaire
   - Target age: Everyone
   - Complete declarations

### Android Build Checklist

- [ ] Web app built successfully
- [ ] Android project synced with latest web build
- [ ] Keystore created and secured
- [ ] key.properties configured
- [ ] build.gradle updated with signing config
- [ ] versionCode and versionName incremented
- [ ] App icons added (all densities)
- [ ] Screenshots prepared
- [ ] Feature graphic created
- [ ] AAB builds successfully
- [ ] Release tested on device
- [ ] Store listing completed
- [ ] Content rating completed
- [ ] Privacy policy URL is live
- [ ] Uploaded to Play Console

---

## Version Management

### Semantic Versioning

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes or major redesigns (1.0.0 → 2.0.0)
- **MINOR**: New features, backwards compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backwards compatible (1.0.0 → 1.0.1)

### Version Update Locations

When releasing a new version, update:

1. **iOS:**
   - `ios/App/App.xcodeproj/project.pbxproj` (via Xcode UI)
   - **Version**: e.g., 1.0.0 → 1.1.0
   - **Build**: Increment integer (1 → 2)

2. **Android:**
   - `android/app/build.gradle`
   - **versionName**: e.g., "1.0.0" → "1.1.0"
   - **versionCode**: Increment integer (1 → 2)

3. **package.json** (optional but recommended):
   ```json
   "version": "1.1.0"
   ```

### Pre-release Checklist

Before each release:

- [ ] All features tested
- [ ] No console errors
- [ ] Build completes without warnings
- [ ] Test on physical devices
- [ ] Firebase configured correctly
- [ ] All links work
- [ ] Images load properly
- [ ] Auth flow works
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] Screenshots updated (if needed)

---

## Testing Releases

### iOS Testing

**TestFlight (Recommended)**

1. Upload build to App Store Connect
2. Go to **TestFlight** tab
3. Add internal testers (up to 100)
4. Add external testers (up to 10,000)
5. Testers receive invite via email
6. Install TestFlight app and test

**Development Builds**

```bash
# Connect iOS device
# In Xcode, select your device
# Product > Run
```

### Android Testing

**Internal Testing Track**

1. In Play Console, go to **Release** > **Testing** > **Internal testing**
2. Upload AAB
3. Add testers via email list or Google Group
4. Share opt-in URL with testers
5. Testers can install via Play Store

**Development Builds**

```bash
# Connect Android device with USB debugging enabled
cd android
./gradlew installDebug
```

---

## Common Issues

### iOS Issues

**Issue: "No provisioning profile found"**
- Solution: In Xcode, select your Apple Developer team in Signing & Capabilities
- Ensure your Apple Developer account is active

**Issue: "Archive failed - Code signing error"**
- Solution:
  1. Go to Xcode > Preferences > Accounts
  2. Select your team and click "Download Manual Profiles"
  3. Try archiving again

**Issue: "App uses non-exempt encryption"**
- Solution: Already handled in Info.plist with `ITSAppUsesNonExemptEncryption = false`
- If asked during upload, answer "No"

**Issue: "Missing compliance documentation"**
- Solution: Since app only uses HTTPS (standard encryption), answer compliance questions as "No"

### Android Issues

**Issue: "Keystore file not found"**
- Solution: Verify `storeFile` path in `key.properties` is absolute path

**Issue: "Wrong key password"**
- Solution: Double-check passwords in `key.properties` match keystore

**Issue: "Upload rejected - Signature error"**
- Solution: Ensure using the same keystore for updates (never create new keystore for existing app)

**Issue: "Missing permissions for Play Console"**
- Solution: Verify you have "Admin" role in Play Console for the app

**Issue: "AAB too large"**
- Solution:
  1. Check build output size
  2. Enable minification in build.gradle
  3. Remove unused assets

### General Issues

**Issue: "White screen on launch"**
- Solution:
  1. Check browser console for errors
  2. Verify `npm run build` completed successfully
  3. Run `npx cap sync`
  4. Clear app data and reinstall

**Issue: "Firebase not working in app"**
- Solution:
  1. Verify Firebase config in `src/firebase.js`
  2. For iOS: Add GoogleService-Info.plist
  3. For Android: Add google-services.json
  4. Rebuild and sync

**Issue: "Links don't work"**
- Solution: Check router configuration in App.jsx uses hash routing for mobile if needed

---

## Additional Resources

- **iOS:**
  - [App Store Connect](https://appstoreconnect.apple.com)
  - [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
  - [TestFlight Documentation](https://developer.apple.com/testflight/)

- **Android:**
  - [Google Play Console](https://play.google.com/console)
  - [Android App Bundle Documentation](https://developer.android.com/guide/app-bundle)
  - [Launch Checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

- **Capacitor:**
  - [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
  - [Capacitor Android Guide](https://capacitorjs.com/docs/android)
  - [Publishing Guide](https://capacitorjs.com/docs/guides/deploying-updates)

---

## Quick Command Reference

```bash
# Build and sync both platforms
npm run mobile:sync

# Open iOS in Xcode
npm run mobile:ios

# Open Android in Android Studio
npm run mobile:android

# Build web only
npm run build

# Sync iOS only
npx cap sync ios

# Sync Android only
npx cap sync android

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/ios@latest @capacitor/android@latest
npx cap sync
```

---

## Support

For build issues:
1. Check this guide first
2. Review MOBILE.md for setup instructions
3. Check Capacitor documentation
4. Check platform-specific documentation (Xcode/Android Studio)

For app-specific issues:
- Review Firebase configuration
- Check browser console for errors
- Test web version first before mobile

---

**Remember:** Always test your release builds on real devices before submitting to the stores!

**Pro Tip:** Create a release checklist and go through it for every release to ensure nothing is missed.

Good luck with your release! 🚀
