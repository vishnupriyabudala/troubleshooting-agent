"""
TechAssist AI - Knowledge Base Loader (Phase 1 Python Prototype)
Loads structured troubleshooting trees from data/knowledge_base.json
"""

import json
import os
from typing import Dict, Any, List, Optional

class KnowledgeBase:
    def __init__(self, filepath: Optional[str] = None):
        if filepath is None:
            # Look in standard locations
            candidates = [
                os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json"),
                os.path.join(os.getcwd(), "data", "knowledge_base.json"),
                "/app/applet/data/knowledge_base.json"
            ]
            for candidate in candidates:
                if os.path.exists(candidate):
                    filepath = candidate
                    break
            if not filepath:
                filepath = "data/knowledge_base.json"
        
        self.filepath = filepath
        self.entries: List[Dict[str, Any]] = []
        self.by_id: Dict[str, Dict[str, Any]] = {}
        self.load()

    def load(self) -> None:
        if not os.path.exists(self.filepath):
            print(f"[KB Loader Warning] File not found at {self.filepath}")
            return
        with open(self.filepath, "r", encoding="utf-8") as f:
            self.entries = json.load(f)
            self.by_id = {entry["problemId"]: entry for entry in self.entries}

    def get_by_id(self, problem_id: str) -> Optional[Dict[str, Any]]:
        return self.by_id.get(problem_id)

    def get_by_category(self, category: str) -> List[Dict[str, Any]]:
        category_lower = category.lower()
        return [e for e in self.entries if e.get("category", "").lower() == category_lower]

    def all_entries(self) -> List[Dict[str, Any]]:
        return self.entries

if __name__ == "__main__":
    kb = KnowledgeBase()
    print(f"Loaded {len(kb.all_entries())} troubleshooting entries.")
    for entry in kb.all_entries():
        print(f" - [{entry['category']}] {entry['title']} ({entry['problemId']})")
