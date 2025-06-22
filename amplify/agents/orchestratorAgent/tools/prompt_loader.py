from pathlib import Path


def load_raw_system_prompt(xml_file_path):
    """
    Load raw XML content from file.

    Args:
        xml_file_path (str): Path to the XML file containing the system prompt

    Returns:
        str: Raw XML content as string
    """
    try:
        with open(xml_file_path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"XML file not found: {xml_file_path}")
    except Exception as e:
        raise RuntimeError(f"Error reading XML file: {e}")


def get_orchestrator_system_prompt():
    """
    Convenience function to load the orchestrator system prompt.

    Returns:
        str: Raw XML content of the system prompt
    """
    # Get the directory of this file and construct the path to the prompt
    current_dir = Path(__file__).parent.parent
    prompt_file = current_dir / "systemprompt.xml"

    return load_raw_system_prompt(str(prompt_file))
