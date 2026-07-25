"""
Skib-Jay-Dee-Toilet - Phase 1 backend scaffolding.

Real-time multiplayer (Phase 2+) and MongoDB persistence (Phase 4) are
roadmap items - see docs/code-seed-initial.md. For now this just accepts
WebSocket connections on /ws/match and logs the coordinates each connected
player reports, so the wire protocol is in place before the game loop
actually depends on it.
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("skib-jay-dee")

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "skib_jay_dee")

mongo_client = None
mongo_db = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global mongo_client, mongo_db
    if MONGODB_URI:
        # Deferred import: only pull in motor if a connection is configured,
        # since the database is a parking-lot item for this phase.
        from motor.motor_asyncio import AsyncIOMotorClient

        mongo_client = AsyncIOMotorClient(MONGODB_URI)
        mongo_db = mongo_client[MONGODB_DB_NAME]
        logger.info("Connected to MongoDB database '%s'", MONGODB_DB_NAME)
    else:
        logger.info("MONGODB_URI not set - running without persistence")

    yield

    if mongo_client:
        mongo_client.close()


app = FastAPI(title="Skib-Jay-Dee-Toilet API", lifespan=lifespan)


class MatchRoom:
    """Tracks the sockets connected to a single in-memory match."""

    def __init__(self):
        self.connections: dict[str, WebSocket] = {}

    async def connect(self, player_id: str, ws: WebSocket):
        await ws.accept()
        self.connections[player_id] = ws
        logger.info("Player %s joined /ws/match (%d online)", player_id, len(self.connections))

    def disconnect(self, player_id: str):
        self.connections.pop(player_id, None)
        logger.info("Player %s left /ws/match (%d online)", player_id, len(self.connections))


match_room = MatchRoom()


@app.get("/health")
async def health():
    return {"status": "ok", "mongo_connected": mongo_db is not None}


@app.websocket("/ws/match")
async def ws_match(websocket: WebSocket):
    player_id = websocket.query_params.get("player_id") or f"player-{id(websocket)}"
    await match_room.connect(player_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            x = data.get("x")
            y = data.get("y")
            role = data.get("role", "runner")
            logger.info("player=%s role=%s x=%s y=%s", player_id, role, x, y)

            if mongo_db is not None:
                await mongo_db.player_positions.insert_one(
                    {"player_id": player_id, "role": role, "x": x, "y": y}
                )
    except WebSocketDisconnect:
        match_room.disconnect(player_id)
