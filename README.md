## This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli), typescript, nativewind, react native paper, ui kitten...

![react-native](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/36c83c02-d913-4406-b8d4-eee582f55176) ![nativewind](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/31b3601f-8464-46c5-8035-b54fbf9644af)
 ![m-icon](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/c05d8f17-46b6-437d-a454-8f6e09c87aab) ![ui-kitten](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/628e85f2-e702-481a-8589-20d0a76c52c6) ![rn-paper](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/eea07faa-712c-4272-9765-ca4f1171eb06)

# Some UI Screens

![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/38e12441-2d6c-4b49-a49b-de718d07c26c)
 ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/db66a313-51c7-4358-b70f-0d61609f7071)
 ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/8d4583ee-0129-44ea-8ad7-c52057e832b5) ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/0a8653bb-9201-4e50-8e5b-1d0cb593ee9b) ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/d7fbb691-ae80-4eb9-82d8-8c96ef6c3df8) ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/04b964e8-1082-44bd-b9b2-c06fa8a56d42) ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/81c95ecc-ff07-4521-b93b-2e6537127634) ![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/1c0c07b1-4066-4581-b588-ef36f8fdee1d) 

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Prepare: Change local BASE_URL to compatible with your device
Run this command on CMD to take IPv4 Address, then set it to BASE_URL in file /api/config.ts

```bash
# cmd
ipconfig
```
For example:

![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/b087ee6a-9b82-4b5b-ab6b-4ba7fb59170f)


![image](https://github.com/Semester02-UIT-2023-2024/ClothingStore_ReactNative/assets/121101254/cd71480f-5e91-4a1d-930c-c0e81c3beced)


## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# install node-module first
npm install

# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App (Optional)

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
