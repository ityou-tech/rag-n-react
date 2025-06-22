import logging
from typing import Dict, Any, Optional
from tools.agent_invoker import invokeAgent
from tools.prompt_loader import get_orchestrator_system_prompt
from security import (
    securityPipeline,
    process_security_result,
    validate_processed_payload,
)
from strands import Agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _validate_agent_input(agent) -> None:
    """
    Validate the agent instance.

    Args:
        agent: The agent instance to validate

    Raises:
        TypeError: If agent is None or not callable
    """
    if agent is None:
        logger.error("Agent instance is None")
        raise TypeError("Agent instance cannot be None")

    if not hasattr(agent, "__call__"):
        logger.error("Agent instance is not callable")
        raise TypeError("Agent instance must be callable")


def _validate_payload_input(payload: str) -> None:
    """
    Validate the payload input.

    Args:
        payload: The payload to validate

    Raises:
        ValueError: If payload is invalid
    """
    if not payload or not isinstance(payload, str):
        logger.error(f"Invalid payload type or value: {type(payload)}")
        raise ValueError("Payload must be a non-empty string")


def _handle_agent_invocation_error(e: Exception) -> Dict[str, Any]:
    """
    Handle different types of agent invocation errors.

    Args:
        e: The exception that occurred

    Returns:
        dict: Structured error response
    """
    if isinstance(e, TypeError):
        error_msg = f"Type error in orchestrator invocation: {e}"
        logger.error(error_msg)
        return {"status": "error", "error": error_msg, "error_type": "TypeError"}
    elif isinstance(e, ValueError):
        error_msg = f"Value error in orchestrator invocation: {e}"
        logger.error(error_msg)
        return {"status": "error", "error": error_msg, "error_type": "ValueError"}
    elif isinstance(e, AttributeError):
        error_msg = f"Agent method error: {e}"
        logger.error(error_msg)
        return {"status": "error", "error": error_msg, "error_type": "AttributeError"}
    else:
        error_msg = f"Unexpected error during agent invocation: {e}"
        logger.error(error_msg, exc_info=True)
        return {"status": "error", "error": error_msg, "error_type": type(e).__name__}


def invokeOrchestratorAgent(agent, payload: str) -> Dict[str, Any]:
    """
    Function that invokes the orchestrator agent with security pipeline processing.

    Args:
        agent: The orchestrator agent instance
        payload (str): The user payload/prompt to be processed

    Returns:
        dict: Response from the agent after security processing
    """
    try:
        # Validate inputs
        _validate_agent_input(agent)
        _validate_payload_input(payload)

        logger.info(
            f"Starting orchestrator agent invocation for payload length: {len(payload)}"
        )

        # Run the payload through the security pipeline
        security_result = securityPipeline(payload)

        # Process security result
        security_error = process_security_result(security_result)
        if security_error:
            return security_error

        # Validate processed payload
        processed_payload = security_result["processed_prompt"]
        payload_error = validate_processed_payload(processed_payload, security_result)
        if payload_error:
            return payload_error

        # Invoke the agent with the processed payload
        logger.info("Invoking orchestrator agent with processed payload")
        response = agent(processed_payload)

        logger.info("Orchestrator agent invocation completed successfully")
        return {
            "status": "success",
            "response": response,
            "security_info": security_result,
        }

    except (TypeError, ValueError, AttributeError, Exception) as e:
        return _handle_agent_invocation_error(e)


def _load_system_prompt() -> str:
    """
    Load and validate the system prompt from XML file.

    Returns:
        str: The loaded system prompt

    Raises:
        FileNotFoundError: If system prompt file not found
        ValueError: If system prompt is empty
        RuntimeError: If loading fails
    """
    try:
        system_prompt = get_orchestrator_system_prompt()
        if not system_prompt:
            logger.error("System prompt is empty or None")
            raise ValueError("System prompt cannot be empty")

        logger.info(f"Loaded system prompt (length: {len(system_prompt)})")
        return system_prompt

    except FileNotFoundError as e:
        logger.error(f"System prompt file not found: {e}")
        raise FileNotFoundError(f"Could not load system prompt: {e}")
    except Exception as e:
        logger.error(f"Error loading system prompt: {e}")
        raise RuntimeError(f"Failed to load system prompt: {e}")


def _create_agent_instance(system_prompt: str) -> Agent:
    """
    Create the agent instance with the provided system prompt.

    Args:
        system_prompt: The system prompt for the agent

    Returns:
        Agent: The created agent instance

    Raises:
        RuntimeError: If agent creation fails
    """
    try:
        orchestrator = Agent(system_prompt=system_prompt, tools=[invokeAgent])

        if orchestrator is None:
            logger.error("Agent creation returned None")
            raise RuntimeError("Failed to create agent instance")

        logger.info("Orchestrator agent created successfully")
        return orchestrator

    except Exception as e:
        logger.error(f"Error creating agent: {e}")
        raise RuntimeError(f"Failed to create orchestrator agent: {e}")


def orchestratorAgent() -> Optional[Agent]:
    """
    Main orchestrator agent function that creates and configures the orchestrator agent.
    The system prompt is loaded from the XML file.

    Returns:
        Agent: Configured orchestrator agent instance
        None: If agent creation fails

    Raises:
        RuntimeError: If agent creation fails
        FileNotFoundError: If system prompt file not found
    """
    try:
        logger.info("Creating orchestrator agent")

        # Load system prompt from XML file
        system_prompt = _load_system_prompt()

        # Create the agent with tools
        orchestrator = _create_agent_instance(system_prompt)

        return orchestrator

    except (FileNotFoundError, ValueError, RuntimeError) as e:
        # Re-raise known exceptions
        logger.error(f"Known error in orchestrator agent creation: {e}")
        raise
    except Exception as e:
        # Handle unexpected errors
        error_msg = f"Unexpected error creating orchestrator agent: {e}"
        logger.error(error_msg, exc_info=True)
        raise RuntimeError(error_msg)


if __name__ == "__main__":
    """
    Main entry point for testing the orchestrator agent.
    """
    try:
        logger.info("Starting orchestrator agent test")

        # Create the orchestrator agent
        agent = orchestratorAgent()

        if agent is None:
            logger.error("Failed to create orchestrator agent")
            exit(1)

        # Test payload
        test_payload = "Hello, this is a test payload for the orchestrator agent."

        # Invoke the agent
        result = invokeOrchestratorAgent(agent, test_payload)

        # Print results
        if result["status"] == "success":
            logger.info("Test completed successfully")
            print("Success:", result["response"])
        else:
            logger.error(f"Test failed: {result.get('error', 'Unknown error')}")
            print("Error:", result)

    except KeyboardInterrupt:
        logger.info("Test interrupted by user")
        print("\nTest interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error in main: {e}", exc_info=True)
        print(f"Fatal error: {e}")
        exit(1)
