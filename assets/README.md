# Spower — Application Mobile React Native (Expo)

Cette application React Native est la réplique exacte de l'application **Spower 5.29.1** basée sur les captures d'écran du dossier `smartpower/home page`.

Elle fonctionne de manière **100% autonome et locale** (sans dépendre d'une API Cloud externe), avec un simulateur de télémétrie de puissance (Watts, Volts, Ampères, kWh) en temps réel.

---

## Architecture du Projet

```text
react-native-app/
├── App.tsx                     # Racine de l'application avec BottomTab Navigator
├── app.json                    # Configuration Expo
├── package.json                # Dépendances React Native & Navigation
├── tsconfig.json               # Support TypeScript
└── src/
    ├── types/index.ts          # Interfaces des appareils, scènes et télémétrie
    ├── theme/colors.ts         # Palette de couleurs Spower (bleu primaire, etc.)
    ├── context/
    │   └── SmartPowerContext.tsx # Gestion d'état local & boucle de simulation
    ├── components/
    │   ├── DeviceCard.tsx          # Carte d'appareil avec interrupteur iOS (1000.jpg)
    │   ├── HomePickerModal.tsx     # Menu "Gérer Maisons" (1010.jpg)
    │   ├── AddDeviceModal.tsx      # Configuration appairage Wi-Fi 2.4GHz (1021.jpg)
    │   ├── QrScannerModal.tsx      # Viseur caméra laser QR Code (1022.jpg)
    │   └── EnergyDashboardModal.tsx# Tableau de bord électrique en direct
    └── screens/
        ├── DomicileScreen.tsx      # Onglet Domicile (Tous, Livingroom, Bedroom...)
        ├── ScenarioScreen.tsx      # Onglet Scénario (2000.jpg)
        ├── ApercuScreen.tsx        # Onglet Aperçu (Appareils allumés, Énergie)
        ├── MessageScreen.tsx       # Onglet Message (Tutoriel, Explorer, Notif)
        └── ProfilScreen.tsx        # Onglet Profil (Compte, VIP, Intégrations)
```

---

## Comment Lancer l'Application React Native

### 1. Installer les dépendances
Dans le terminal :
```bash
cd c:\Users\Logan\Documents\smartpower\react-native-app
npm install
```

### 2. Démarrer le serveur de développement Expo
```bash
npx expo start
```

### 3. Tester sur votre appareil :
* **Sur smartphone physique** : Scannez le QR Code affiché dans le terminal avec l'application **Expo Go** (disponible gratuitement sur l'App Store iOS et le Google Play Store).
* **Sur le Web** : Appuyez sur `w` dans le terminal pour l'ouvrir directement dans votre navigateur web.
* **Sur Android Emulator** : Appuyez sur `a`.
* **Sur simulateur iOS** : Appuyez sur `i` (sur macOS).
