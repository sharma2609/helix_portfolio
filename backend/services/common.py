from config import FILE_ENTRIES


def get_file_groups() -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {"portfolio": [], "career": [], "playground": []}
    for entry in FILE_ENTRIES:
        group = entry.get("group", "portfolio")
        if group in groups:
            groups[group].append(entry["name"])
    return groups
