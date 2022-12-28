## To install dependencies

```bash
npm i
# or
npm install
```

## Env Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_MAP_API_KEY=
```

## File structure

```
components: All react functional components are exported from this folder

lib: All the helpers, utils, hooks, firebase utils are exported from this folder

pages: All NextPages of our application are in this folder and the contents are available as routes in our application.

public: All static assets are in this folder.

styles: All css related to our components and pages are in this folder. We are using tailwind so here the global style file ontains setup for tailwind css.
```

## How to clone repo and run the project

```bash
git clone https://git.geekyants.com/cleanrooms1/webapp-nextjs-tailwind-firebase.git .
```

This will clone the repo in the current working directory. If you have ssh access then you can use the ssh link to clone repo.

After cloning move into this folder and install dependencies, recommended to use `npm`

```bash
npm i
```

Then add the `.env` file to the root of the project, which is required to run the project locally and daploy later on. To run the project

```bash
npm run dev
```

We can build the project and make it ready for production by running

```bash
npm run build
```

In this step nextjs will minify and optimize our code. We can then choose to deploy through a variety of options.
<br/>
<br/>

## Tech Stack

```bash
firebase
  - firestore, analytics, firestore
nextjs
typescript
react-firebase-hooks
react-hot-toast
react-map-gl
react-draggable
typescript
tailwind
```

## Available scripts

You can write to you firestore database from the app by using the command

```bash
node append-restaurant-list.js
```

Internally we are passing the json object to this file to push to firestore, we can pass various types of json objects to write to different collections based on the requirements. The script is not completely modular so some change in script code would be required to achieve the result.

Note: The json object passed to this script is coming from `restaurantsData.json`, take a look to see the data object.
