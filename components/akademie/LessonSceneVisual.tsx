import type { Level } from "@/lib/types";
import { lessonSceneFor, type LessonSceneKind } from "@/lib/lesson-scene";

interface LessonSceneVisualProps {
  topicId: string;
  titleDe: string;
  level: Level;
}

function SceneGlyph({ kind, variant }: { kind: LessonSceneKind; variant: number }) {
  const nudge = variant * 2;
  switch (kind) {
    case "sound":
      return (
        <g>
          <rect className="lesson-scene-svg__solid" x="140" y="26" width="40" height="48" rx="20" />
          <path className="lesson-scene-svg__line" d="M128 58c0 24 64 24 64 0M160 82v15M143 97h34" />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d={`M112 ${42 - nudge}c-12 10-12 26 0 36M208 ${42 + nudge}c12 10 12 26 0 36M94 30c-24 20-24 48 0 68M226 30c24 20 24 48 0 68`} />
        </g>
      );
    case "time":
      return (
        <g>
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d="M32 82H286" />
          {[58, 108, 158, 208, 258].map((x, index) => <circle key={x} className={index === variant ? "lesson-scene-svg__solid" : "lesson-scene-svg__node"} cx={x} cy="82" r={index === variant ? 8 : 5} />)}
          <circle className="lesson-scene-svg__panel" cx="160" cy="42" r="29" />
          <path className="lesson-scene-svg__line" d={`M160 42V${23 + nudge}M160 42l${17 - nudge} 12`} />
        </g>
      );
    case "route":
      return (
        <g>
          <rect className="lesson-scene-svg__panel" x="24" y="25" width="56" height="62" rx="7" />
          <path className="lesson-scene-svg__line" d="M36 87V48l16-13 16 13v39M46 87V65h13v22" />
          <rect className="lesson-scene-svg__panel" x="242" y="18" width="54" height="69" rx="7" />
          <path className="lesson-scene-svg__line" d="M254 87V39h30v48M261 49h6M275 49h3M261 61h6M275 61h3" />
          <path className="lesson-scene-svg__line lesson-scene-svg__route" d={`M80 76C120 ${24 + nudge},198 ${100 - nudge},242 52`} />
          <path className="lesson-scene-svg__solid" d="M229 43l16 8-14 12z" />
        </g>
      );
    case "question":
      return (
        <g>
          <rect className="lesson-scene-svg__panel" x="36" y="25" width="104" height="55" rx="16" />
          <path className="lesson-scene-svg__panel" d="M112 78l21 14-5-20" />
          <rect className="lesson-scene-svg__panel" x="183" y="36" width="101" height="50" rx="16" />
          <path className="lesson-scene-svg__panel" d="M201 82l-18 13 4-20" />
          <circle className="lesson-scene-svg__solid" cx={88 + nudge} cy="50" r="8" />
          <path className="lesson-scene-svg__line" d={`M83 ${46 + nudge / 2}c1-12 18-12 18 0 0 8-9 7-9 15M92 69h.1`} />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d="M205 53h57M205 67h38" />
        </g>
      );
    case "people":
      return (
        <g>
          <circle className="lesson-scene-svg__panel" cx="76" cy={39 + nudge} r="18" />
          <path className="lesson-scene-svg__panel" d={`M42 94c2-29 66-29 68 0`} />
          <circle className="lesson-scene-svg__panel" cx="244" cy={39 - nudge} r="18" />
          <path className="lesson-scene-svg__panel" d="M210 94c2-29 66-29 68 0" />
          {[128, 152, 176].map((x, index) => <rect key={x} className={index === variant % 3 ? "lesson-scene-svg__solid" : "lesson-scene-svg__node"} x={x} y={37 + index * 13} width="17" height="17" rx="4" />)}
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d="M108 53h20M193 67h17" />
        </g>
      );
    case "transform":
      return (
        <g>
          <rect className="lesson-scene-svg__panel" x="29" y="25" width="104" height="68" rx="10" />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d="M47 44h68M47 59h52M47 74h61" />
          <rect className="lesson-scene-svg__panel" x="189" y="25" width="104" height="68" rx="10" />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d={`M207 ${43 + nudge}h68M207 ${59 + nudge / 2}h43M207 75h61`} />
          <path className="lesson-scene-svg__line" d="M145 59h30M165 49l11 10-11 10" />
        </g>
      );
    case "link":
      return (
        <g>
          <rect className="lesson-scene-svg__panel" x="23" y={43 - nudge} width="72" height="43" rx="9" />
          <rect className="lesson-scene-svg__panel" x="124" y="20" width="72" height="43" rx="9" />
          <rect className="lesson-scene-svg__panel" x="225" y={43 + nudge} width="72" height="43" rx="9" />
          <path className="lesson-scene-svg__line" d={`M95 ${62 - nudge}l29-18M196 44l29 ${18 + nudge}`} />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d={`M39 ${58 - nudge}h40M140 36h40M241 ${58 + nudge}h40M39 ${70 - nudge}h27M140 48h27M241 ${70 + nudge}h27`} />
        </g>
      );
    case "speech":
      return (
        <g>
          <circle className="lesson-scene-svg__panel" cx="68" cy="77" r="18" />
          <circle className="lesson-scene-svg__panel" cx="252" cy="77" r="18" />
          <rect className="lesson-scene-svg__panel" x="35" y={18 + nudge} width="106" height="42" rx="14" />
          <path className="lesson-scene-svg__panel" d={`M67 ${58 + nudge}l-4 15 20-15`} />
          <rect className="lesson-scene-svg__panel" x="179" y={14 - nudge} width="106" height="42" rx="14" />
          <path className="lesson-scene-svg__panel" d={`M245 ${54 - nudge}l5 16-21-16`} />
          <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d={`M52 ${35 + nudge}h71M195 ${31 - nudge}h73M52 ${47 + nudge}h46M195 ${43 - nudge}h51`} />
        </g>
      );
    default:
      return (
        <g>
          {[38, 101, 164, 227].map((x, index) => (
            <g key={x} transform={`translate(0 ${index % 2 === variant % 2 ? nudge : -nudge})`}>
              <rect className={index === variant % 4 ? "lesson-scene-svg__solid" : "lesson-scene-svg__panel"} x={x} y={32 + (index % 2) * 20} width="48" height="48" rx="10" />
              <path className="lesson-scene-svg__line lesson-scene-svg__line--soft" d={`M${x + 11} ${49 + (index % 2) * 20}h26M${x + 11} ${62 + (index % 2) * 20}h18`} />
            </g>
          ))}
          <path className="lesson-scene-svg__line" d="M86 57h15M149 72h15M212 57h15" />
        </g>
      );
  }
}

export function LessonSceneVisual({ topicId, titleDe, level }: LessonSceneVisualProps) {
  const scene = lessonSceneFor(topicId, titleDe, level);
  const titleId = `lesson-scene-title-${topicId.replace(/[^a-z0-9-]/gi, "-")}`;
  return (
    <figure
      className="lesson-scene-visual"
      data-testid="wizard-scene-visual"
      data-scene-kind={scene.kind}
      data-scene-signature={scene.signature}
      data-level={level}
    >
      <div className="lesson-scene-visual__frame">
        <svg viewBox="0 0 320 112" role="img" aria-labelledby={titleId} preserveAspectRatio="xMidYMid meet">
          <title id={titleId}>{scene.altAr}</title>
          <rect className="lesson-scene-svg__background" x="1" y="1" width="318" height="110" rx="16" />
          {scene.markers.map((marker, index) => (
            <circle key={`${marker.x}-${marker.y}-${index}`} className="lesson-scene-svg__marker" cx={marker.x} cy={marker.y} r={marker.size} />
          ))}
          <SceneGlyph kind={scene.kind} variant={scene.variant} />
        </svg>
      </div>
      <figcaption>
        <span>مشهد القاعدة</span>
        <strong>{scene.labelAr}</strong>
      </figcaption>
    </figure>
  );
}
