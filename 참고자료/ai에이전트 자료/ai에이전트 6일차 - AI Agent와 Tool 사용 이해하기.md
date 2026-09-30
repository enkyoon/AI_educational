# DAY 06
# AI Agent와 Tool 사용 이해하기

## 오늘의 학습 목표

DAY 05에서는 Gemini가 고객 문의를 분석하고, IF와 Switch를 이용해 상황에 따라 서로 다른 Workflow가 실행되도록 만들었습니다.

하지만 지금까지는 **사람이 모든 실행 경로를 미리 설계했습니다.**

예를 들어 다음과 같습니다.

```text
환불문의
→ 환불 담당자에게 이메일

결제문의
→ 결제 담당자에게 이메일

수업문의
→ 교육 담당자에게 이메일
```

오늘은 여기에서 한 단계 더 발전합니다.

사용자가 자연어로 요청하면 AI가 요청을 이해하고,

**어떤 기능이 필요한지 판단한 뒤**

**필요한 Tool을 선택하여 실행하는 AI Agent**를 만들어봅니다.

오늘 수업이 끝나면 다음 내용을 이해할 수 있습니다.

- 일반 AI Workflow와 AI Agent의 차이
- AI Agent의 기본 구조
- Chat Model의 역할
- Tool의 역할
- Prompt와 System Message의 역할
- Memory의 기본 개념
- Chat Trigger를 이용한 대화형 Agent 구성
- Gemini를 AI Agent의 Chat Model로 연결
- Agent에게 Tool을 연결하는 방법
- Google Sheets를 조회하는 Agent 제작
- Agent가 상황에 따라 Tool을 선택하는 원리
- Gmail과 같은 실행형 Tool 사용 시 주의점
- Agent의 잘못된 Tool 선택을 수정하는 방법
- Tool 이름과 설명이 중요한 이유
- AI Agent를 테스트하고 검증하는 방법

---

# 1교시
# AI Workflow에서 AI Agent로 발전하기

## 01. DAY 05까지의 Workflow

지금까지 만든 Workflow를 다시 살펴봅니다.

```text
고객 문의
    ↓
Gemini
    ↓
category 생성
    ↓
Switch
 ↙  ↓  ↓  ↘
수업 결제 환불 기타
 ↓    ↓    ↓    ↓
각각 정해진 작업
```

Gemini가 문의의 의미를 판단했지만,

실제로 어떤 행동을 할지는 **사람이 미리 Switch로 정했습니다.**

---

# 02. 정해진 Workflow

다음 요청이 들어왔다고 가정합니다.

> 등록된 고객 정보를 찾아줘.

기존 Workflow에서는 이를 처리하기 위한 경로를 미리 만들어야 합니다.

```text
사용자 요청
    ↓
요청 분류
    ↓
고객 조회 요청인가?
    ↓
YES
    ↓
Google Sheets 조회
```

이번에는 다음 요청이 들어옵니다.

> 고객 정보를 등록해줘.

그러면 또 다른 경로가 필요합니다.

```text
사용자 요청
    ↓
요청 분류
    ↓
등록 요청인가?
    ↓
YES
    ↓
Google Sheets 기록
```

기능이 많아질수록 사람이 만들어야 하는 조건도 많아집니다.

---

# 03. AI Agent의 접근 방식

AI Agent에서는 사용할 수 있는 기능을 **Tool**로 제공합니다.

예:

```text
Google Sheets 조회 Tool

Google Sheets 기록 Tool

Gmail Tool
```

그리고 사용자가 자연어로 요청합니다.

```text
김민지 고객의 정보를 찾아줘.
```

Agent는 요청을 이해하고

```text
고객 정보를 찾으려면
Google Sheets 조회 Tool이 필요하다.
```

라고 판단한 뒤 해당 Tool을 사용합니다.

---

# 04. 또 다른 요청

사용자가 다음과 같이 말합니다.

```text
박하늘 고객에게
오늘 상담이 오후 3시라고 이메일 보내줘.
```

Agent에게 다음 Tool이 있다고 가정합니다.

```text
Google Sheets 조회

Google Sheets 기록

Gmail 발송
```

Agent는 요청을 보고

```text
이메일을 보내야 한다.
```

라고 판단하여 Gmail Tool을 선택할 수 있습니다.

즉, Workflow의 모든 경로를 사람이 직접 Switch로 연결하지 않아도 **Agent가 현재 요청에 적합한 Tool을 선택할 수 있습니다.**

n8n의 현재 AI Agent Node는 Chat Model과 하나 이상의 Tool을 연결하여 사용하며, Agent가 작업을 완료하기 위해 어떤 Tool을 호출할지 판단하도록 설계되어 있습니다.

---

# 05. Workflow와 Agent 비교

## 일반 Workflow

```text
입력
 ↓
A
 ↓
B
 ↓
C
 ↓
결과
```

실행 순서가 미리 정해져 있습니다.

---

## 조건 Workflow

```text
입력
 ↓
판단
↙  ↘
A    B
```

사람이 조건과 경로를 미리 설계합니다.

---

## AI Agent

```text
        ┌→ Tool A
        │
사용자 → Agent ─→ Tool B
        │
        └→ Tool C
```

Agent가 요청을 이해하고 사용할 Tool을 결정합니다.

---

# 06. Agent라고 해서 모든 것을 자유롭게 할 수 있는 것은 아니다

Agent가 사용할 수 있는 기능은 **우리가 연결해준 Tool의 범위 안에서 결정됩니다.**

예를 들어 다음 Tool만 연결되어 있다면

```text
Google Sheets 조회

Gmail 발송
```

Agent가 갑자기

```text
카카오톡 메시지 발송
```

을 직접 실행할 수는 없습니다.

해당 기능을 수행할 Tool이 없기 때문입니다.

---

# 07. AI Agent의 기본 구성요소

AI Agent를 다음과 같이 나누어 생각할 수 있습니다.

```text
사용자 요청
     ↓
   Agent
 ┌───┼────┐
Model Prompt Tools
       +
     Memory
```

오늘은 다음 네 가지 개념을 중심으로 이해합니다.

### Model

생각하고 판단하는 AI

### Prompt

역할과 행동 규칙

### Tool

실제 정보를 조회하거나 행동하는 기능

### Memory

이전 대화 내용을 기억하는 기능

---

# 08. Model

Model은 Agent의 **두뇌** 역할을 합니다.

이번 과정에서는 Gemini를 사용합니다.

구조:

```text
AI Agent
   ↓
Google Gemini Chat Model
```

n8n은 AI Agent와 연결할 수 있는 **Google Gemini Chat Model** Node를 제공하며, 사용 가능한 Gemini 모델은 연결된 계정에 따라 동적으로 표시됩니다.

---

# 09. Tool

Tool은 Agent가 실제 작업을 수행하기 위해 사용할 수 있는 기능입니다.

예:

```text
Google Sheets 조회
```

```text
Google Sheets 기록
```

```text
Gmail 발송
```

```text
Calculator
```

```text
다른 Workflow 실행
```

쉽게 표현하면

**Model = 생각**

**Tool = 행동**

이라고 볼 수 있습니다.

---

# 10. Prompt

Prompt는 Agent의 역할과 행동 규칙을 정의합니다.

예:

```text
당신은 교육기관의 고객 관리 AI Agent입니다.

사용자의 요청을 이해하고
필요한 Tool을 선택하여 작업하세요.

확인할 수 없는 정보는 추측하지 마세요.
```

Agent가 Tool을 사용할 수 있다고 해서 항상 올바르게 행동하는 것은 아닙니다.

따라서 **Agent의 역할과 행동 범위를 명확하게 지정하는 것**이 중요합니다.

---

# 11. Memory

Memory는 이전 대화의 정보를 다음 대화에서도 활용할 수 있게 하는 기능입니다.

예:

### 첫 번째 질문

```text
내 이름은 김민지야.
```

### 두 번째 질문

```text
내 이름이 뭐였지?
```

Memory가 없다면 두 번째 질문만 보고 답해야 할 수 있습니다.

Memory가 있다면 이전 대화 정보를 활용할 수 있습니다.

n8n의 Chat Trigger는 이전 세션을 불러오도록 설정할 수 있으며, 이 경우 Agent와 Chat Trigger가 동일한 Memory Sub-node를 사용하도록 구성할 수 있습니다.

오늘은 Agent 구조를 이해하는 것이 우선이며, Memory는 기본 개념과 간단한 연결 정도로 다룹니다.

---

# 12. AI Workflow와 AI Agent의 가장 중요한 차이

## AI Workflow

AI가 정해진 위치에서 하나의 작업을 수행합니다.

```text
입력
 ↓
Gemini 요약
 ↓
Google Sheets
```

Gemini의 역할:

```text
요약
```

이미 정해져 있습니다.

---

## AI Agent

사용자의 요청을 먼저 이해합니다.

```text
사용자 요청
 ↓
Agent
 ↓
무엇을 해야 하지?
 ↓
필요한 Tool 선택
 ↓
실행
```

Agent의 핵심은 **AI가 Tool을 선택할 수 있다는 것**입니다.

---

# 13. Agent에게 Tool이 없다면?

사용자:

```text
Google Sheets에서 김민지 고객을 찾아줘.
```

Agent에게 Gemini만 있고 Tool이 없다면

AI는 고객 Sheet를 직접 확인할 수 없습니다.

Gemini 자체가 나의 Google Sheets 내용을 자동으로 알고 있는 것은 아닙니다.

Agent에게 실제 데이터에 접근할 수 있는 Tool이 필요합니다.

---

# 14. Tool을 연결하면

```text
사용자
   ↓
AI Agent
   ↓
Google Sheets Tool
   ↓
실제 데이터 조회
   ↓
AI Agent
   ↓
사용자에게 결과 설명
```

이제 AI가 단순히 문장을 생성하는 것을 넘어 **외부 시스템의 정보를 이용할 수 있습니다.**

---

# 실습 01
# 오늘 사용할 데이터 준비하기

Google Sheets에 다음과 같은 고객 데이터를 준비합니다.

Sheet 이름:

```text
customers
```

| name | email | course | status |
|---|---|---|---|
| 김민지 | minji@example.com | AI Agent | 신청완료 |
| 박하늘 | haneul@example.com | Vibe Coding | 상담중 |
| 이준호 | junho@example.com | AI Agent | 결제대기 |

실습에서는 개인정보 대신 가상의 데이터를 사용합니다.

---

# 15. Chat Trigger

지금까지는 주로 Manual Trigger를 사용했습니다.

오늘은 사용자가 자연어로 요청하는 형태를 만들기 위해 **Chat Trigger**를 사용합니다.

기본 구조:

```text
Chat Trigger
     ↓
 AI Agent
```

Chat Trigger는 챗봇이나 대화형 AI Workflow를 만들 때 사용할 수 있으며 Agent 또는 Chain Root Node와 연결합니다.

---

# 16. Chat Trigger에서 입력하기

예:

```text
김민지 고객 정보를 알려줘.
```

↓

```text
Chat Trigger
```

↓

```text
AI Agent
```

Chat Trigger가 사용자의 자연어 요청을 Agent에게 전달합니다.

---

# 17. AI Agent Node 추가하기

기본 구조를 만듭니다.

```text
Chat Trigger
     ↓
 AI Agent
```

아직 Agent는 완성되지 않았습니다.

Agent가 생각할 수 있도록 Chat Model을 연결해야 합니다.

---

# 18. Google Gemini Chat Model 연결

AI Agent에 Google Gemini Chat Model을 연결합니다.

구조:

```text
Chat Trigger
     ↓
 AI Agent
     │
     └── Google Gemini Chat Model
```

Google Gemini Chat Model은 일반 Workflow의 다음 Node가 아니라 **AI Agent가 판단할 때 사용하는 Model**입니다.

---

# 19. 일반 Node 연결과 AI 연결의 차이

지금까지는 주로 다음처럼 연결했습니다.

```text
Node A
 ↓
Node B
 ↓
Node C
```

하지만 AI Agent에서는 구조가 조금 다릅니다.

```text
Chat Trigger
     ↓
 AI Agent
   ├─ Model
   ├─ Tool
   └─ Memory
```

Model, Tool, Memory는 Agent의 기능을 확장하는 요소입니다.

---

# 20. 현재 n8n의 AI Agent

오래된 n8n 영상이나 자료에서는 AI Agent를 만들 때 `Agent Type`에서 Tools Agent 등을 선택하는 화면이 나올 수 있습니다.

현재 n8n에서는 이 Agent Type 설정이 더 이상 새로운 AI Agent Node의 핵심 설정이 아니며, 최신 AI Agent는 Tool을 사용하는 Agent 방식으로 동작합니다. 오래된 화면과 현재 화면이 다를 수 있습니다.

따라서 특정 화면 위치를 외우기보다 다음 구조를 기억합니다.

```text
AI Agent
+
Chat Model
+
Tool
```

---

# 실습 02
# Tool 없이 요청을 생각해보기

Agent에게 다음 요청을 한다고 가정합니다.

```text
김민지 고객의 신청 상태를 알려줘.
```

질문:

### Agent가 알아야 하는 정보는 무엇인가?

```text
김민지 고객의 데이터
```

### Gemini가 이 정보를 원래 알고 있는가?

```text
아니오
```

### 무엇이 필요한가?

```text
Google Sheets의 고객 데이터를 조회하는 Tool
```

Tool이 필요한 이유를 먼저 이해한 뒤 연결합니다.

---

# 10분 휴식

---

# 2교시
# Tool을 사용하는 AI Agent 만들기

## 21. 첫 번째 Tool 연결

오늘 첫 Tool은 Google Sheets입니다.

목표:

```text
사용자
"김민지 고객 정보를 찾아줘."
        ↓
    AI Agent
        ↓
Google Sheets Tool
        ↓
    고객 검색
        ↓
    결과 반환
        ↓
    AI Agent
        ↓
사용자에게 설명
```

Google Sheets 자체는 Row 조회, 추가, 수정 등의 다양한 작업을 지원합니다.

---

# 22. Tool과 일반 Node의 차이

일반 Workflow에서는 Google Sheets가 정해진 순서에 있습니다.

```text
Trigger
 ↓
Google Sheets
 ↓
Gmail
```

따라서 Workflow가 실행되면 Google Sheets가 실행됩니다.

---

Agent Tool 구조에서는 다릅니다.

```text
             ┌→ Google Sheets Tool
사용자 → Agent
             └→ 다른 Tool
```

Google Sheets가 항상 실행되는 것이 아니라 **Agent가 필요하다고 판단했을 때 사용합니다.**

---

# 23. Tool 설명이 중요하다

Agent는 Tool의 역할을 이해해야 적절한 Tool을 선택할 수 있습니다.

예를 들어 다음 Tool이 있다고 가정합니다.

### Tool A

```text
Tool 1
```

### Tool B

```text
Tool 2
```

이름만 보면 어떤 기능인지 알기 어렵습니다.

---

다음처럼 역할을 명확히 표현하면 이해하기 쉽습니다.

```text
고객정보조회
```

```text
고객정보등록
```

```text
고객이메일발송
```

Tool의 역할이 명확할수록 Agent가 언제 사용해야 하는지 판단하기 쉬워집니다.

---

# 실습 03
# 고객 조회 Tool 만들기

Google Sheets의 `customers` Sheet를 사용합니다.

Tool의 목적:

> 등록된 고객 정보를 조회한다.

조회 대상 데이터:

```text
name
email
course
status
```

Agent가 고객 정보가 필요한 경우 이 Tool을 사용할 수 있도록 연결합니다.

---

# 24. Agent의 System Message 작성하기

Agent의 역할을 명확하게 정의합니다.

예:

```text
당신은 교육기관의 고객 관리 AI Agent입니다.

사용자의 요청을 이해하고 필요한 Tool을 사용하세요.

고객 정보가 필요한 경우
고객정보조회 Tool을 사용하세요.

Sheet에서 확인되지 않은 고객 정보는
임의로 만들거나 추측하지 마세요.

확인된 결과만 사용자에게 간단하게 설명하세요.
```

---

# 25. 첫 번째 Agent 테스트

질문:

```text
김민지 고객 정보를 알려줘.
```

Agent가 다음 과정을 수행하는지 확인합니다.

```text
사용자 요청 이해
      ↓
고객 정보가 필요함
      ↓
고객정보조회 Tool 선택
      ↓
Google Sheets 조회
      ↓
결과 확인
      ↓
사용자에게 답변
```

---

# 26. Tool을 사용하지 않아도 되는 질문

다음 질문을 입력합니다.

```text
안녕하세요.
```

Agent는 고객 Sheet를 조회할 필요가 없습니다.

이상적인 흐름:

```text
안녕하세요.
 ↓
Agent 판단
 ↓
Tool 필요 없음
 ↓
바로 답변
```

Agent는 모든 질문에서 무조건 Tool을 사용할 필요가 없습니다.

---

# 실습 04
# Tool 사용 여부 비교하기

다음 질문을 각각 테스트합니다.

### 질문 01

```text
안녕하세요.
```

### 질문 02

```text
김민지 고객의 상태를 알려줘.
```

### 질문 03

```text
AI Agent가 무엇인지 간단히 설명해줘.
```

### 질문 04

```text
박하늘 고객의 신청 과정이 무엇인지 확인해줘.
```

각 질문에서 Tool이 실행되었는지 확인합니다.

---

# 27. Agent 실행 과정을 확인하기

결과만 보지 않고 실행 과정을 살펴봅니다.

확인할 내용:

```text
사용자 입력
```

↓

```text
Agent
```

↓

```text
어떤 Tool을 사용했는가?
```

↓

```text
Tool에 어떤 값이 전달되었는가?
```

↓

```text
Tool은 어떤 결과를 반환했는가?
```

↓

```text
Agent는 최종적으로 무엇이라고 답했는가?
```

AI Agent 문제를 해결할 때 이 순서가 매우 중요합니다.

---

# 28. Tool 하나만 있으면 선택이 어렵지 않다

현재 Agent에는 Tool이 하나뿐입니다.

```text
고객정보조회
```

Agent가 선택할 수 있는 행동이 많지 않습니다.

이제 Tool을 하나 더 추가합니다.

---

# 29. 두 번째 Tool

다음 기능을 추가합니다.

```text
고객정보등록
```

목적:

> 새로운 고객 정보를 Google Sheets에 기록한다.

이제 Agent에게 두 가지 능력이 생깁니다.

```text
고객 조회
```

또는

```text
고객 등록
```

---

# 30. 같은 Google Sheets라도 Tool의 역할은 다르다

### Tool A

```text
고객정보조회
```

역할:

```text
기존 고객 찾기
```

### Tool B

```text
고객정보등록
```

역할:

```text
새로운 고객 추가
```

동일한 Google Sheets를 사용하더라도 작업 목적이 다르면 별도의 Tool로 생각할 수 있습니다.

---

# 실습 05
# 조회와 등록을 구분하는 Agent

테스트 01:

```text
김민지 고객 정보를 확인해줘.
```

예상 Tool:

```text
고객정보조회
```

---

테스트 02:

```text
최유진 고객을 등록해줘.

이메일은 yujin@example.com이고
과정은 AI Agent,
상태는 상담중이야.
```

예상 Tool:

```text
고객정보등록
```

---

# 31. Agent가 어떤 Tool을 선택했는지 확인하기

두 요청은 비슷한 고객 정보와 관련되어 있지만 행동은 다릅니다.

```text
찾아줘
→ 조회
```

```text
등록해줘
→ 추가
```

Agent는 사용자의 자연어에서 **의도 Intent**를 이해하고 적절한 Tool을 선택해야 합니다.

---

# 32. Tool이 많아질수록 설명이 중요하다

다음 Tool이 있다고 가정합니다.

```text
고객조회
고객등록
고객수정
고객삭제
이메일발송
```

기능이 많아질수록 Tool 사이의 차이가 분명해야 합니다.

Tool 설명이 모호하면 Agent가 잘못된 기능을 선택할 가능성이 커집니다.

---

# 33. Tool 이름 작성하기

좋지 않은 예:

```text
GoogleSheet1
GoogleSheet2
GoogleSheet3
```

기능을 알기 어렵습니다.

---

개선된 예:

```text
고객정보조회

고객정보등록

고객상태수정
```

Tool 이름만 보고도 목적을 알 수 있도록 작성합니다.

---

# 34. Tool 설명 작성하기

예:

### 고객정보조회

```text
Google Sheets에서 기존 고객 정보를 조회할 때 사용합니다.
고객 이름을 기준으로 검색합니다.
새로운 고객을 등록할 때는 사용하지 않습니다.
```

### 고객정보등록

```text
새로운 고객 정보를 Google Sheets에 추가할 때 사용합니다.
기존 고객의 정보를 조회할 때는 사용하지 않습니다.
```

역할과 사용 시점을 구체적으로 설명합니다.

---

# 35. Agent에게 Gmail Tool 추가하기

다음으로 이메일 발송 기능을 추가합니다.

구조:

```text
                 ┌→ 고객정보조회
                 │
사용자 → AI Agent ├→ 고객정보등록
                 │
                 └→ Gmail 발송
```

이제 Agent는 요청에 따라 세 가지 Tool 중 필요한 것을 선택할 수 있습니다.

---

# 36. 이메일 Tool 사용 시 주의하기

Google Sheets 조회는 정보를 읽는 작업입니다.

하지만 Gmail 발송은 실제 외부 행동입니다.

```text
조회
→ 정보를 확인
```

```text
이메일 발송
→ 실제 상대방에게 메시지를 전달
```

따라서 실행형 Tool은 테스트할 때 더 주의해야 합니다.

실습에서는 **받는 사람을 자신의 테스트 이메일 주소로 제한**하고 실제 고객에게 자동 발송하지 않습니다.

n8n의 Gmail 기능은 이메일 발송을 지원하며, AI Tool Call에 사람의 검토 단계를 포함하는 구성도 지원합니다.

---

# 37. Agent에게 모든 권한을 주지 않기

AI Agent가 편리하다고 해서 가능한 모든 기능을 연결하는 것이 항상 좋은 것은 아닙니다.

예를 들어 다음 기능은 신중해야 합니다.

```text
데이터 삭제
```

```text
결제 실행
```

```text
외부 이메일 대량 발송
```

```text
중요 데이터 수정
```

Agent가 실수했을 때 실제 결과가 발생할 수 있기 때문입니다.

---

# 38. Tool의 위험도 생각하기

## 낮은 위험

```text
데이터 조회
```

```text
계산
```

```text
정보 검색
```

---

## 중간 위험

```text
Google Sheets에 새로운 데이터 추가
```

```text
초안 생성
```

---

## 높은 위험

```text
이메일 발송
```

```text
데이터 삭제
```

```text
금전 관련 작업
```

```text
외부 공개
```

실제 Agent를 설계할 때는 **AI에게 어느 수준까지 자동 실행을 허용할지** 결정해야 합니다.

---

# 39. 사람의 확인을 넣는 구조

중요한 행동은 다음처럼 구성할 수 있습니다.

```text
Agent
 ↓
이메일 작성
 ↓
사람 확인
 ↓
승인
 ↓
실제 발송
```

AI Agent를 만든다는 것은 모든 업무에서 사람을 제거한다는 의미가 아닙니다.

필요한 지점에서는 사람이 검토하도록 설계할 수 있습니다.

---

# 실습 06
# 이메일 발송 Agent

목표:

사용자가 다음과 같이 요청합니다.

```text
내 테스트 이메일로
"AI Agent 테스트가 완료되었습니다."
라고 보내줘.
```

Agent가 Gmail Tool을 사용하여 자신의 테스트 계정으로 이메일을 보내도록 구성합니다.

---

# 40. Gmail Tool의 역할 설명

Tool 이름:

```text
테스트이메일발송
```

설명 예:

```text
테스트 이메일을 발송할 때 사용합니다.

실습에서는 지정된 테스트 이메일 주소로만 발송합니다.

사용자가 이메일 발송을 요청하지 않았다면
이 Tool을 사용하지 않습니다.
```

---

# 실습 07
# Tool 선택 테스트

Agent에게 세 가지 Tool이 연결되어 있다고 가정합니다.

```text
고객정보조회

고객정보등록

테스트이메일발송
```

다음 요청을 테스트합니다.

### Case 01

```text
김민지 고객 정보를 확인해줘.
```

예상:

```text
고객정보조회
```

---

### Case 02

```text
정우진 고객을 새로 등록해줘.
```

예상:

```text
고객정보등록
```

---

### Case 03

```text
테스트 이메일로
오늘 실습 완료라고 보내줘.
```

예상:

```text
테스트이메일발송
```

---

### Case 04

```text
AI Agent와 일반 Workflow의 차이를 설명해줘.
```

예상:

```text
Tool 사용 없이 답변
```

---

# 41. 여러 Tool을 연속해서 사용할 수도 있다

사용자의 요청이 하나의 Tool만으로 해결되지 않을 수도 있습니다.

예:

```text
김민지 고객의 이메일 주소를 찾아서
테스트 안내 메일을 보내줘.
```

필요한 작업:

```text
① 고객 정보 조회
```

↓

```text
② 이메일 주소 확인
```

↓

```text
③ Gmail 발송
```

Agent가 여러 Tool을 순서대로 사용할 수도 있습니다.

---

# 42. Agent의 행동을 Flow로 표현하기

```text
사용자 요청
      ↓
  요청 이해
      ↓
고객 정보 필요
      ↓
고객정보조회 Tool
      ↓
이메일 주소 확인
      ↓
이메일 발송 필요
      ↓
Gmail Tool
      ↓
최종 결과 안내
```

이 구조는 DAY 07의 User Flow 기획에서도 다시 사용합니다.

---

# 실습 08
# 조회 후 이메일 보내기

사용자 요청:

```text
김민지 고객 정보를 확인하고
테스트 안내 메일을 보내줘.
```

실행 후 확인합니다.

### ① 고객정보조회 Tool이 실행되었는가?

### ② 조회된 이메일 주소는 무엇인가?

### ③ Gmail Tool이 실행되었는가?

### ④ 이메일 내용은 요청과 일치하는가?

### ⑤ Agent의 최종 답변은 실제 실행 결과와 일치하는가?

---

# 43. Agent가 잘못된 Tool을 선택한다면?

예:

사용자:

```text
김민지 고객 정보를 조회해줘.
```

그런데 Agent가

```text
고객정보등록
```

Tool을 사용했습니다.

바로 Agent를 새로 만들 필요는 없습니다.

먼저 Tool 설명과 Prompt를 확인합니다.

---

# 44. 문제 해결 순서

### STEP 01

사용자의 요청 확인

```text
무엇을 요청했는가?
```

### STEP 02

Agent가 선택한 Tool 확인

```text
어떤 Tool을 사용했는가?
```

### STEP 03

각 Tool 이름 확인

```text
역할이 명확한가?
```

### STEP 04

Tool Description 확인

```text
언제 사용하는 Tool인지 설명되어 있는가?
```

### STEP 05

Agent System Message 확인

```text
행동 규칙이 명확한가?
```

### STEP 06

다시 테스트

---

# 45. Tool Description도 Prompt의 일부라고 생각하기

Agent에게 다음 Tool 두 개가 있다고 가정합니다.

### A

```text
Google Sheets
```

### B

```text
Google Sheets2
```

Agent에게는 차이가 명확하지 않습니다.

---

다음처럼 작성합니다.

### A

```text
고객정보조회
```

설명:

```text
기존 고객의 이름, 이메일, 과정, 상태를
조회할 때 사용합니다.
```

### B

```text
고객정보등록
```

설명:

```text
새로운 고객을 Google Sheets에
추가할 때만 사용합니다.
```

Agent가 Tool을 올바르게 선택할 가능성을 높일 수 있습니다.

---

# 46. System Message 개선하기

기본:

```text
당신은 고객 관리 Agent입니다.
```

보다 다음과 같이 구체적으로 작성할 수 있습니다.

```text
당신은 교육기관의 고객 관리 AI Agent입니다.

사용자의 요청을 이해하고
필요한 경우 연결된 Tool을 사용하세요.

기존 고객 정보를 확인할 때는
고객정보조회 Tool을 사용하세요.

새로운 고객을 등록할 때는
고객정보등록 Tool을 사용하세요.

이메일 발송 요청이 있을 때만
테스트이메일발송 Tool을 사용하세요.

Sheet에 없는 정보를 임의로 만들지 마세요.

실행하지 않은 작업을
실행했다고 말하지 마세요.

Tool 실행 결과를 확인한 뒤
사용자에게 간단하게 결과를 알려주세요.
```

---

# 47. AI Agent의 중요한 규칙

AI Agent가 실제 Tool을 사용한다면 다음 규칙이 중요합니다.

### 추측하지 않기

```text
없는 고객 정보를 만들지 않는다.
```

### 필요한 Tool만 사용하기

```text
불필요한 API 호출을 줄인다.
```

### 실제 실행 결과 확인하기

```text
Tool 실행 실패를 성공했다고 말하지 않는다.
```

### 중요한 Action 제한하기

```text
삭제·외부 발송 등은 신중하게 처리한다.
```

---

# 48. Memory 연결 체험

선택적으로 Simple Memory를 연결합니다.

구조:

```text
Chat Trigger
     ↓
 AI Agent
   ├─ Gemini
   ├─ Tools
   └─ Memory
```

첫 번째 메시지:

```text
내 이름은 홍길동이야.
```

두 번째 메시지:

```text
내 이름으로 테스트 이메일 문구를 작성해줘.
```

이전 대화 내용이 다음 요청에 활용되는지 확인합니다.

---

# 49. Memory와 데이터베이스는 다르다

Memory가 있다고 해서 고객 데이터 전체를 기억시키는 것이 항상 좋은 방법은 아닙니다.

### Memory

대화의 맥락 유지

예:

```text
아까 말한 고객
```

```text
이전 질문
```

---

### Google Sheets / Database

실제 업무 데이터 저장

예:

```text
고객 이름
```

```text
고객 이메일
```

```text
상태
```

```text
신청 과정
```

역할이 서로 다릅니다.

---

# 50. Agent가 모든 것을 기억해야 하는 것은 아니다

업무 데이터는 가능한 한 원본 시스템에서 조회하도록 구성합니다.

예:

```text
"고객 상태가 뭐야?"
```

↓

```text
Memory에서 추측
```

보다는

```text
Google Sheets에서 실제 상태 확인
```

이 더 적절할 수 있습니다.

항상 **어떤 정보가 어디에 저장되어야 하는지** 생각합니다.

---

# 51. Chat Trigger 실행 횟수

Chat Trigger에서는 사용자가 메시지를 보낼 때마다 Workflow가 실행됩니다.

예를 들어 한 대화에서 메시지를 10번 보내면 10번의 Workflow 실행이 발생할 수 있습니다.

따라서 실제 Agent를 운영할 때는 다음을 함께 고려합니다.

- Workflow 실행량
- AI API 호출량
- Tool API 호출량
- 처리 시간
- 비용

---

# 52. Agent도 비용과 효율을 생각해야 한다

다음 Agent를 생각합니다.

```text
사용자 질문
 ↓
Google Sheets 조회
 ↓
Gemini
 ↓
Gmail
```

질문 하나를 처리하는 동안 여러 서비스가 호출될 수 있습니다.

따라서 Agent에게 Tool을 많이 연결했다고 해서 항상 좋은 것은 아닙니다.

**필요한 기능만 연결하고 필요한 경우에만 실행하도록 설계합니다.**

---

# 53. AI Agent 테스트 방법

Agent는 한 문장만 테스트해서는 충분하지 않습니다.

같은 목적을 여러 표현으로 입력합니다.

---

## 고객 조회 테스트

```text
김민지 고객 찾아줘.
```

```text
김민지라는 사람이 등록되어 있어?
```

```text
김민지 고객의 신청 상태 확인해줘.
```

```text
김민지 이메일 주소가 뭐야?
```

같은 Tool을 적절히 사용하는지 확인합니다.

---

# 54. 등록 테스트

```text
최유진 고객을 추가해줘.
```

```text
새 고객 등록하고 싶어.
```

```text
최유진 / yujin@example.com /
AI Agent / 상담중으로 등록해줘.
```

필요한 정보가 부족할 경우 Agent가 어떻게 반응하는지도 확인합니다.

---

# 55. 필요한 정보가 부족하다면?

사용자:

```text
김민지에게 이메일 보내줘.
```

하지만 이메일 내용이 없습니다.

Agent가 임의로 내용을 만들어 발송하는 것보다 필요한 내용을 다시 확인하도록 설계할 수 있습니다.

예:

```text
어떤 내용을 보낼까요?
```

즉, Agent는 항상 바로 행동하는 것이 아니라 **작업에 필요한 정보가 충분한지 확인하는 과정**도 필요합니다.

---

# 56. 정보가 부족한 상태에서 실행하지 않기

System Message에 다음 규칙을 추가할 수 있습니다.

```text
Tool 실행에 필요한 정보가 부족한 경우
임의로 값을 만들지 말고
사용자에게 필요한 정보를 질문하세요.
```

예:

```text
새 고객을 등록해줘.
```

필요한 데이터가

```text
name
email
course
status
```

라면 누락된 값을 확인하도록 할 수 있습니다.

---

# 실습 09
# 불완전한 요청 테스트

다음 요청을 각각 입력합니다.

### 요청 A

```text
새로운 고객 등록해줘.
```

### 요청 B

```text
김민지에게 메일 보내줘.
```

### 요청 C

```text
고객 찾아줘.
```

Agent가 바로 Tool을 실행하는지, 추가 정보가 필요하다고 판단하는지 확인합니다.

---

# 57. Agent가 잘 작동한다는 의미

Agent가 답변을 자연스럽게 한다고 해서 반드시 잘 만들어진 것은 아닙니다.

다음 항목을 확인해야 합니다.

### 요청 이해

사용자의 의도를 제대로 이해했는가?

### Tool 선택

적절한 Tool을 사용했는가?

### Parameters

Tool에 올바른 데이터를 전달했는가?

### Tool Result

Tool 실행이 성공했는가?

### Final Response

실제 결과와 일치하는 답을 했는가?

---

# 58. GPT를 이용한 Agent 문제 해결

Agent가 잘못된 행동을 했다면 Workflow 전체 화면과 실행 결과를 캡처합니다.

GPT에 다음 정보를 전달합니다.

```text
1. 사용자의 입력

2. 연결된 Tool 목록

3. Agent가 선택한 Tool

4. 원래 선택했어야 할 Tool

5. 각 Tool의 Description

6. Agent의 System Message
```

---

# GPT 질문 예시

```text
n8n에서 Gemini 기반 AI Agent를 만들고 있습니다.

현재 Tool은 세 개입니다.

1. 고객정보조회
2. 고객정보등록
3. 테스트이메일발송

사용자가
"김민지 고객 상태를 확인해줘."
라고 요청했는데

Agent가 고객정보등록 Tool을 선택했습니다.

현재 Agent System Message와
각 Tool Description 화면을 첨부합니다.

어떤 설명이 모호해서 잘못된 Tool을 선택할 가능성이 있는지 분석하고,
초보자가 이해할 수 있도록 수정할 부분을 알려주세요.
```

---

# 59. Mini Challenge 01
# 고객 조회 Agent

사용 가능한 Tool:

```text
고객정보조회
```

사용자가 자연어로 고객 이름을 입력하면 Google Sheets에서 고객 데이터를 확인합니다.

테스트:

```text
김민지 고객 찾아줘.
```

```text
이준호 고객은 어떤 과정이야?
```

```text
박하늘 고객 상태 확인해줘.
```

---

# 60. Mini Challenge 02
# 고객 관리 Agent

Tool:

```text
고객정보조회

고객정보등록
```

Agent가 요청에 따라 Tool을 선택합니다.

테스트:

```text
김민지 찾아줘.
```

```text
최유진이라는 고객을 새로 등록해줘.
```

---

# 61. Mini Challenge 03
# 업무 도우미 Agent

Tool:

```text
고객정보조회

고객정보등록

테스트이메일발송
```

다음 요청을 처리합니다.

```text
김민지 고객 정보를 확인해줘.
```

```text
새 고객을 등록해줘.
```

```text
테스트 이메일을 보내줘.
```

```text
AI Agent가 뭔지 설명해줘.
```

각 요청에서 어떤 Tool을 선택하는지 확인합니다.

---

# 62. Mini Challenge 04
# 여러 Tool 연속 사용하기

요청:

```text
김민지 고객의 이메일 주소를 확인해서
테스트 안내 메일을 보내줘.
```

예상 흐름:

```text
사용자 요청
 ↓
고객정보조회
 ↓
이메일 주소 확보
 ↓
테스트이메일발송
 ↓
결과 안내
```

---

# 63. Mini Challenge 05
# 정보 부족 처리하기

요청:

```text
고객 등록해줘.
```

Agent가 임의의 데이터를 생성하지 않고 필요한 정보를 질문하게 만듭니다.

예:

```text
등록할 고객의 이름, 이메일,
과정, 상태를 알려주세요.
```

---

# 64. 응용 Challenge
# 교육기관 업무 AI Agent

다음 기능을 가진 Agent를 만듭니다.

## Tool 01

```text
고객정보조회
```

기능:

Google Sheets에서 기존 고객 확인

---

## Tool 02

```text
고객정보등록
```

기능:

Google Sheets에 신규 고객 추가

---

## Tool 03

```text
테스트이메일발송
```

기능:

지정된 테스트 주소로 이메일 전송

---

# Agent 행동 규칙

```text
사용자의 요청을 이해하고
필요한 Tool만 사용한다.

고객 정보 조회 요청이면
고객정보조회 Tool을 사용한다.

신규 고객 등록 요청이면
고객정보등록 Tool을 사용한다.

이메일 발송을 명확하게 요청한 경우에만
테스트이메일발송 Tool을 사용한다.

필요한 정보가 부족하면
Tool을 실행하기 전에 사용자에게 질문한다.

Google Sheets에서 찾을 수 없는 정보는
추측하지 않는다.

실행하지 않은 작업을
실행했다고 답하지 않는다.
```

---

# 65. 테스트 시나리오

## CASE 01

```text
김민지 고객 상태 알려줘.
```

## CASE 02

```text
이준호 고객의 이메일 주소 확인해줘.
```

## CASE 03

```text
한서윤이라는 고객을 등록해줘.
```

## CASE 04

```text
한서윤 / seoyoon@example.com /
AI Agent / 상담중으로 등록해줘.
```

## CASE 05

```text
김민지 고객에게 이메일 보내줘.
```

## CASE 06

```text
내 테스트 주소로
"DAY 06 실습 완료"라고 이메일 보내줘.
```

각 Case에서 Agent의 행동을 기록합니다.

| Case | 사용한 Tool | 결과 | 정상 여부 |
|---|---|---|---|
| 01 |  |  |  |
| 02 |  |  |  |
| 03 |  |  |  |
| 04 |  |  |  |
| 05 |  |  |  |
| 06 |  |  |  |

---

# 66. 오늘 배운 구조

DAY 05까지는

```text
AI가 판단
 ↓
사람이 만든 조건
 ↓
미리 정해진 경로
```

였습니다.

오늘부터는

```text
사용자 요청
 ↓
AI Agent
 ↓
필요한 행동 판단
 ↓
Tool 선택
 ↓
Tool 실행
 ↓
결과 확인
 ↓
사용자에게 응답
```

구조를 사용할 수 있습니다.

---

# 67. Agent의 핵심은 Tool 개수가 아니다

Tool을 20개 연결했다고 좋은 Agent가 되는 것은 아닙니다.

중요한 것은 다음과 같습니다.

```text
어떤 문제를 해결하는 Agent인가?
```

↓

```text
어떤 Tool이 필요한가?
```

↓

```text
각 Tool의 역할이 명확한가?
```

↓

```text
Agent의 행동 규칙이 명확한가?
```

↓

```text
잘못된 행동을 제한했는가?
```

↓

```text
충분히 테스트했는가?
```

---

# 68. Workflow와 Agent를 구분해서 사용하기

모든 자동화를 Agent로 만들 필요는 없습니다.

## Workflow가 적합한 경우

실행 순서가 명확함

```text
신청
 ↓
Sheets 저장
 ↓
확인 이메일
```

---

## 조건 Workflow가 적합한 경우

규칙이 명확함

```text
금액 >= 100000
→ 고액 주문
```

---

## Agent가 유용한 경우

자연어 요청을 이해하고 상황에 따라 다른 기능이 필요함

```text
"김민지 고객을 찾아줘."
```

```text
"새 고객을 등록해줘."
```

```text
"이 고객에게 이메일 보내줘."
```

사용자의 요청에 따라 필요한 행동이 달라집니다.

---

# 69. 가장 단순한 방법을 선택하기

AI Agent는 강력하지만 항상 가장 좋은 방법은 아닙니다.

다음 질문을 먼저 생각합니다.

### 순서가 항상 같은가?

→ 일반 Workflow

### 명확한 규칙으로 나눌 수 있는가?

→ IF / Switch

### 자연어의 의미를 이해해야 하는가?

→ AI

### 상황에 따라 여러 Tool 중 선택해야 하는가?

→ AI Agent

기능에 맞는 구조를 선택합니다.

---

# 70. 오늘 배운 용어 정리

| 용어 | 의미 |
|---|---|
| AI Agent | 목표와 요청을 이해하고 필요한 Tool을 선택하여 작업을 수행하는 AI 구조 |
| Chat Model | Agent가 언어를 이해하고 판단할 때 사용하는 AI Model |
| Tool | Agent가 정보를 조회하거나 실제 행동을 수행하기 위해 사용하는 기능 |
| System Message | Agent의 역할과 행동 규칙을 정의하는 지시사항 |
| Memory | 이전 대화 정보를 다음 대화에서 활용할 수 있도록 하는 기능 |
| Chat Trigger | 사용자의 채팅 메시지를 Workflow의 입력으로 받는 Trigger |
| Tool Description | Agent에게 Tool의 기능과 사용 시점을 설명하는 정보 |
| Intent | 사용자가 실제로 원하는 행동이나 목적 |
| Human-in-the-loop | 중요한 AI 행동 전에 사람이 확인하거나 승인하는 구조 |

---

# 71. 오늘의 핵심 개념

## 첫 번째

**AI Agent는 단순히 답변을 생성하는 AI가 아니다.**

필요한 Tool을 사용하여 정보를 조회하거나 실제 행동을 수행할 수 있습니다.

---

## 두 번째

**Model과 Tool의 역할은 다르다.**

```text
Model
→ 이해하고 판단

Tool
→ 조회하고 실행
```

---

## 세 번째

**Agent는 연결된 Tool 안에서 행동한다.**

필요한 기능을 Tool로 제공해야 합니다.

---

## 네 번째

**Tool 이름과 Description도 Agent 설계의 일부이다.**

Agent가 어떤 Tool을 사용해야 하는지 이해할 수 있도록 명확하게 작성합니다.

---

## 다섯 번째

**Agent에게 모든 권한을 줄 필요는 없다.**

실제 행동의 위험도를 고려하고 필요한 경우 사람의 확인 단계를 추가합니다.

---

## 여섯 번째

**모든 자동화를 Agent로 만들 필요는 없다.**

정해진 순서라면 Workflow가 더 단순하고 안정적일 수 있습니다.

---

# 72. Self Check

**Q1. 일반 AI Workflow와 AI Agent의 가장 큰 차이는 무엇인가?**

**Q2. AI Agent에서 Chat Model은 어떤 역할을 하는가?**

**Q3. Tool은 어떤 역할을 하는가?**

**Q4. Gemini가 내 Google Sheets의 고객 정보를 원래 알고 있는가?**

**Q5. 고객 데이터를 확인하려면 무엇이 필요한가?**

**Q6. Tool 이름과 Description이 중요한 이유는 무엇인가?**

**Q7. Agent가 잘못된 Tool을 선택했다면 어떤 부분을 확인해야 하는가?**

**Q8. Memory와 Google Sheets는 어떤 차이가 있는가?**

**Q9. 이메일 발송 Tool을 데이터 조회 Tool보다 신중하게 사용해야 하는 이유는 무엇인가?**

**Q10. 단순히 신청 정보를 저장하고 이메일을 보내는 작업에 반드시 AI Agent가 필요한가?**

---

# 73. 최종 실습
# 나만의 고객 관리 AI Agent

다음 요구사항을 보고 Agent를 완성합니다.

## Agent가 할 수 있는 일

```text
고객 정보 조회
```

```text
신규 고객 등록
```

```text
테스트 이메일 발송
```

---

# 필요한 구성

```text
Chat Trigger
```

↓

```text
AI Agent
```

Agent에 연결:

```text
Google Gemini Chat Model
```

```text
고객정보조회 Tool
```

```text
고객정보등록 Tool
```

```text
테스트이메일발송 Tool
```

선택:

```text
Simple Memory
```

---

# Agent를 만들기 전에 먼저 작성하기

## 이 Agent의 목적은 무엇인가?

```text
________________________________
```

## 사용자는 어떤 요청을 할 수 있는가?

```text
1.

2.

3.
```

## 필요한 Tool은 무엇인가?

```text
1.

2.

3.
```

## 각 Tool은 언제 사용해야 하는가?

```text
Tool 1 :

Tool 2 :

Tool 3 :
```

## 실행하면 안 되는 행동은 무엇인가?

```text
1.

2.
```

## 정보가 부족할 때 어떻게 해야 하는가?

```text
________________________________
```

---

# 최종 테스트

Agent에게 최소 다음 요청을 테스트합니다.

```text
김민지 고객을 찾아줘.
```

```text
박하늘 고객 상태 알려줘.
```

```text
새로운 고객을 등록해줘.
```

```text
최유진 / yujin@example.com /
AI Agent / 상담중으로 등록해줘.
```

```text
내 테스트 이메일로
DAY 06 실습 완료라고 보내줘.
```

```text
AI Agent와 일반 Workflow의 차이가 뭐야?
```

---

# 결과 확인

각 실행에서 다음 다섯 가지를 확인합니다.

```text
① 요청을 정확하게 이해했는가?
```

↓

```text
② 적절한 Tool을 선택했는가?
```

↓

```text
③ Tool에 필요한 값을 정확하게 전달했는가?
```

↓

```text
④ Tool이 실제로 정상 실행되었는가?
```

↓

```text
⑤ 최종 답변이 실제 실행 결과와 일치하는가?
```

---

# DAY 06 COMPLETE

지금까지의 흐름을 연결하면 다음과 같습니다.

### DAY 01

```text
Workflow와 Node 이해
```

↓

### DAY 02

```text
n8n에서 데이터 전달
```

↓

### DAY 03

```text
외부 서비스 연결
```

↓

### DAY 04

```text
Gemini를 이용한 AI 처리
```

↓

### DAY 05

```text
AI 결과를 이용한 조건과 분기
```

↓

### DAY 06

```text
AI가 필요한 Tool을
스스로 선택하여 실행
```

지금까지는 주어진 예제를 따라 Workflow와 Agent를 만들었습니다.

다음 과정에서는 프로그램부터 실행하지 않습니다.

먼저

```text
나는 무엇을 만들고 싶은가?
```

↓

```text
사용자는 무엇을 입력하는가?
```

↓

```text
어떤 정보가 필요한가?
```

↓

```text
어떤 판단이 필요한가?
```

↓

```text
어떤 Tool이 필요한가?
```

↓

```text
최종적으로 무엇이 실행되어야 하는가?
```

를 글과 Flow로 표현합니다.

**DAY 07에서는 직접 만들고 싶은 AI 자동화 또는 AI Agent를 기획하고, User Flow를 작성한 뒤 필요한 Node와 Tool을 스스로 결정합니다.**