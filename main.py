import subprocess

from typing import Union
from fastapi import FastAPI, WebSocket, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path

app = FastAPI()

app.mount("/static", StaticFiles(directory=Path(__file__).parent/"static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def StartPage():
    with open("static/start.html", "r", encoding="utf-8") as file:
        return file.read()


@app.get("/dashboard", response_class=HTMLResponse)
async def DashboardPage():
    with open("static/index.html", "r", encoding="utf-8") as file:
        return file.read()


@app.get("/train_model", response_class=HTMLResponse)
async def TrainModel():
    # Start the process asynchronously
    process = subprocess.Popen(["python", "parsecsv2json.py", "dataset/Data.csv"])

    # Wait for the process to finish and get its return code
    return_code = process.wait()

    # Check if the process has completed successfully
    if return_code == 0:
        return "True"
    else:
        return "False"

