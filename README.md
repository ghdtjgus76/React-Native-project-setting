## react native 프로젝트 세팅
1. react native + typescript + storybook 설치
   
```
npx react-native init MyApp --template react-native-template-storybook
```
```
yarn install
```
<br />

스토리북이 잘 뜨는지 실행 후 확인
<br />

```
yarn android
```
<br />

2. storybook 스토리 폴더 위치 변경 (src 내부 스토리 파일 인식하도록)

```
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
};
```
```
// .ondevice/main.js
module.exports = {
  stories: [
    '../src/**/*.stories.?(ts|tsx|js|jsx)'
  ],
   addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
```
```
// .ondevice/storybook.requires.js
import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators,
} from '@storybook/react-native';

import '@storybook/addon-ondevice-notes/register';
import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-backgrounds/register';
import '@storybook/addon-ondevice-actions/register';

import {argsEnhancers} from '@storybook/addon-actions/dist/modern/preset/addArgs';

import {decorators, parameters} from './preview';

global.STORIES = [
  {
    titlePrefix: '',
    directory: './src',
    files: '**/*.stories.?(ts|tsx|js|jsx)',
    importPathMatcher:
      '^\\.[\\\\/](?:src(?:[\\\\/](?!\\.)(?:(?:(?!(?:^|[\\\\/])\\.).)*?)[\\\\/]|[\\\\/]|$)(?!\\.)(?=.)[^\\\\/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$',
  },
];

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require('react-native').LogBox.ignoreLogs([
      '`clearDecorators` is deprecated and will be removed in Storybook 7.0',
    ]);
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators();
  decorators.forEach(decorator => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

try {
  argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return {
    './src/components/atoms/Button.stories': require('../src/components/atoms/Button.stories'),
  };
};

configure(getStories, module, false);
```
<br />

스토리북이 잘 뜨는지 실행 후 확인
<br />

```
yarn android
```
<br />

maximum call stack size exceeded 에러 발생 시 metro.config.js 파일에 아래 항목 추가
```
resolver: {
  resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
},
```
<br />

3. typescript 세팅

```
// tsconfig.json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "react-native",
    "lib": ["es6"],
    "moduleResolution": "node",
    "noEmit": true,
    "strict": true,
    "target": "esnext"
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```
<br />

4. 절대 경로 세팅


```
yarn add babel-plugin-module-resolver
```
```
// babel.config.js 아래 항목 추가
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@apis': './src/apis',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@libs': './src/libs',
          '@models': './src/models',
          '@navigators': './src/navigators',
          '@screens': './src/screens',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
```
```
// tsconfig.json 아래 항목 추가
"compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@apis/*": ["src/apis/*"],
      "@assets/*": ["src/assets/*"],
      "@components/*": ["src/components/*"],
      "@constants/*": ["src/constants/*"],
      "@libs/*": ["src/libs/*"],
      "@models/*": ["src/models/*"],
      "@navigators/*": ["src/navigators/*"],
      "@screens/*": ["src/screens/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
```
<br />

5. recoil 세팅

```
yarn add recoil
```
```
// App.tsx
import {View} from 'react-native';
import {RecoilRoot} from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <View />
    </RecoilRoot>
  );
};

export default App;

// import StorybookUIRoot from './.ondevice/Storybook';
// export {StorybookUIRoot as default};
```
<br />

6. axios, react-query 세팅


```
yarn add axios
```
```
yarn add @tanstack/react-query
```
```
// App.tsx
import {View} from 'react-native';
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <View />
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;

// import StorybookUIRoot from './.ondevice/Storybook';
// export {StorybookUIRoot as default};
```
<br />

7. navigation 세팅 및 타입, 훅 작성


```
yarn add @react-navigation/native react-native-screens react-native-safe-area-context @react-navigation/native-stack
```
```
yarn add react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/bottom-tabs
```
```
// Navigation.tsx
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNavigator';

const Navigation = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
```
```
// StackNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackMenu} from 'constants/navigator/menu';
import Home from 'screens/Home';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={StackMenu.Home} component={Home} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
```
```
// models/navigator.ts
export type StackParamList = {};
export type BottomTabParamList = {};

export type StackScreenName = keyof StackParamList;
export type BottomTabScreenName = keyof BottomTabParamList;
```
```
// libs/hooks/useNavigator.ts
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {StackParamList, TabParamList} from 'models/navigator';

const useNavigator = () => {
  const stackNavigation = useNavigation<NavigationProp<StackParamList>>();
  const tabNavigation = useNavigation<NavigationProp<TabParamList>>();

  return {stackNavigation, tabNavigation};
};

export default useNavigator;

```
```
// App.tsx
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Navigation from './src/navigators/Navigation';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Navigation />
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;

// import StorybookUIRoot from './.ondevice/Storybook';
// export {StorybookUIRoot as default};
```
<br />

8. svg 세팅

```
yarn add react-native-svg
```
```
yarn add --dev react-native-svg-transformer
```
```
// metro.config.js
const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
```
```
// declaration.d.ts
declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```
<br />

9. husky, lint-staged 세팅

```
yarn add --dev husky
```
```
yarn add -D lint-staged
```
```
// pre-push.sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint
```
```
// pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged
```
```
// package.json 아래 항목 추가
"scripts": {
    "format": "prettier --cache --write .",
    "lint": "eslint --cache .",
  },
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
```
<br />

10. typo, palette, theme 세팅

```
// styles/palette.ts
export const palette = {};
```
```
// styles/theme.ts
import {palette} from './palette';

export type TypeOfTheme = {
  palette: TypeOfPalette;
};

export const theme: TypeOfTheme = {
  palette,
};

export type TypeOfPalette = typeof palette;
export type KeyOfPalette = keyof typeof palette;

export type KeyofTheme = keyof typeof theme;
```
```
// styles/typo.ts
import {StyleSheet} from 'react-native';

export const typoContainer = {typo: StyleSheet.create({})};
```
```
// styles/index.ts
export * from './palette';
export * from './theme';
export * from './typo';
```
