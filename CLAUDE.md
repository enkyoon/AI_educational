# AI 강의사이트 — 작업 전에 읽을 것

여러 과목의 강의자료(HTML)를 모아 둔 사이트입니다. 페이지를 만들거나 고치기 전에 아래 순서로 문서를 읽습니다.

1. **공통 규칙** `MD/skill.md` — 모든 과목에 해당하는 규칙(수강생 전제 · 페이지 뼈대 · UI 패턴 · 글쓰기 원칙 · 커밋 규칙).
2. **과목 스킬** — 고치는 폴더에 맞는 파일을 이어서 읽습니다. 공통 규칙과 다르면 과목 파일이 우선합니다.

| 고치는 곳 | 과목 | 읽을 과목 파일 |
|---|---|---|
| `html/vibecoding/` | 바이브코딩 | `MD/skills/vibecoding.md` |
| `html/prompt-eng-1/` | AI 프롬프트 엔지니어링 1 | `MD/skills/prompt-eng-1.md` |
| `html/prompt-eng-2/` | AI 프롬프트 엔지니어링 2 | `MD/skills/prompt-eng-2.md` |
| `html/ai-agent/` | AI 에이전트 | `MD/skills/ai-agent.md` |
| `html/ai-office/` | AI 오피스실무 | `MD/skills/ai-office.md` |
| `html/ai-content/` | AI 스마트스튜디오 | `MD/skills/ai-content.md` |
| `html/math-academy/` | 수학학원 AI 활용 특강 | `MD/skills/math-academy.md` |
| `html/intro/`, `index.html`, `css/`, `js/` | 공통 | 과목 파일 없음 (`MD/skill.md`만) |

3. **커리큘럼을 새로 기획할 때**는 `MD/curriculum-planning.md`도 읽습니다.

## 결정을 기록하는 곳

- 사용자가 새로 확정한 내용은 대화 기억에만 두지 말고 문서에 적습니다.
  - 한 과목에만 해당 → 그 과목 파일(`MD/skills/<폴더>.md`)의 알맞은 절과 끝의 결정 기록
  - 모든 과목에 해당 → `MD/skill.md`의 알맞은 절과 11절 결정 기록
- 한 과목에서 정한 내용을 다른 과목에 일괄 복제하지 않습니다.
- 새 과목을 만들면 `MD/skills/<폴더>.md`를 같은 모양으로 만들고, 이 표와 `MD/skill.md` 2절 표에 한 줄씩 추가합니다.

## 다 고친 뒤

- 바뀐 부분을 다시 읽고 `MD/skill.md` 6절 "AI 티 나는 표현 피하기" 기준으로 끊긴 표현 · 평소 안 쓰는 어휘를 고칩니다.
- 커밋은 사용자가 요청할 때만, 방법은 `MD/skill.md` 10절(버전 태그 `verX.YY` 포함, 커밋하면 푸시까지).
