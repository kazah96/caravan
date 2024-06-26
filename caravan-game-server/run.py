import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "caravan_game_server.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
