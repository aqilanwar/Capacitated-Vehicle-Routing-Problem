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
    
# @app.get("/train_model", response_class=HTMLResponse)
# async def TrainModel():
#     return "True"
    
@app.get("/run_model", response_class=HTMLResponse)
async def TrainModel():
    # Start the runAlgo.py process asynchronously
    run_algo_process = subprocess.Popen(["python", "runAlgo.py"])

    # Wait for the runAlgo.py process to finish and get its return code
    return_code = run_algo_process.wait()

    # Check if the runAlgo.py process has completed successfully
    if return_code == 0:
        # Start the plotAllResults.py process asynchronously
        plot_results_process = subprocess.Popen(["python", "plotAllResults.py"])

        # Wait for the plotAllResults.py process to finish and get its return code
        plot_results_return_code = plot_results_process.wait()

        # Check if the plotAllResults.py process has completed successfully
        if plot_results_return_code == 0:
            return "True"  # Both processes completed successfully
        else:
            return "False"  # plotAllResults.py process failed
    else:
        return "False"  # runAlgo.py process failed


