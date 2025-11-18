# Mobile Apps Quick Start Guide

Get the Booking Bridge mobile apps up and running quickly.

## 🎯 What You Have

✅ **iOS App** - Ready for Apple App Store
✅ **Android App** - Ready for Google Play Store
✅ **Single Codebase** - Web + Mobile in one project
✅ **Capacitor Framework** - Native mobile wrapper for React app

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Build & Sync

```bash
# Build web app and sync to both platforms
npm run mobile:sync
```

### 3. Open Native IDEs

**For iOS:**
```bash
npm run mobile:ios
```
This opens Xcode. Press ▶️ to run on simulator.

**For Android:**
```bash
npm run mobile:android
```
This opens Android Studio. Press ▶️ to run on emulator.

## 📱 Testing on Devices

### iOS Physical Device
1. Connect iPhone/iPad via USB
2. Trust the computer on device
3. In Xcode, select your device from device menu
4. Click ▶️ Run

### Android Physical Device
1. Enable Developer Mode on Android device
2. Enable USB Debugging
3. Connect via USB
4. In Android Studio, select device and click ▶️

## 📦 Available Commands

| Command | What It Does |
|---------|-------------|
| `npm run mobile:sync` | Build web + sync to iOS & Android |
| `npm run mobile:ios` | Sync and open Xcode |
| `npm run mobile:android` | Sync and open Android Studio |
| `npm run build` | Build web app only |
| `npx cap sync` | Sync web assets to native projects |
| `npx cap sync ios` | Sync to iOS only |
| `npx cap sync android` | Sync to Android only |

## 🏗️ Project Structure

```
booking-bridge/
├── src/                          # React web app source
├── build/                        # Web build output (used by mobile)
├── ios/                          # iOS native project
│   └── App/
│       ├── App.xcworkspace      # Open this in Xcode
│       └── App/
│           ├── Info.plist       # iOS app configuration
│           └── Assets.xcassets/ # Icons & splash screens
├── android/                      # Android native project
│   └── app/
│       ├── build.gradle         # Android app configuration
│       └── src/main/
│           ├── AndroidManifest.xml
│           └── res/             # Icons & resources
├── capacitor.config.json         # Capacitor configuration
├── MOBILE.md                     # Full mobile documentation
├── BUILD_RELEASE.md              # Release build guide
└── APP_STORE_ASSETS.md           # Asset requirements
```

## 🎨 App Identity

- **App Name**: Booking Bridge
- **iOS Bundle ID**: com.bookingbridge.app
- **Android Package**: com.bookingbridge.app
- **Version**: 1.0.0
- **Theme Color**: #4F46E5 (Indigo)

## 📝 Development Workflow

### Making Changes to the App

1. **Edit React code** in `src/` directory
2. **Test in browser** first: `npm run dev`
3. **Build for mobile**: `npm run build`
4. **Sync to native**: `npx cap sync`
5. **Test on mobile** devices

### Updating Mobile Apps After Code Changes

```bash
# Quick update workflow
npm run build && npx cap sync
```

Then rebuild in Xcode/Android Studio.

## 🍎 iOS Development

### Prerequisites
- macOS required
- Xcode 14+ from Mac App Store
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account ($99/year)

### First-Time Setup
```bash
cd ios/App
pod install
```

### Opening the Project
```bash
# Always open the .xcworkspace file!
open ios/App/App.xcworkspace
```

### Common iOS Tasks
- **Change app name**: Edit `Info.plist` → `CFBundleDisplayName`
- **Update version**: Xcode → App target → General → Version
- **Add app icon**: Xcode → Assets.xcassets → AppIcon
- **Configure signing**: Xcode → Signing & Capabilities

## 🤖 Android Development

### Prerequisites
- Android Studio (any platform)
- JDK 11+
- Android SDK API 23-35
- Google Play Developer Account ($25 one-time)

### Opening the Project
```bash
# Opens Android Studio
npm run mobile:android
```

### Common Android Tasks
- **Change app name**: Edit `android/app/src/main/res/values/strings.xml`
- **Update version**: Edit `android/app/build.gradle` → `versionCode` & `versionName`
- **Add app icon**: Place in `android/app/src/main/res/mipmap-*` folders
- **Configure package**: Edit `android/app/build.gradle` → `applicationId`

## 🚀 Building for Release

### iOS Release

**Quick Steps:**
1. `npm run build && npx cap sync ios`
2. Open Xcode: `npm run mobile:ios`
3. Select **Product** > **Archive**
4. Upload to App Store Connect
5. Submit for review

**Detailed Guide:** See [BUILD_RELEASE.md](BUILD_RELEASE.md#ios-release-build)

### Android Release

**Quick Steps:**
1. Create keystore (first time only)
2. Configure signing in `android/key.properties`
3. `npm run build && npx cap sync android`
4. Open Android Studio: `npm run mobile:android`
5. **Build** > **Generate Signed Bundle / APK**
6. Upload AAB to Play Console
7. Submit for review

**Detailed Guide:** See [BUILD_RELEASE.md](BUILD_RELEASE.md#android-release-build)

## 📚 Documentation

- **[MOBILE.md](MOBILE.md)** - Complete mobile development guide
  - Prerequisites and setup
  - Development workflow
  - Troubleshooting
  - App store submission

- **[BUILD_RELEASE.md](BUILD_RELEASE.md)** - Production build guide
  - Step-by-step release process
  - Version management
  - Testing releases
  - Common issues

- **[APP_STORE_ASSETS.md](APP_STORE_ASSETS.md)** - Asset requirements
  - App icons specifications
  - Screenshot requirements
  - Store listing content
  - Brand guidelines

## ⚙️ Configuration Files

### capacitor.config.json
Main Capacitor configuration:
```json
{
  "appId": "com.bookingbridge.app",
  "appName": "Booking Bridge",
  "webDir": "build"
}
```

### iOS: Info.plist
App permissions and settings:
- Located at: `ios/App/App/Info.plist`
- Configure: App name, bundle ID, permissions

### Android: build.gradle
App configuration:
- Located at: `android/app/build.gradle`
- Configure: Package name, versions, signing

## 🔧 Troubleshooting

### iOS

**Problem:** "No provisioning profile found"
**Solution:** In Xcode, select your team in Signing & Capabilities

**Problem:** CocoaPods errors
**Solution:**
```bash
cd ios/App
pod install --repo-update
```

### Android

**Problem:** Gradle build fails
**Solution:**
```bash
cd android
./gradlew clean
./gradlew build
```

**Problem:** SDK not found
**Solution:** Set `ANDROID_HOME` environment variable

### General

**Problem:** White screen on app
**Solution:**
1. Check `npm run build` completed successfully
2. Run `npx cap sync`
3. Clear app data and reinstall

**Problem:** Changes not showing
**Solution:**
```bash
# Full rebuild
npm run build
npx cap sync
# Rebuild in Xcode/Android Studio
```

## 🆘 Need Help?

1. **Check documentation** in order:
   - This file (quick answers)
   - MOBILE.md (detailed guide)
   - BUILD_RELEASE.md (release specific)

2. **Common issues:**
   - Ensure web builds successfully first
   - Verify sync completed: `npx cap sync`
   - Check console for errors
   - Try clean build

3. **External resources:**
   - [Capacitor Docs](https://capacitorjs.com/docs)
   - [iOS Developer](https://developer.apple.com)
   - [Android Developer](https://developer.android.com)

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completed without errors
- [ ] `npm run build` builds successfully
- [ ] `npx cap sync` runs without errors
- [ ] iOS project opens in Xcode
- [ ] Android project opens in Android Studio
- [ ] App runs in iOS simulator
- [ ] App runs in Android emulator
- [ ] App runs on physical iOS device
- [ ] App runs on physical Android device
- [ ] Web app works in browser

## 🎯 Next Steps

1. ✅ **Setup complete** - You can build and run the apps
2. 📱 **Test thoroughly** - Try all features on mobile
3. 🎨 **Customize assets** - Add proper app icons and screenshots
4. 📝 **Prepare metadata** - Write app descriptions
5. 🚀 **Build release** - Follow BUILD_RELEASE.md
6. 📤 **Submit to stores** - Upload to App Store Connect & Play Console

## 💡 Pro Tips

- **Always test web version first** before mobile
- **Use `npm run mobile:sync`** instead of manual build + sync
- **Keep keystores backed up** (Android) - you can't recover them!
- **Increment version numbers** with each release
- **Test on real devices** before releasing
- **Read store guidelines** before submitting

## 🎉 You're Ready!

Your mobile apps are configured and ready to build. The hard part is done!

Now you can:
- Develop and test locally
- Build release versions
- Submit to app stores

**Happy mobile development!** 🚀📱

---

**Quick Reference:**
```bash
# Development
npm run dev              # Web dev server
npm run mobile:sync      # Build + sync mobile
npm run mobile:ios       # Open iOS
npm run mobile:android   # Open Android

# Release
npm run build           # Production web build
npx cap sync           # Sync to mobile
# Then build in Xcode/Android Studio
```
