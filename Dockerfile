# Use an official Python runtime
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# # Copy only what's needed
# COPY requirements.txt .
# COPY backend/ .

# Copy everything from the build context into the container
COPY . .

# Install system dependencies (including ffmpeg and PyAudio deps)
RUN apt-get update && \
    apt-get install -y \
        ffmpeg \
        portaudio19-dev \
        python3-dev \
        build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port
EXPOSE 8000

# Run the app
CMD ["python", "backend/routes.py"]
