"""
TechAssist AI - Decision Engine (Phase 1 Python Prototype)
Manages the diagnostic state machine, evaluates user responses, and transitions nodes.
"""

from typing import Dict, Any, List, Optional
from knowledge_base import KnowledgeBase

class DecisionEngine:
    def __init__(self, kb: Optional[KnowledgeBase] = None):
        self.kb = kb if kb else KnowledgeBase()

    def start_session(self, problem_id: str) -> Dict[str, Any]:
        entry = self.kb.get_by_id(problem_id)
        if not entry:
            return {
                "error": f"Problem template '{problem_id}' not found in knowledge base.",
                "is_valid": False
            }

        start_node = entry.get("nodes", {}).get("start")
        if not start_node:
            return {
                "error": "Malformed troubleshooting tree: missing start node.",
                "is_valid": False
            }

        return {
            "is_valid": True,
            "problemId": problem_id,
            "category": entry["category"],
            "title": entry["title"],
            "severity": entry["severity"],
            "symptoms": entry["symptoms"],
            "possibleCauses": entry["possibleCauses"],
            "currentNodeId": "start",
            "stepNumber": start_node.get("stepNumber", 1),
            "instruction": start_node.get("instruction", ""),
            "question": start_node.get("question", ""),
            "options": [opt["label"] for opt in start_node.get("options", [])],
            "optionsDetails": start_node.get("options", []),
            "status": "IN PROGRESS"
        }

    def process_step(self, problem_id: str, current_node_id: str, user_response: str) -> Dict[str, Any]:
        entry = self.kb.get_by_id(problem_id)
        if not entry:
            return {"error": "Invalid problem ID", "is_valid": False}

        nodes = entry.get("nodes", {})
        current_node = nodes.get(current_node_id)
        if not current_node:
            return {"error": f"Invalid node '{current_node_id}'", "is_valid": False}

        # Normalize response
        resp_norm = user_response.strip().upper()

        # Find matching option
        matched_opt = None
        for opt in current_node.get("options", []):
            if opt["label"].upper() == resp_norm or resp_norm in opt["label"].upper():
                matched_opt = opt
                break

        if not matched_opt:
            # Fallback if binary YES/NO
            if "YES" in resp_norm:
                matched_opt = next((o for o in current_node.get("options", []) if "YES" in o["label"].upper()), None)
            elif "NO" in resp_norm:
                matched_opt = next((o for o in current_node.get("options", []) if "NO" in o["label"].upper()), None)

        if not matched_opt:
            return {
                "error": f"Invalid option '{user_response}'. Valid options: {[o['label'] for o in current_node.get('options', [])]}",
                "is_valid": False
            }

        # Check resolution
        if matched_opt.get("isResolution"):
            return {
                "is_valid": True,
                "status": "RESOLVED",
                "resolution": matched_opt.get("resolutionText", "Issue marked as resolved."),
                "summary": matched_opt.get("summary", "Problem solved by user confirmation."),
                "isComplete": True,
                "isEscalated": False
            }

        # Check escalation
        if matched_opt.get("isEscalation"):
            return {
                "is_valid": True,
                "status": "ESCALATED",
                "escalationReason": matched_opt.get("escalationReason", "Troubleshooting steps exhausted without resolution."),
                "summary": matched_opt.get("summary", "Escalated to technical support engineering."),
                "isComplete": True,
                "isEscalated": True
            }

        # Move to next node
        next_node_id = matched_opt.get("nextNodeId")
        if not next_node_id or next_node_id not in nodes:
            return {
                "is_valid": True,
                "status": "ESCALATED",
                "escalationReason": "End of automated decision tree reached without full resolution.",
                "isComplete": True,
                "isEscalated": True
            }

        next_node = nodes[next_node_id]
        return {
            "is_valid": True,
            "status": "IN PROGRESS",
            "currentNodeId": next_node_id,
            "stepNumber": next_node.get("stepNumber", 1),
            "instruction": next_node.get("instruction", ""),
            "question": next_node.get("question", ""),
            "options": [opt["label"] for opt in next_node.get("options", [])],
            "optionsDetails": next_node.get("options", []),
            "summary": matched_opt.get("summary", ""),
            "isComplete": False,
            "isEscalated": False
        }
