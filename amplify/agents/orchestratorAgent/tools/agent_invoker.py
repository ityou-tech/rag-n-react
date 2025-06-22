import json
from enum import Enum
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


def _invokeBedrock(agentID, aliasID, payload, sessionID):
    """Invoke Bedrock agent with the provided configuration"""
    # Implementation for invoking Bedrock agent
    # This would contain the actual AWS Bedrock agent invocation logic
    pass


@tool
def invokeAgent(agentID, payload, sessionID):
    """Tool for invoking agents with the provided configuration"""
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
