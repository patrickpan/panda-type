# Panda Type 🐼

Panda Type is an immersive typing-speed app built with React, TypeScript, and Vite. It pairs a focused typing test with an animated scene powered by React Three Fiber.

The session is short and direct: type through 30 generated words, get live WPM, raw WPM, accuracy, elapsed time, and then review your final result.

Deployed at https://panda-type.surge.sh/

## Features

- Real-time typing engine with per-letter correctness state
- Live WPM, raw WPM, accuracy, progress, and elapsed-time HUD
- 3D background scene that reacts to typing progress
- Ripple feedback when words are completed
- Final result screen with retry flow
- Unit tests for the typing engine, UI, word list, and scene components
- Playwright E2E coverage for a full typing session

## Tech Stack

- React 18
- TypeScript
- Vite
- React Three Fiber, Drei, and Three.js
- Framer Motion
- Styled Components
- Jest and React Testing Library
- Playwright

## Getting Started

Install dependencies:

```sh
yarn
```

Start the Vite dev server:

```sh
yarn dev
```

The app is served by Vite, typically at:

```txt
http://localhost:5173
```

`yarn watch` is also available and runs the same Vite dev server.

## Scripts

```sh
yarn dev
```

Start the local development server.

```sh
yarn build
```

Create a production build.

```sh
yarn preview
```

Preview the production build locally.

```sh
yarn test
```

Run the Jest test suite.

```sh
yarn e2e
```

Run the Playwright E2E test suite. Playwright starts the Vite dev server automatically.

## Project Structure

```txt
src/
  components/
    scene/        3D scene components and tests
    ui/           Typing overlay, HUD, result screen, and effects
  data/           Word generation
  hooks/          Typing engine state and scoring logic
  App.tsx         App composition
  main.tsx        React entry point
  index.css       Global styles

e2e/              Playwright tests
public/           Static assets
```

## Testing

Run unit tests:

```sh
yarn test
```

Run the browser flow test:

```sh
yarn e2e
```

The E2E test opens the app, types the generated word list, waits for the typing overlay to unmount, and checks that the final results are shown.
