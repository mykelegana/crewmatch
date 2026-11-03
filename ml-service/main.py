from fastapi import FastAPI

app = FastAPI(title="CrewMatch ML Service")

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
