# Booking Bridge Mobile Apps

This document provides comprehensive instructions for building and deploying the Booking Bridge mobile apps for iOS (Apple App Store) and Android (Google Play Store).

## Overview

The mobile apps are built using **Capacitor**, which wraps the existing React web application into native iOS and Android apps. This approach allows us to:

- Maintain a single codebase for web and mobile
- Deploy to both App Store and Play Store
- Access native device features
- Provide a native app experience

## Prerequisites

### For iOS Development

- **macOS** (required for iOS builds)
- **Xcode** 14.0 or later (download from Mac App Store)
- **CocoaPods** (install with: `sudo gem install cocoapods`)
- **Apple Developer Account** ($99/year for App Store distribution)

### For Android Development

- **Android Studio** (download from https://developer.android.com/studio)
- **Java Development Kit (JDK)** 11 or later
- **Android SDK** (installed via Android Studio)
- **Google Play Developer Account** ($25 one-time fee)

### For Both Platforms

- **Node.js** 16.0 or later
- **npm** or **yarn**

## Project Structure

```
booking-bridge/
├── ios/                    # iOS native project (managed by Capacitor)
├── android/                # Android native project (managed by Capacitor)
├── build/                  # Web build output (used by mobile apps)
├── src/                    # React application source code
├── capacitor.config.json   # Capacitor configuration
└── package.json            # Project dependencies and scripts
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build and Sync

```bash
# Build the web app and sync to both platforms
npm run mobile:sync
```

### 3. Open Native IDEs

**For iOS:**
```bash
npm run mobile:ios
```
This opens Xcode with the iOS project.

**For Android:**
```bash
npm run mobile:android
```
This opens Android Studio with the Android project.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run mobile:sync` | Build web app and sync to both iOS and Android |
| `npm run mobile:ios` | Sync and open iOS project in Xcode |
| `npm run mobile:android` | Sync and open Android project in Android Studio |
| `npm run mobile:build:ios` | Build and sync iOS platform |
| `npm run mobile:build:android` | Build and sync Android platform |

## iOS App Store Deployment

### 1. Configure App Information

1. Open the project in Xcode:
   ```bash
   npm run mobile:ios
   ```

2. In Xcode, select the **App** target and navigate to the **Signing & Capabilities** tab

3. Configure:
   - **Team**: Select your Apple Developer team
   - **Bundle Identifier**: `com.bookingbridge.app`
   - **Display Name**: `Booking Bridge`

### 2. App Icons and Launch Screen

1. **App Icon**:
   - Navigate to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Add your app icons in the required sizes (1024x1024, 180x180, 120x120, etc.)
   - Use a tool like [appicon.co](https://appicon.co/) to generate all required sizes

2. **Launch Screen**:
   - Edit `ios/App/App/Base.lproj/LaunchScreen.storyboard` in Xcode
   - Customize the splash screen appearance

### 3. Build and Archive

1. In Xcode, select **Product** > **Scheme** > **App**
2. Select **Product** > **Destination** > **Any iOS Device (arm64)**
3. Select **Product** > **Archive**
4. Once archived, the Organizer window will open
5. Click **Distribute App** and follow the wizard

### 4. Submit to App Store

1. In **App Store Connect** (https://appstoreconnect.apple.com):
   - Create a new app
   - Set app name: **Booking Bridge**
   - Bundle ID: `com.bookingbridge.app`
   - Fill in app metadata, screenshots, description

2. Upload your build from Xcode Organizer

3. Submit for review

**App Store Requirements:**
- App screenshots (6.5", 6.7", 5.5" displays)
- App description and keywords
- Privacy policy URL
- Support URL
- App category: Business

## Android Play Store Deployment

### 1. Configure App Information

1. Open `android/app/build.gradle` and verify:
   ```gradle
   defaultConfig {
       applicationId "com.bookingbridge.app"
       minSdkVersion 22
       targetSdkVersion 34
       versionCode 1
       versionName "1.0.0"
   }
   ```

2. Update app name in `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="app_name">Booking Bridge</string>
   ```

### 2. App Icons and Splash Screen

1. **App Icons**:
   - Navigate to `android/app/src/main/res/`
   - Add icons to `mipmap-*` folders (hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi)
   - Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

2. **Splash Screen**:
   - Splash is configured in `capacitor.config.json`
   - Add splash images to `android/app/src/main/res/drawable-*` folders

### 3. Generate Signing Key

```bash
# Generate a keystore (do this once and keep it secure!)
keytool -genkey -v -keystore booking-bridge.keystore \
  -alias booking-bridge \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# This will create booking-bridge.keystore
# IMPORTANT: Store this file securely and never commit it to git!
```

### 4. Configure Signing

1. Create `android/key.properties`:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=booking-bridge
   storeFile=/path/to/booking-bridge.keystore
   ```

2. Update `android/app/build.gradle`:
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
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
           }
       }
   }
   ```

### 5. Build Release APK/AAB

```bash
# Open Android Studio
npm run mobile:android

# In Android Studio:
# 1. Select Build > Generate Signed Bundle / APK
# 2. Choose Android App Bundle (AAB) for Play Store
# 3. Select your keystore and enter passwords
# 4. Choose 'release' build type
# 5. Click Finish

# The AAB will be generated at:
# android/app/release/app-release.aab
```

### 6. Submit to Play Store

1. Go to **Google Play Console** (https://play.google.com/console)
2. Create a new app
3. Fill in app details:
   - App name: **Booking Bridge**
   - Category: **Business**
   - Description, screenshots, etc.
4. Upload the AAB file
5. Complete the content rating questionnaire
6. Set pricing (free or paid)
7. Submit for review

**Play Store Requirements:**
- Feature graphic (1024x500)
- Screenshots (phone and tablet)
- App icon (512x512)
- Privacy policy URL
- App description

## App Store Metadata

### App Name
**Booking Bridge**

### Subtitle/Short Description
Hospitality Link Hub for Your Properties

### Full Description
```
Booking Bridge makes it easy for hospitality businesses to create beautiful, professional link-in-bio pages for their properties.

KEY FEATURES:
• Create unlimited property pages
• Add booking platform links (Airbnb, Booking.com, VRBO, etc.)
• Include social media and contact links
• QR code generation for easy sharing
• Custom domains support
• Analytics dashboard
• Multiple theme options
• Mobile-friendly design

PERFECT FOR:
• Hotels and resorts
• Vacation rentals
• Bed & breakfasts
• Property managers
• Hospitality businesses

Connect your guests to all your booking platforms and services in one beautiful, easy-to-share page.
```

### Keywords
```
booking, hospitality, hotel, vacation rental, airbnb, property management, link in bio, qr code, business
```

### Category
- **Primary**: Business
- **Secondary**: Productivity

### Age Rating
- 4+ (No objectionable content)

## Configuration Files

### capacitor.config.json

This is the main configuration file for Capacitor:

```json
{
  "appId": "com.bookingbridge.app",
  "appName": "Booking Bridge",
  "webDir": "build",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#ffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#4F46E5"
    }
  }
}
```

## Updating the Mobile Apps

After making changes to the web app:

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync changes to native projects:
   ```bash
   npx cap sync
   ```

3. Open the native IDE and rebuild:
   ```bash
   npm run mobile:ios    # for iOS
   npm run mobile:android # for Android
   ```

## Troubleshooting

### iOS Issues

**Error: "No provisioning profiles found"**
- Solution: In Xcode, select your team in Signing & Capabilities

**Error: "CocoaPods not installed"**
- Solution: Install CocoaPods: `sudo gem install cocoapods`

**Build fails with dependency errors**
- Solution: Run `npx cap sync ios` and try again

### Android Issues

**Error: "SDK location not found"**
- Solution: Set `ANDROID_HOME` environment variable to your Android SDK path

**Error: "Gradle build failed"**
- Solution: In Android Studio, click File > Invalidate Caches and Restart

**Build fails with signing errors**
- Solution: Verify your `key.properties` file is correctly configured

### General Issues

**White screen on app launch**
- Solution: Ensure `npm run build` completes successfully
- Check browser console in web version for errors
- Run `npx cap sync` after building

**Firebase not working**
- Solution: Verify Firebase configuration in `src/firebase.js`
- Ensure Firebase has the correct Android/iOS app configurations

## Testing

### iOS Simulator

```bash
npm run mobile:ios
# In Xcode, select a simulator and click Run
```

### Android Emulator

```bash
npm run mobile:android
# In Android Studio, select an AVD and click Run
```

### Physical Devices

**iOS:**
1. Connect iPhone/iPad via USB
2. Trust the computer on the device
3. In Xcode, select your device from the device menu
4. Click Run

**Android:**
1. Enable Developer Mode on Android device
2. Enable USB Debugging
3. Connect via USB
4. In Android Studio, select your device and click Run

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

## Support

For issues or questions:
- Check the [Capacitor Community Forum](https://forum.ionicframework.com/c/capacitor/)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Contact the development team

## Version History

- **1.0.0** - Initial mobile app release
  - iOS and Android support
  - Full feature parity with web app
  - Native splash screen and icons
