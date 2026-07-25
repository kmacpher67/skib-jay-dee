# from gemini 2026-07-25 

You are an expert full-stack game developer. Your objective is to build Phase 1 of a mobile-first, 2D web-based multiplayer chase game called "Skib-jay-dee-toilet". 

### Architectural Stack
*   **Frontend UI:** React
*   **Game Engine:** HTML5 Canvas with Vanilla JavaScript (16-bit retro arcade-style physics and rendering)
*   **Backend & Networking:** FastAPI (Python) using WebSockets for real-time multiplayer syncing
*   **Database:** MongoDB
*   **Deployment Target:** Local development environment (Ubuntu Linux / Windows)

### Core Requirements & Layout
1.  **Display Mode:** The game must strictly render in a vertical portrait orientation ("Up Down mode / WORLD STAR!!!"). Restrict the HTML5 Canvas to a 9:16 aspect ratio.
2.  **Art Style:** 2D top-down perspective. Use placeholder colored squares for sprites initially (Runner = Green, Chaser/Toilet = Brown/White).
3.  **Controls:** Implement a mobile-responsive virtual joystick on the bottom left of the screen for movement, and a "Sprint" button on the bottom right.

### Phase 1 Features to Implement
1.  **Basic Game Loop:** Create a Vanilla JS engine running inside a React component. Include `update()` and `draw()` functions locked to 60 FPS.
2.  **Movement & Boundaries:** Create a simple map (The Porcelain Palace) with basic wall collisions.
3.  **The Chase Mechanic:** 
    *   Implement logic where a Chaser hunts a Runner. 
    *   If the Chaser's bounding box intersects the Runner's bounding box, trigger a "Caught" event.
4.  **The Jump-Scare Zoom:** When the "Caught" event triggers, pause player movement. Instantly scale and center the camera on the victim's coordinates (zoom in aggressively) and display a placeholder flashing red screen with text: "JAYDEN CAPTURED!".
5.  **Face Upload (UI):** Build a simple React component on the main menu that allows the user to upload a local image file. Convert this image to a base64 string, store it in state, and draw it onto the player's Canvas sprite.
6.  **Backend Scaffolding:** Create a basic FastAPI server with a WebSocket endpoint `/ws/match` that accepts connections and logs player coordinates. Ensure the MongoDB connection string is configurable via environment variables.

### Output Instructions
Provide the complete file structure and the initial code for:
1.  The FastAPI `main.py` with WebSocket setup and MongoDB initialization.
2.  The React `App.jsx` containing the main menu and face upload logic.
3.  The HTML5 Canvas `GameEngine.js` class handling the game loop, vertical mobile rendering, virtual joystick, and jump-scare logic.
Ensure the code is modular, well-commented, and ready to be executed locally.