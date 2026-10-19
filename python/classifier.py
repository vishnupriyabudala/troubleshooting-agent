"""
TechAssist AI - Rule Classifier (Phase 1 Python Prototype)
Classifies user problem descriptions into technical categories and matched problem templates.
Handles natural language synonyms and ambiguous requests.
"""

import re
from typing import Dict, Any, List, Optional

class RuleClassifier:
    def __init__(self):
        # Category keyword triggers and weightings
        self.rules = {
            "Network": {
                "keywords": [
                    "wifi", "wi-fi", "internet", "network", "router", "modem", "dns", "ping",
                    "ip address", "lan", "wlan", "ssid", "connection", "websites not opening",
                    "cannot open site", "no internet", "gateway", "dhcp", "bandwidth"
                ],
                "problem_mappings": {
                    "wifi-no-internet": [
                        "connected to wifi but no internet", "wifi connected no internet",
                        "websites are not opening", "no internet", "cannot access internet",
                        "websites wont load", "wifi isn't working", "dns", "can't access the internet"
                    ]
                }
            },
            "Hardware": {
                "keywords": [
                    "overheating", "hot", "fan", "fan noise", "burning", "battery", "keyboard",
                    "charger", "power", "screen flickering", "hinge", "thermal", "cooling"
                ],
                "problem_mappings": {
                    "laptop-overheating": [
                        "laptop is extremely hot", "overheating", "hot laptop", "fan spinning loudly",
                        "fan noise", "laptop shuts down when hot", "loud fan", "thermal throttle"
                    ]
                }
            },
            "Performance": {
                "keywords": [
                    "slow", "lag", "lagging", "freezing", "freeze", "stuck", "unresponsive",
                    "spinning wheel", "ram", "high memory", "100% disk", "cpu 100", "boot slow"
                ],
                "problem_mappings": {
                    "laptop-slow-performance": [
                        "laptop is slow", "laptop running slow", "computer is slow", "freezing",
                        "lagging", "taking long time to open", "apps hang", "spinning circle"
                    ]
                }
            },
            "Browser": {
                "keywords": [
                    "browser", "chrome", "firefox", "edge", "safari", "aw snap", "tab crash",
                    "tabs closing", "extensions", "incognito", "web page crash"
                ],
                "problem_mappings": {
                    "browser-crashes": [
                        "chrome keeps closing", "browser keeps crashing", "tabs keep crashing",
                        "browser closing unexpectedly", "chrome freezes", "aw snap"
                    ]
                }
            },
            "Printer": {
                "keywords": [
                    "printer", "print", "printing", "spooler", "paper jam", "ink", "toner",
                    "printer offline", "not printing"
                ],
                "problem_mappings": {
                    "printer-failure": [
                        "printer is connected but not printing", "printer offline", "cannot print",
                        "print queue stuck", "printer not responding", "printer stopped printing"
                    ]
                }
            },
            "Software": {
                "keywords": [
                    "app", "software", "program", "application", "crash", "crashes", "dll",
                    "vcruntime", "not responding", "error code", "won't open", "wont launch"
                ],
                "problem_mappings": {
                    "software-crashes": [
                        "application keeps crashing", "app won't open", "missing dll",
                        "software crash", "program closes immediately", "msvcp140"
                    ]
                }
            },
            "Operating System": {
                "keywords": [
                    "windows", "bsod", "blue screen", "boot loop", "automatic repair",
                    "startup repair", "kernel", "stop code", "update failed", "os"
                ],
                "problem_mappings": {
                    "os-bsod-boot": [
                        "blue screen", "bsod", "boot loop", "stuck on startup",
                        "automatic repair loop", "windows keeps crashing", "critical process died"
                    ]
                }
            },
            "Storage": {
                "keywords": [
                    "disk full", "storage", "low disk space", "c drive full", "hard drive",
                    "ssd full", "no space left", "free up space"
                ],
                "problem_mappings": {
                    "storage-full": [
                        "c drive is full", "low disk space", "storage full", "out of space",
                        "no space left to download"
                    ]
                }
            }
        }

    def clean_text(self, text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r"[^\w\s-]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text

    def classify(self, user_text: str) -> Dict[str, Any]:
        cleaned = self.clean_text(user_text)
        if not cleaned:
            return {
                "category": "Unknown",
                "problemId": None,
                "confidence": 0.0,
                "needs_clarification": True,
                "clarification_message": "Please describe the symptoms or error message you are seeing."
            }

        scores: Dict[str, float] = {}
        for category, data in self.rules.items():
            cat_score = 0.0
            # Keyword matching
            for kw in data["keywords"]:
                if f" {kw} " in f" {cleaned} " or kw == cleaned:
                    cat_score += 1.5
                elif kw in cleaned:
                    cat_score += 0.8
            scores[category] = cat_score

        best_category = max(scores, key=scores.get)
        best_score = scores[best_category]

        # Specific problem mapping
        matched_problem_id = None
        max_map_score = 0.0

        if best_category in self.rules:
            mappings = self.rules[best_category]["problem_mappings"]
            for pid, phrases in mappings.items():
                for phrase in phrases:
                    if phrase in cleaned:
                        score = len(phrase) / max(len(cleaned), 1) * 2.0
                        if score > max_map_score:
                            max_map_score = score
                            matched_problem_id = pid

            # Default to primary problem if category matched strongly
            if not matched_problem_id and best_score >= 1.0:
                matched_problem_id = list(mappings.keys())[0]

        # Normalize confidence to 0.0 - 1.0
        confidence = min(round((best_score + max_map_score) / 3.0, 2), 0.98)

        # Ambiguity / Unknown check
        if best_score < 0.8 or confidence < 0.35:
            return {
                "category": "Ambiguous / Unknown",
                "problemId": None,
                "confidence": confidence,
                "needs_clarification": True,
                "clarification_message": "I could not confidently identify the technical issue from your description. Could you clarify if this involves Wi-Fi/Internet, Laptop Hardware/Overheating, System Slowness, Browser, Printer, or Operating System?"
            }

        return {
            "category": best_category,
            "problemId": matched_problem_id,
            "confidence": confidence,
            "needs_clarification": False,
            "clarification_message": None
        }

if __name__ == "__main__":
    classifier = RuleClassifier()
    test_queries = [
        "My laptop is connected to Wi-Fi but websites are not opening.",
        "My laptop is extremely hot.",
        "My Chrome keeps closing.",
        "My printer is connected but not printing.",
        "Something weird is happening with my computer."
    ]
    for q in test_queries:
        res = classifier.classify(q)
        print(f"\nQuery: '{q}'")
        print(f" -> Category: {res['category']} | Problem: {res['problemId']} | Conf: {res['confidence']}")
