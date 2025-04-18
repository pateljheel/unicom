# Use Python 3.9 slim as base image for smaller size
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies (including build tools for Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    build-essential \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create directory for MongoDB CA certificate
# RUN mkdir -p /etc/ssl/mongodb

# Copy requirements first to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port defined in environment variables (default: 5000)
EXPOSE 5000

# Set environment variable to tell Python not to buffer stdout and stderr
ENV PYTHONUNBUFFERED=1

# Command to run the application
CMD ["python", "app.py"]