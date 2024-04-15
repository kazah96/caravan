from fastapi import FastAPI
from .socket import socketApp

fastapiApp = FastAPI()


fastapiApp.mount("/ws", socketApp)
