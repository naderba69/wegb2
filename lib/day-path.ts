import type { DayTask } from "./types";

/** نافذة داخلية محافظة للمسار الأساسي؛ ليست نتيجة دراسة التزام ميدانية. */
export const CORE_PATH_MIN_MINUTES = 45;
export const CORE_PATH_MAX_MINUTES = 90;

const COMMUNICATIVE_KINDS = new Set<DayTask["kind"]>([
  "lesen",
  "hoeren",
  "schreiben",
  "sprechen",
  "aussprache",
  "partner",
  "briefe",
  "schulsim",
]);

/** بيانات قديمة أو fixtures بلا وسم تبقى أساسية كي لا تُخفَّض الالتزامات بأثر رجعي. */
export function isCoreTask(task: DayTask): boolean {
  return task.path !== "deepening";
}

export function corePathMinutes(tasks: readonly DayTask[]): number {
  return tasks.filter(isCoreTask).reduce((sum, task) => sum + task.minutes, 0);
}

export function deepeningMinutes(tasks: readonly DayTask[]): number {
  return tasks.filter((task) => !isCoreTask(task)).reduce((sum, task) => sum + task.minutes, 0);
}

/**
 * يقسم قائمة اليوم من دون حذف مهمة أو تغيير ID أو دقائق أو ترتيب.
 *
 * - التعويض/التحقق الإلزامي والامتحان يبقيان أساسيين دائماً.
 * - يبدأ المسار بالاسترجاع، ثم يدور التركيز اليومي بين القواعد والمفردات
 *   والأداء التواصلي حتى لا يبتلع مجال واحد كل الأيام.
 * - نتوقف عند أول حزمة تقع بين 45 و90 دقيقة. ما بقي تعميق اختياري.
 * - إذا تجاوزت الإلزاميات وحدها السقف، أو كانت مهمة امتحان غير قابلة للتقسيم
 *   أطول منه، نعرض الاستثناء صراحةً بدلاً من تزوير تقدير أصغر.
 *
 * هذه قاعدة عبء داخلية قابلة للاختبار، لا إثبات لملاءمة 45–90 دقيقة ميدانياً.
 */
export function assignDailyPaths(tasks: readonly DayTask[], day: number): DayTask[] {
  if (tasks.length === 0) return [];

  const core = new Set<DayTask>();
  let minutes = 0;
  for (const task of tasks) {
    if (task.mandatory || task.exam) {
      core.add(task);
      minutes += task.minutes;
    }
  }

  const rotation = ((day % 3) + 3) % 3;
  const groupPriority = (task: DayTask): number => {
    if (task.kind === "wiederholen") return 0;
    if (rotation === 0) {
      if (task.kind === "grammatik") return 1;
      if (COMMUNICATIVE_KINDS.has(task.kind)) return 2;
      if (task.kind === "wortschatz") return 3;
    } else if (rotation === 1) {
      if (task.kind === "wortschatz") return 1;
      if (COMMUNICATIVE_KINDS.has(task.kind)) return 2;
      if (task.kind === "grammatik") return 3;
    } else {
      if (COMMUNICATIVE_KINDS.has(task.kind)) return 1;
      if (task.kind === "grammatik") return 2;
      if (task.kind === "wortschatz") return 3;
    }
    if (task.kind === "check") return 4;
    return 5;
  };

  const candidates = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => !core.has(task))
    .sort((a, b) => groupPriority(a.task) - groupPriority(b.task) || a.index - b.index);

  if (minutes < CORE_PATH_MIN_MINUTES) {
    for (const { task } of candidates) {
      if (minutes >= CORE_PATH_MIN_MINUTES) break;
      if (minutes + task.minutes <= CORE_PATH_MAX_MINUTES) {
        core.add(task);
        minutes += task.minutes;
      }
    }
  }

  // املأ أي فجوة باختيار أقصر مهمة تلائم السقف؛ يحمي الأيام ذات البنية غير المعتادة.
  if (minutes < CORE_PATH_MIN_MINUTES) {
    const shortest = [...candidates].sort((a, b) => a.task.minutes - b.task.minutes || a.index - b.index);
    for (const { task } of shortest) {
      if (core.has(task)) continue;
      if (minutes + task.minutes <= CORE_PATH_MAX_MINUTES) {
        core.add(task);
        minutes += task.minutes;
        if (minutes >= CORE_PATH_MIN_MINUTES) break;
      }
    }
  }

  // لا نُخرج يوماً بلا مسار: المهمة الأقصر تصبح استثناءً معلناً إن تعذر السقف تماماً.
  if (core.size === 0) {
    const shortest = tasks.reduce((best, task) => task.minutes < best.minutes ? task : best, tasks[0]);
    core.add(shortest);
  }

  return tasks.map((task) => ({ ...task, path: core.has(task) ? "core" : "deepening" }));
}
