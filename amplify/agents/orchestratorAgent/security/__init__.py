"""
Security package for the orchestrator agent.
Contains security validation and pipeline functionality.
"""

from .pipeline import securityPipeline

# Expose security functions at package level
__all__ = ["securityPipeline"]
