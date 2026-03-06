import json
import sys
import traceback
import unicodedata
from pathlib import Path

from anki.collection import Collection


def emit(payload):
    print(json.dumps(payload, ensure_ascii=False))


def normalize(text):
    base = unicodedata.normalize("NFKD", str(text or ""))
    return "".join(ch for ch in base if not unicodedata.combining(ch)).lower()


def sanitize_tag(text):
    normalized = normalize(text).replace(" ", "_")
    cleaned = "".join(ch for ch in normalized if ch.isalnum() or ch in {"_", "-"})
    return cleaned.strip("_-") or "studyos"


def choose_model(col):
    models = col.models.all()
    preferred = []
    fallback = []

    for model in models:
        fields = [field.get("name", "") for field in model.get("flds", [])]
        normalized = [normalize(name) for name in fields]
        has_front = any(name in {"front", "frente"} for name in normalized)
        has_back = any(name in {"back", "verso"} for name in normalized)
        if has_front and has_back:
            preferred.append(model)
        if len(fields) >= 2 and model.get("type") == 0:
            fallback.append(model)

    if preferred:
        return preferred[0]
    if fallback:
        return fallback[0]

    current = col.models.current()
    if current and len(current.get("flds", [])) >= 2:
        return current

    raise RuntimeError("ERR_ANKI_NO_BASIC_MODEL")


def choose_fields(model):
    fields = [field.get("name", "") for field in model.get("flds", [])]
    if len(fields) < 2:
        raise RuntimeError("ERR_ANKI_MODEL_WITHOUT_ENOUGH_FIELDS")

    normalized = [normalize(name) for name in fields]
    front = next((fields[index] for index, name in enumerate(normalized) if name in {"front", "frente"}), fields[0])
    back = next((fields[index] for index, name in enumerate(normalized) if name in {"back", "verso"}), fields[1])
    return front, back


def open_collection(path_value):
    return Collection(path_value)


def probe_collection(collection_path):
    col = open_collection(collection_path)
    try:
        current_model = col.models.current()
        emit(
            {
                "ok": True,
                "collectionPath": collection_path,
                "profileName": Path(collection_path).parent.name,
                "noteCount": int(col.db.scalar("select count() from notes") or 0),
                "currentModel": current_model.get("name") if current_model else None,
            }
        )
        return 0
    finally:
        col.close()


def sync_collection(collection_path, cards):
    col = open_collection(collection_path)
    try:
        model = choose_model(col)
        front_field, back_field = choose_fields(model)
        results = []

        for card in cards:
            card_id = str(card.get("cardId", ""))
            try:
                deck_name = str(card.get("deckName", "") or "Default")
                deck_id = col.decks.id(deck_name)
                unique_tag = sanitize_tag(f"studyos_{card_id}")
                found = col.find_notes(f"tag:{unique_tag}")
                if found:
                    results.append({"cardId": card_id, "status": "existing", "noteId": int(found[0])})
                    continue

                note = col.new_note(model)
                note[front_field] = str(card.get("front", ""))
                note[back_field] = str(card.get("back", ""))
                note.tags = ["ita-prep", sanitize_tag(card.get("type", "flashcard")), unique_tag]
                col.add_note(note, deck_id)
                results.append({"cardId": card_id, "status": "added", "noteId": int(note.id)})
            except Exception as card_error:
                results.append({"cardId": card_id, "status": "error", "noteId": None, "error": str(card_error)})

        emit(
            {
                "ok": True,
                "collectionPath": collection_path,
                "profileName": Path(collection_path).parent.name,
                "modelName": model.get("name"),
                "frontField": front_field,
                "backField": back_field,
                "results": results,
            }
        )
        return 0
    finally:
        col.close()


def main():
    if len(sys.argv) != 2:
        emit({"ok": False, "error": "ERR_USAGE", "detail": "expected a payload file path"})
        return 1

    payload_path = Path(sys.argv[1])
    if not payload_path.exists():
        emit({"ok": False, "error": "ERR_PAYLOAD_NOT_FOUND"})
        return 1

    try:
        payload = json.loads(payload_path.read_text(encoding="utf-8"))
        action = payload.get("action")
        collection_path = payload.get("collectionPath")
        if not collection_path:
            emit({"ok": False, "error": "ERR_COLLECTION_PATH_MISSING"})
            return 1

        if action == "probe":
            return probe_collection(str(collection_path))
        if action == "sync":
            return sync_collection(str(collection_path), payload.get("cards", []))

        emit({"ok": False, "error": f"ERR_UNKNOWN_ACTION:{action}"})
        return 1
    except Exception as error:
        emit({"ok": False, "error": str(error), "traceback": traceback.format_exc()})
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
