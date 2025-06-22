"""
Tools package for the orchestrator agent.
Contains utilities for agent invocation and prompt loading.
"""

from .agent_invoker import invokeAgent, InterfaceAgents, ResourceAgents, AGENT_CONFIG
from .prompt_loader import get_orchestrator_system_prompt, load_raw_system_prompt

# Expose commonly used items at package level
__all__ = [
    "invokeAgent",
    "InterfaceAgents",
    "ResourceAgents",
    "AGENT_CONFIG",
    "get_orchestrator_system_prompt",
    "load_raw_system_prompt",
]
