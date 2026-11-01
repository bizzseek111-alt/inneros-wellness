"""Memory domain and consent tests."""

def test_list_and_add_memory(client):
    # 1. List initial synthetic memories
    response = client.get("/api/v1/memory/items")
    assert response.status_code == 200
    initial_items = response.json()
    assert len(initial_items) >= 2

    # 2. Add a new memory item
    create_res = client.post(
        "/api/v1/memory/items",
        json={
            "category": "habit",
            "fact_text": "Drinks herbal chamomile tea before sleep.",
            "emotional_valence": "positive",
            "tags": ["evening", "tea"],
        },
    )
    assert create_res.status_code == 201
    new_item = create_res.json()
    new_id = new_item["id"]
    assert new_item["fact_text"] == "Drinks herbal chamomile tea before sleep."

    # 3. Test GDPR Article 17 "Forget Me" deletion
    del_res = client.delete(f"/api/v1/memory/items/{new_id}")
    assert del_res.status_code == 204

    # 4. Confirm deleted
    after_del = client.get("/api/v1/memory/items")
    ids = [item["id"] for item in after_del.json()]
    assert new_id not in ids
