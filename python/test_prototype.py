"""
TechAssist AI - Comprehensive Phase 1 Python Prototype Test Suite
Tests all 10 core scenarios:
 1. Wi-Fi problem
 2. No internet problem
 3. Laptop overheating
 4. Laptop slow
 5. Browser crash
 6. Printer problem
 7. Unknown problem
 8. Ambiguous problem
 9. Complete Resolved Issue Flow
 10. Complete Escalated Issue Flow
"""

import sys
import os

# Add local directory to path
sys.path.append(os.path.dirname(__file__))

from knowledge_base import KnowledgeBase
from classifier import RuleClassifier
from decision_engine import DecisionEngine
from ticket_generator import TicketGenerator

def run_tests():
    print("=" * 60)
    print("TECHASSIST AI - PHASE 1 PROTOTYPE VALIDATION TEST SUITE")
    print("=" * 60)

    kb = KnowledgeBase()
    classifier = RuleClassifier()
    engine = DecisionEngine(kb)
    ticket_gen = TicketGenerator()

    # 1. Wi-Fi problem
    q1 = "My Wi-Fi isn't working and I can't connect to my home network."
    c1 = classifier.classify(q1)
    print(f"\n[Test 1: Wi-Fi problem]\nQuery: '{q1}'\n -> Category: {c1['category']} | Matched: {c1['problemId']} | Conf: {c1['confidence']}")
    assert c1['category'] == "Network", f"Expected Network, got {c1['category']}"

    # 2. No internet problem
    q2 = "My laptop is connected to Wi-Fi but websites are not opening."
    c2 = classifier.classify(q2)
    print(f"\n[Test 2: No internet problem]\nQuery: '{q2}'\n -> Category: {c2['category']} | Matched: {c2['problemId']} | Conf: {c2['confidence']}")
    assert c2['problemId'] == "wifi-no-internet", f"Expected wifi-no-internet, got {c2['problemId']}"

    # 3. Laptop overheating
    q3 = "My laptop is extremely hot and the fan is making loud spinning noises."
    c3 = classifier.classify(q3)
    print(f"\n[Test 3: Laptop overheating]\nQuery: '{q3}'\n -> Category: {c3['category']} | Matched: {c3['problemId']}")
    assert c3['category'] == "Hardware", f"Expected Hardware, got {c3['category']}"
    assert c3['problemId'] == "laptop-overheating"

    # 4. Laptop slow
    q4 = "My laptop is running very slow and applications are freezing with 100% disk usage."
    c4 = classifier.classify(q4)
    print(f"\n[Test 4: Laptop slow]\nQuery: '{q4}'\n -> Category: {c4['category']} | Matched: {c4['problemId']}")
    assert c4['category'] == "Performance", f"Expected Performance, got {c4['category']}"

    # 5. Browser crash
    q5 = "My Chrome keeps closing unexpectedly with an Aw Snap error."
    c5 = classifier.classify(q5)
    print(f"\n[Test 5: Browser crash]\nQuery: '{q5}'\n -> Category: {c5['category']} | Matched: {c5['problemId']}")
    assert c5['category'] == "Browser", f"Expected Browser, got {c5['category']}"

    # 6. Printer problem
    q6 = "My printer is connected but not printing any documents from the queue."
    c6 = classifier.classify(q6)
    print(f"\n[Test 6: Printer problem]\nQuery: '{q6}'\n -> Category: {c6['category']} | Matched: {c6['problemId']}")
    assert c6['category'] == "Printer", f"Expected Printer, got {c6['category']}"

    # 7. Unknown problem
    q7 = "The weather outside is very sunny and birds are singing."
    c7 = classifier.classify(q7)
    print(f"\n[Test 7: Unknown problem]\nQuery: '{q7}'\n -> Needs Clarification: {c7['needs_clarification']}")
    assert c7['needs_clarification'] is True

    # 8. Ambiguous problem
    q8 = "Something is wrong with my thing."
    c8 = classifier.classify(q8)
    print(f"\n[Test 8: Ambiguous problem]\nQuery: '{q8}'\n -> Needs Clarification: {c8['needs_clarification']}")
    assert c8['needs_clarification'] is True

    # 9. Resolved issue flow
    print("\n[Test 9: Interactive Decision Engine Flow -> RESOLUTION]")
    sess = engine.start_session("wifi-no-internet")
    print(f"Step 1 Question: {sess['question']}")
    print(f"User Response: YES (another device works)")
    res1 = engine.process_step("wifi-no-internet", sess['currentNodeId'], "YES")
    print(f"Step 2 Question: {res1['question']}")
    print(f"User Response: YES (flushing DNS fixed it)")
    res2 = engine.process_step("wifi-no-internet", res1['currentNodeId'], "YES")
    print(f"Final Status: {res2['status']}")
    print(f"Resolution Details: {res2['resolution']}")
    assert res2['status'] == "RESOLVED"

    # 10. Escalated issue flow with ticket creation
    print("\n[Test 10: Interactive Decision Engine Flow -> ESCALATION & TICKET CREATION]")
    sess = engine.start_session("laptop-overheating")
    print(f"Step 1 Question: {sess['question']}")
    res1 = engine.process_step("laptop-overheating", sess['currentNodeId'], "HARD DESK")
    print(f"Step 2 Question: {res1['question']}")
    res2 = engine.process_step("laptop-overheating", res1['currentNodeId'], "NO")
    print(f"Step 3 Question: {res2['question']}")
    res3 = engine.process_step("laptop-overheating", res2['currentNodeId'], "NO")
    print(f"Final Status: {res3['status']}")
    print(f"Escalation Reason: {res3['escalationReason']}")
    assert res3['status'] == "ESCALATED"

    # Generate escalation ticket
    ticket = ticket_gen.create_ticket(
        problem_description="Laptop overheating on hard desk, fan loud, dust cleaned but still hot",
        category="Hardware",
        possible_causes=["Dried thermal paste", "Fan bearing failure"],
        troubleshooting_steps=[
            {"question": "Surface placement?", "user_response": "HARD DESK"},
            {"question": "Runaway CPU process?", "user_response": "NO"},
            {"question": "Did clearing dust resolve it?", "user_response": "NO"}
        ],
        escalation_reason=res3['escalationReason'],
        severity="HIGH"
    )
    print(f"Generated Escalation Ticket ID: {ticket['ticket_id']} (Priority: {ticket['priority']})")
    assert ticket['ticket_id'].startswith("TS-2026-")

    print("\n" + "=" * 60)
    print("ALL 10 TEST SCENARIOS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
