FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpango-1.0-0 libcairo2 libgdk-pixbuf2.0-0 \
        libffi-dev libxml2 libxslt1.1 libjpeg-dev libpng-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir fastapi uvicorn[standard] sqlalchemy aiosqlite jinja2 \
                       weasyprint pydyf python-docx openlocationcode

WORKDIR /app
COPY app /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
