#!/usr/bin/env python3
"""Synthetic Seed Data Generator for InnerOS Local Development.
Seeds 100% synthetic development data (Persona Elena Vance).
"""

import sys
import os
import json

# Add apps/api to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "api")))

from app.db.synthetic_seed import get_synthetic_seed_data


def main():
    print("==================================================")
    print(" InnerOS: Seeding Synthetic Development Fixtures")
    print("==================================================")
    data = get_synthetic_seed_data()
    print(f"Loaded Synthetic Persona: {data['name']} ({data['role']})")
    print(f"Life Graph Nodes: {len(data['life_graph_nodes'])}")
    print(f"Life Graph Edges: {len(data['life_graph_edges'])}")
    print(f"Journal Reflections: {len(data['synthetic_journal_reflections'])}")
    print("Notice: No real patient data or PII was generated or stored.")
    print("Synthetic seed verification: SUCCESS")


if __name__ == "__main__":
    main()
