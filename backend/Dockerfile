# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY ./app /app/app

RUN pip install fastapi uvicorn openlocationcode

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
