# Window.postMessage Demo

A small React + Vite demo that shows how `window.postMessage` works between a parent window and an embedded iframe.

This project demonstrates:
- sending messages from a parent page to an iframe
- listening for incoming messages inside the iframe
- updating a Leaflet map based on the message
- sending a response back to the parent
- logging both outgoing and incoming message traffic in the UI

Related article:
- Understanding `window.postMessage` and `window.parent.postMessage` in JavaScript: https://medium.com/@mrajaeim/understanding-window-postmessage-and-window-parent-postmessage-in-javascript-f09d4eac68ba

## Features

- React-based UI for selecting a country
- Inline iframe with a Leaflet map
- Two-way communication using `postMessage`
- Live message log to visualize requests and responses
- Easy-to-run Vite setup for local experimentation

## What this project demonstrates

The app renders a parent interface with country buttons. Clicking a country sends a message like:

```js
{ country: 'Japan' }
```

to the iframe using:

```js
iframeRef.contentWindow.postMessage(message, '*');
```

Inside the iframe, a message listener receives the event and updates the map view. Once the map moves, the iframe sends a confirmation back to the parent via:

```js
window.parent.postMessage(
  {
    type: 'confirmation',
    message: 'Map moved to Japan'
  },
  '*'
);
```

The parent window listens for incoming messages and displays them in a message log.

## Tech stack

- React
- Vite
- JavaScript
- HTML
- CSS
- Leaflet (embedded in the iframe)
- Tailwind CSS

## Project structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── src
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public
├── LICENSE
├── README.md
└── package-lock.json
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL in your browser (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Security notes

This example intentionally uses `'*'` as the target origin for simplicity, but in real applications you should avoid that.

Use a specific origin instead:

```js
iframeRef.contentWindow.postMessage(message, 'https://example.com');
```

And validate incoming messages before acting on them:

```js
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return;

  if (event.data && typeof event.data.country === 'string') {
    // safe to use
  }
});
```

## Why this matters

`postMessage` is a core browser API used for:
- parent ↔ iframe communication
- cross-window messaging
- embedded widgets and dashboards
- secure messaging between trusted pages

This repo is meant as a learning-focused example to make that communication easy to understand.

## License

MIT
