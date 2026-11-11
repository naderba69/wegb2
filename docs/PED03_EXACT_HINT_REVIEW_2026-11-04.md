# مراجعة PED-03 — تلميحات الأقواس المطابقة للجواب

التاريخ: 2026-11-04

النطاق: `content/grammar.json` فقط

القرار: إزالة **التسريب الحرفي المؤكد** عندما يساوي كامل محتوى القوس جواباً مقبولاً بعد تطبيع Unicode والحالة والترقيم.

## النتيجة

- قبل الرقعة: **32 تمريناً/تحققاً**، في **34 حقلاً** (`promptDe` ونسختان متطابقتان في `text`).
- بعد الرقعة: **0** تطابق حرفي مؤكد.
- عدد تمارين القواعد لم يتغير، ولم تتغير الإجابات أو الدرجات أو الأنواع.
- لم تُعامل التلميحات الاشتقاقية مثل `(kommen) → komme` كأخطاء آلية؛ تبقى ضمن PED-31 لمراجعة مستوى السقالة.

## القرارات الصريحة

| الإجراء | المعرّفات |
|---|---|
| تحويل الجواب المصرف إلى lemma/وصف صرفي | `a0-begrussung-f4`، `a0-satzbau-v1`، `b1-konj2-vergangenheit-v1`، `b2-k2vht-e2`، `b2-k2vht-e7`، `b2-k2vht-v1` |
| استبدال الجواب بتلميح دلالي/نحوي غير مطابق | `a2-reflexiv-v1`، `b1-pas-e5`، `a1-modalverben-ex04`، `b1-indir-n2`، `b1-indir-n7`، `b2-redew-f2`، `b2-redew-f3`، `b2-redew-f4`، `a2-verb-praep-q2`، `a2-verb-praep-q3`، `a2-verb-praep-v1`، `a1-weil-e2`، `a2-neben-n2`، `a2-neben-n6`، `a2-neben-v2`، `b1-absicht-n2`، `b1-absicht-v1`، `b2-textkonnektoren-n2`، `b2-textkonnektoren-v1`، `b2-nom-e2`، `b2-nom-e8` |
| حذف القوس الزائد لأن خيارات MC أو بنية السؤال توفر المهمة | `a1-imp-n1`، `a2-demo-n1`، `b1-konj2-vergangenheit-n1`، `b1-konj2-vergangenheit-n2`، `b2-textkonnektoren-n6` |

## الحراسة

- الرقعة المحروسة القابلة لإعادة التشغيل: `scripts/patches/fix_exact_answer_hints.py`؛ تقبل القيمة القديمة أو الجديدة فقط وتفشل عند انحراف السجل.
- المصدر النقي للتطبيع والكشف: `lib/exercise-hints.ts`.
- `npm run audit:words` يفشل الآن بنوع `answer-leak-exact` عند رجوع تسريب مؤكد.
- K355a–b تحرسان صفراً من التسريبات وتثبتان أن `(wohnen) → wohne` لا يُدان آلياً.

## حدود القرار

هذا الإغلاق خاص بـPED-03. لا يغلق PED-31/PED-91، ولا يحول كل قوس أو كل مرشح ماسح إلى عيب مؤكد، ولا يغيّر أي حقل `plural` أو بطاقة `die Möbel`.
