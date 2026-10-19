"""
TechAssist AI - Support Ticket Generator (Phase 1 Python Prototype)
Generates structured escalation support tickets with full diagnostic audit logs.
"""

import time
import random
from typing import Dict, Any, List

class TicketGenerator:
    def __init__(self):
        self.year = 2026

    def generate_ticket_id(self) -> str:
        random_num = random.randint(10000, 99999)
        return f"TS-{self.year}-{random_num}"

    def create_ticket(
        self,
        problem_description: str,
        category: str,
        possible_causes: List[str],
        troubleshooting_steps: List[Dict[str, Any]],
        escalation_reason: str,
        severity: str = "HIGH"
    ) -> Dict[str, Any]:
        ticket_id = self.generate_ticket_id()
        
        # Priority mapping
        priority_map = {
            "CRITICAL": "P1 - Critical",
            "HIGH": "P2 - High",
            "MEDIUM": "P3 - Normal",
            "LOW": "P4 - Low"
        }
        priority = priority_map.get(severity.upper(), "P2 - High")

        # Compile formatted audit log
        formatted_audit = []
        for i, step in enumerate(troubleshooting_steps, 1):
            q = step.get("question", step.get("instruction", "Diagnostic Step"))
            ans = step.get("user_response", step.get("response", "N/A"))
            formatted_audit.append({
                "step": i,
                "action": q,
                "user_response": ans,
                "notes": step.get("summary", "")
            })

        ticket = {
            "ticket_id": ticket_id,
            "status": "OPEN",
            "priority": priority,
            "severity": severity,
            "category": category,
            "problem_description": problem_description,
            "escalation_reason": escalation_reason,
            "possible_causes": possible_causes,
            "steps_attempted_count": len(troubleshooting_steps),
            "audit_trail": formatted_audit,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        return ticket

if __name__ == "__main__":
    gen = TicketGenerator()
    sample_ticket = gen.create_ticket(
        problem_description="Connected to Wi-Fi but no internet",
        category="Network",
        possible_causes=["DNS failure", "ISP outage"],
        troubleshooting_steps=[
            {"question": "Can another device access internet?", "user_response": "NO"},
            {"question": "Did power cycling router help?", "user_response": "NO"}
        ],
        escalation_reason="Physical WAN light unlit on modem.",
        severity="HIGH"
    )
    print("Generated Ticket:")
    for k, v in sample_ticket.items():
        print(f" {k}: {v}")
