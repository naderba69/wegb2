import re

content = open("components/akademie/Klassenzimmer.tsx", "r", encoding="utf-8").read()

# 1. إضافة imports اللازمة لـ SRS و addFehlerNow
if "newCard" not in content:
    content = content.replace(
        'import { De } from "@/components/De";',
        'import { De } from "@/components/De";\nimport { newCard, reviewCard } from "@/lib/srs";\nimport { addFehlerNow } from "@/lib/store";'
    )

open("components/akademie/Klassenzimmer.tsx", "w", encoding="utf-8").write(content)
print("Updated Klassenzimmer imports successfully.")
