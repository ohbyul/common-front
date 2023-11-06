# [React](https://reactjs.org/) &middot;[![npm version](https://img.shields.io/badge/npm-8.11.0-green)](https://www.npmjs.com/package/react) [![react](https://img.shields.io/badge/react-17.0.2-blue)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request) [![webpack](https://img.shields.io/badge/webpack-5.52.1-orange)](https://webpack.js.org/)

React is a JavaScript library for building user interfaces.

* **Declarative:** React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable, simpler to understand, and easier to debug.
* **Component-Based:** Build encapsulated components that manage their state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep the state out of the DOM.
* **Learn Once, Write Anywhere:** We don't make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using [React Native](https://reactnative.dev/).


[Learn how to use React in your project](https://reactjs.org/docs/getting-started.html).

## Description

COMMON PORTAL - Front-END

해당 프로젝트는 React 로 구성된 프론트엔드 프로젝트

<!-- 백엔드의 경우 GIT 경로는 아래와 같습니다. -->

<!-- DTVERSE(디티버스) MEMBER PORTAL BACK-END 소스 바로가기 - [GITLAB](https://gitlab.com/dtverse/be-dtverse-memberportal) -->


[React](https://github.com/facebook/react) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
## Running the app

```bash
# 로컬 환경에서 구동시
$ npm run dev

# 운영환경에서 구동시 빌드 후 구동
$ npm run build
$ npm run prod

# PM2로 구동시
$ npm run build
$ pm2 start dist/main.js --name be-memberportal
```


```
port 설정은 webpack.dev.js proxy 설정
localhost:3000 접속


## Distribute

```bash
$ npm run build
```

## 환경파일
   .env (db 접속정보 및 구동 port 설정됨) -> git에서 관리하지 않고 개발자 로컬에서 관리함

## Creation date
2023.11.06 by b.oh
### License

React is [MIT licensed](https://github.com/facebook/react/blob/main/LICENSE).
