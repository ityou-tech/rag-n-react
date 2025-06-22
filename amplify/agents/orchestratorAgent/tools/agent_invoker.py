import json
from enum import Enum
from typing import Dict, Any, Optional
from strands import tool


class InterfaceAgents(Enum):
    CHATBOT_CUSTOMER = "CHATBOT_CUSTOMER"
    VERIFY_ANSWER = "VERIFY_ANSWER"
    OUTPUT_VALIDATION = "OUTPUT_VALIDATION"
    KNOWLEDGEBASE = "KNOWLEDGEBASE"


class ResourceAgents(Enum):
    SERVICENOW = "SERVICENOW"
    MATILLION = "MATILLION"
    SNOWFLAKE = "SNOWFLAKE"
    ATLASSIAN = "ATLASSIAN"


AGENT_CONFIG = {
    InterfaceAgents.CHATBOT_CUSTOMER.value: {
        "agentID": "CHATBOT_CUSTOMER_AGENT_ID",
        "aliasID": "CHATBOT_CUSTOMER_ALIAS_ID",
    },
    InterfaceAgents.VERIFY_ANSWER.value: {
        "agentID": "VERIFY_ANSWER_AGENT_ID",
        "aliasID": "VERIFY_ANSWER_ALIAS_ID",
    },
    InterfaceAgents.OUTPUT_VALIDATION.value: {
        "agentID": "OUTPUT_VALIDATION_AGENT_ID",
        "aliasID": "OUTPUT_VALIDATION_ALIAS_ID",
    },
    InterfaceAgents.KNOWLEDGEBASE.value: {
        "agentID": "KNOWLEDGEBASE_AGENT_ID",
        "aliasID": "KNOWLEDGEBASE_ALIAS_ID",
    },
    ResourceAgents.SERVICENOW.value: {
        "agentID": "SERVICENOW_AGENT_ID",
        "aliasID": "SERVICENOW_ALIAS_ID",
    },
    ResourceAgents.MATILLION.value: {
        "agentID": "MATILLION_AGENT_ID",
        "aliasID": "MATILLION_ALIAS_ID",
    },
    ResourceAgents.SNOWFLAKE.value: {
        "agentID": "SNOWFLAKE_AGENT_ID",
        "aliasID": "SNOWFLAKE_ALIAS_ID",
    },
    ResourceAgents.ATLASSIAN.value: {
        "agentID": "ATLASSIAN_AGENT_ID",
        "aliasID": "ATLASSIAN_ALIAS_ID",
    },
}


def _invokeBedrock(
    agentID: str, aliasID: str, payload: Dict[str, Any], sessionID: str
) -> Any:
    """
    Invoke Bedrock agent with the provided configuration.

    Args:
        agentID: The unique identifier for the Bedrock agent
        aliasID: The alias identifier for the agent version
        payload: The payload to send to the agent
        sessionID: The session identifier for tracking conversations

    Returns:
        Any: Response from the Bedrock agent
    """
    # Implementation for invoking Bedrock agent
    # This would contain the actual AWS Bedrock agent invocation logic
    pass


@tool
def invokeAgent(
    agentID: str, payload: Dict[str, Any], sessionID: Optional[str] = None
) -> str:
    """
    Tool for delegating tasks to specialized agents within the multi-agent system.

    This tool serves as the primary mechanism for the orchestrator agent to delegate
    specific tasks to other specialized agents. Each agent is designed to handle
    particular types of requests or interact with specific resources.

    When to use this tool:
    ----------------------
    - When you need to delegate a task to a specialized agent (e.g., knowledge base queries)
    - When the current context requires expertise from a specific domain agent
    - When you need tointeract with external resources through their dedicated agents
    - When breaking down complex requests into smaller, agent-specific tasks
    - When you want to leverage the specialized capabilities of interface or resource agents

    Available Agent Types:
    ---------------------
    Interface Agents:
    - CHATBOT_CUSTOMER: Handles customer-facing chat interactions and responses
    - VERIFY_ANSWER: Validates and verifies the accuracy of generated responses
    - OUTPUT_VALIDATION: Performs final validation of outputs before delivery
    - KNOWLEDGEBASE: Queries and retrieves information from knowledge bases

    Resource Agents:
    - SERVICENOW: Interacts with ServiceNow platform for IT service management
    - MATILLION: Handles data integration and ETL operations via Matillion
    - SNOWFLAKE: Manages data warehouse operations and queries in Snowflake
    - ATLASSIAN: Integrates with Atlassian tools (Jira, Confluence, etc.)

    Args:
        agentID (str): The identifier for the target agent. Must be one of the values
                      from InterfaceAgents or ResourceAgents enums. This determines
                      which specialized agent will handle the request.

        payload (Dict[str, Any]): The data payload to send to the target agent.
                                 This should contain all necessary information for
                                 the agent to process the request. The structure may
                                 vary depending on the target agent's requirements.

        sessionID (Optional[str]): An optional session identifier for tracking
                                  conversations and maintaining context across
                                  multiple interactions. If not provided, a unique
                                  session ID will be automatically generated based
                                  on the agentID and payload hash.

    Returns:
        str: The response from the target agent, or an error message if the
             agent could not be found or invoked.

    Examples:
        # Query knowledge base for information
        response = invokeAgent(
            agentID="KNOWLEDGEBASE",
            payload={"query": "What is the company policy on remote work?"},
            sessionID="user_123_session"
        )

        # Create a ServiceNow ticket
        response = invokeAgent(
            agentID="SERVICENOW",
            payload={
                "action": "create_ticket",
                "title": "Database connection issue",
                "description": "Cannot connect to production database"
            }
        )

        # Validate output before sending to user
        response = invokeAgent(
            agentID="OUTPUT_VALIDATION",
            payload={"content": "Generated response text", "type": "customer_response"}
        )

    Raises:
        Returns error string if agentID is not found in AGENT_CONFIG.
    """
    agentToInvoke = AGENT_CONFIG.get(agentID)
    if not agentToInvoke:
        return f"unknown agent key: {agentID}"

    sid = sessionID or f"{agentID}_{hash(json.dumps(payload)) % 1000}"

    return _invokeBedrock(
        agentID=agentToInvoke["agentID"],
        aliasID=agentToInvoke["aliasID"],
        payload=payload,
        sessionID=sid,
    )
