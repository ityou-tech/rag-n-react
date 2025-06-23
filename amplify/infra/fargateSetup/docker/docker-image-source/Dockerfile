# ---------- 1. Builder stage -------------------------------------------------
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 as builder

# Basic hygiene
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install Python 3.11 and build prerequisites
RUN dnf -y update && \
    dnf -y install python3 python3-virtualenv \
    gcc g++ make  && \
    dnf clean all

# Prepare build workspace
WORKDIR /app

# Create and activate isolated virtual-env
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY amplify/agents/orchestratorAgent/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---------- 2. Runtime stage -------------------------------------------------
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PATH="/opt/venv/bin:$PATH"

# Copy virtual-env from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
WORKDIR /app
COPY amplify/agents/orchestratorAgent/ .

# Create non-root user (UID 1001) for parity with your earlier image
RUN groupadd -g 1001 orchestrator && \
    useradd  -r -g orchestrator -u 1001 -d /app -s /sbin/nologin orchestrator && \
    chown -R orchestrator:orchestrator /app

USER orchestrator

EXPOSE 8080

# Simple runtime health probe; replace with real /health route later
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python3 -c "import importlib.util, sys; sys.exit(0 if importlib.util.find_spec('strands') else 1)"

CMD ["python3", "orchestrator.py"]
