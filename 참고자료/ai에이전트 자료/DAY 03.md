# DAY 03  
# Google Sheets와 이메일 연결하기

## 오늘의 학습 목표

DAY 02에서는 n8n 안에서 Node를 연결하고, 앞 Node의 Output을 다음 Node의 Input으로 전달하는 방법을 배웠습니다.

오늘부터는 n8n 밖에 있는 **실제 서비스와 데이터를 주고받습니다.**

오늘 수업이 끝나면 다음 내용을 이해할 수 있습니다.

- n8n과 외부 서비스를 연결한다는 것의 의미
- Credential의 기본 개념
- Google 계정을 n8n과 연결하는 방법
- Google Sheets에서 데이터를 저장하고 불러오는 방법
- Google Sheets의 열과 n8n 데이터를 연결하는 방법
- 고정값과 동적 데이터의 차이
- Gmail을 이용해 이메일을 발송하는 방법
- 이전 Node의 데이터를 이메일 제목과 본문에 활용하는 방법
- 여러 서비스를 하나의 Workflow로 연결하는 방법
- 외부 서비스 연결 과정에서 발생하는 문제를 확인하는 방법

---

# 1교시  
# Google Sheets와 n8n 연결하기

## 01. 오늘부터 달라지는 점

지금까지 만든 Workflow는 대부분 n8n 안에서 시작하고 n8n 안에서 끝났습니다.

예를 들어 다음과 같습니다.

**Manual Trigger**

↓

**Edit Fields**

↓

**Edit Fields**

↓

**결과 확인**

오늘부터는 Workflow의 범위가 n8n 밖으로 확장됩니다.

**n8n**

↓

**Google Sheets**

↓

**Gmail**

이제 n8n은 단순히 데이터를 처리하는 프로그램이 아니라 **여러 서비스를 연결하는 중심 역할**을 하게 됩니다.

---

# 02. 외부 서비스를 연결한다는 것

예를 들어 다음과 같은 업무가 있다고 가정합니다.

> 고객이 신청하면 고객 정보를 Google Sheets에 기록하고 확인 이메일을 발송한다.

사람이 직접 처리하면 다음과 같습니다.

**신청 내용 확인**

↓

**Google Sheets 실행**

↓

**이름 입력**

↓

**이메일 입력**

↓

**신청 내용 입력**

↓

**Gmail 실행**

↓

**이메일 작성**

↓

**발송**

이 작업을 Workflow로 표현하면 다음과 같습니다.

**신청 데이터**

↓

**Google Sheets 저장**

↓

**Gmail 발송**

사람이 프로그램을 하나씩 열어서 작업하는 대신 **n8n이 각 서비스를 연결하여 데이터를 전달합니다.**

---

# 03. Credential이란?

n8n이 Google Sheets나 Gmail을 사용하려면 먼저 해당 서비스에 접근할 수 있어야 합니다.

이때 사용하는 연결 정보를 **Credential**이라고 합니다.

쉽게 표현하면 다음과 같습니다.

> **“이 Workflow가 내 Google 서비스에 접근하도록 허용하는 연결 정보”**

Google Sheets Node를 추가했다고 해서 바로 자신의 Google Sheets를 사용할 수 있는 것은 아닙니다.

먼저 n8n과 Google 계정을 연결해야 합니다.

---

# 04. Credential과 비밀번호는 다르다

Credential을 이용한다고 해서 n8n Node에 Google 비밀번호를 직접 입력하는 것은 아닙니다.

n8n Cloud에서는 지원되는 Google 서비스에 대해 Google 로그인 방식으로 연결할 수 있습니다. 현재 Google Sheets와 Gmail은 n8n Cloud의 Managed OAuth2 지원 대상에 포함되어 있습니다.

기본적인 흐름은 다음과 같습니다.

**n8n에서 Google 연결 요청**

↓

**Google 로그인**

↓

**접근 권한 확인**

↓

**허용**

↓

**Credential 생성**

↓

**Node에서 Credential 사용**

---

# 05. OAuth를 아주 간단하게 이해하기

오늘 OAuth의 기술적인 구조를 외울 필요는 없습니다.

다음 정도만 이해합니다.

### 일반적인 로그인

```text
서비스
↓
ID / Password 입력
↓
로그인
```

### OAuth 방식의 연결

```text
n8n
↓
Google에게 연결 요청
↓
Google에서 로그인
↓
사용자가 권한 허용
↓
n8n에 접근 권한 부여
```

즉, 다른 서비스에 내 Google 비밀번호를 직접 알려주는 방식이 아니라 **Google을 통해 접근 권한을 허용하는 구조**입니다.

API와 인증에 대한 자세한 내용은 이후 과정에서 다시 다룹니다.

---

# 06. Google Sheets를 자동화에 사용하는 이유

Google Sheets는 표 형태로 데이터를 저장할 수 있기 때문에 자동화 실습에서 다양하게 활용할 수 있습니다.

예를 들어 다음과 같은 정보를 저장할 수 있습니다.

### 고객 문의

| 이름 | 이메일 | 문의 내용 | 상태 |
|---|---|---|---|
| 김민지 | example@email.com | 강의 문의 | 신규 |

### 신청자 관리

| 이름 | 과정 | 신청일 | 상태 |
|---|---|---|---|
| 박하늘 | AI Agent | 2026-10-01 | 신청완료 |

### 콘텐츠 관리

| 주제 | 제목 | 상태 |
|---|---|---|
| AI | AI Agent란? | 작성대기 |

Google Sheets Node에서는 행 추가, 행 조회, 행 수정 등 다양한 작업을 수행할 수 있습니다.

---

# 07. 오늘 사용할 Google Sheet 준비하기

새로운 Google Spreadsheet를 만듭니다.

파일 이름:

```text
AI_AGENT_DAY03
```

첫 번째 Sheet의 이름:

```text
customer
```

1행에 다음 항목을 작성합니다.

| A | B | C | D |
|---|---|---|---|
| name | email | request | status |

즉,

```text
name
email
request
status
```

라는 네 개의 열을 사용합니다.

---

# 08. 첫 번째 Workflow 구조

오늘 처음 만들 Workflow입니다.

**Manual Trigger**

↓

**Edit Fields**

↓

**Google Sheets**

### 역할

**Manual Trigger**

Workflow 시작

↓

**Edit Fields**

테스트용 고객 정보 생성

↓

**Google Sheets**

고객 정보를 실제 Spreadsheet에 저장

---

# 실습 01  
# Google Sheets에 데이터 저장하기

## STEP 01. 새로운 Workflow 만들기

Workflow 이름:

```text
DAY03_Google_Sheets
```

---

## STEP 02. Manual Trigger 추가

Workflow를 직접 실행하기 위한 Manual Trigger를 추가합니다.

---

## STEP 03. Edit Fields 추가

다음 데이터를 만듭니다.

```text
name : 김민지

email : 자신의 이메일 주소

request : AI Agent 과정에 대해 문의드립니다.

status : 신규
```

현재 데이터 구조는 다음과 같습니다.

**Manual Trigger**

↓

**Edit Fields**

```text
name
email
request
status
```

---

# 09. Google Sheets Node 추가하기

다음 Node로 **Google Sheets**를 추가합니다.

전체 구조:

**Manual Trigger**

↓

**Edit Fields**

↓

**Google Sheets**

Google Sheets Node를 선택한 뒤 자신의 Google Credential을 연결합니다.

n8n Cloud 환경에서는 Credential 화면에서 지원되는 Google 서비스에 대해 Google 계정으로 로그인하여 연결할 수 있습니다.

---

# 10. 어떤 Spreadsheet를 사용할 것인가?

Google Sheets Node에서는 데이터를 저장할 위치를 지정해야 합니다.

오늘 사용할 대상:

```text
Spreadsheet
AI_AGENT_DAY03
```

```text
Sheet
customer
```

Google Sheets의 구조를 생각해봅니다.

**Spreadsheet**

↓

**Sheet**

↓

**Column**

↓

**Row**

---

# 11. Row란?

Google Sheets에서 가로 한 줄을 **Row**라고 합니다.

예:

| name | email | request | status |
|---|---|---|---|
| 김민지 | example@email.com | 강의 문의 | 신규 |

이 데이터 전체가 하나의 Row입니다.

새로운 고객이 들어오면 새로운 Row를 추가할 수 있습니다.

---

# 12. Append Row

Google Sheets의 **Append Row** 작업은 Sheet에 새로운 행을 추가합니다.

예를 들어 기존 Sheet가 다음과 같다면

| name | email |
|---|---|
| 김민지 | minji@example.com |

새로운 데이터를 Append하면

| name | email |
|---|---|
| 김민지 | minji@example.com |
| 이준호 | junho@example.com |

처럼 아래쪽에 새로운 Row가 추가됩니다.

---

# 13. 가장 중요한 단계: Mapping

Google Sheets에는 다음 열이 있습니다.

```text
name
email
request
status
```

n8n에도 다음 데이터가 있습니다.

```text
name : 김민지
email : example@email.com
request : AI Agent 과정에 대해 문의드립니다.
status : 신규
```

이제 서로 연결해야 합니다.

### Google Sheets

```text
name
```

←

```text
n8n의 name
```

### Google Sheets

```text
email
```

←

```text
n8n의 email
```

### Google Sheets

```text
request
```

←

```text
n8n의 request
```

### Google Sheets

```text
status
```

←

```text
n8n의 status
```

이 과정을 DAY 02에서 배운 **Data Mapping**이라고 볼 수 있습니다.

---

# 14. Mapping을 그림으로 이해하기

```text
Edit Fields Output
```

```text
name ─────────────→ name
email ────────────→ email
request ──────────→ request
status ───────────→ status
```

↓

```text
Google Sheets
```

중요한 것은 **값을 다시 입력하는 것이 아니라 앞 Node에서 만들어진 값을 연결하는 것**입니다.

---

# 실습 02  
# 첫 번째 고객 정보 저장하기

Workflow를 실행합니다.

정상적으로 실행되었다면 Google Sheets를 직접 확인합니다.

### 실행 전

| name | email | request | status |
|---|---|---|---|

### 실행 후

| name | email | request | status |
|---|---|---|---|
| 김민지 | 자신의 이메일 | AI Agent 과정에 대해 문의드립니다. | 신규 |

n8n에서 생성된 데이터가 실제 외부 서비스까지 전달되었습니다.

---

# 15. 데이터를 변경해서 다시 실행하기

Edit Fields의 데이터를 변경합니다.

```text
name : 박하늘

email : 자신의 이메일 주소

request : 수업 일정이 궁금합니다.

status : 신규
```

다시 Workflow를 실행합니다.

### 예상 결과

| name | email | request | status |
|---|---|---|---|
| 김민지 | 자신의 이메일 | AI Agent 과정에 대해 문의드립니다. | 신규 |
| 박하늘 | 자신의 이메일 | 수업 일정이 궁금합니다. | 신규 |

같은 Workflow를 사용했지만 **Input 데이터가 달라지면서 다른 결과가 저장됩니다.**

---

# 16. 자동화에서 중요한 것은 구조이다

방금 Workflow를 다음과 같이 볼 수 있습니다.

```text
데이터 A
↓
Google Sheets
```

또는

```text
데이터 B
↓
Google Sheets
```

Workflow의 구조는 동일합니다.

변하는 것은 데이터입니다.

이것이 자동화에서 중요한 이유입니다.

**Workflow는 반복해서 사용하고**

**데이터만 계속 변경됩니다.**

---

# 17. Google Sheets에서 데이터 가져오기

Google Sheets는 데이터를 저장하는 용도로만 사용하는 것이 아닙니다.

저장되어 있는 데이터를 다시 n8n으로 가져올 수도 있습니다.

Google Sheets Node는 Sheet에서 Row를 가져오는 작업도 지원합니다.

구조는 다음과 같습니다.

**Google Sheets**

↓

**n8n**

기존과 방향이 반대가 됩니다.

---

# 실습 03  
# Google Sheets 데이터 읽기

새로운 Google Sheets Node를 추가합니다.

목표:

```text
Google Sheets
↓
저장된 고객 데이터 가져오기
↓
n8n Output에서 확인
```

실행 후 Output을 확인합니다.

예:

```text
name : 김민지
email : example@email.com
request : AI Agent 과정에 대해 문의드립니다.
status : 신규
```

Google Sheets에 있던 데이터가 이제 **다음 Node가 사용할 수 있는 Output**이 됩니다.

---

# CHECK POINT 01

다음 질문에 답해봅니다.

**Q1. Google Sheets에 데이터를 넣을 때 n8n은 데이터를 보내는가, 받는가?**

**Q2. Google Sheets의 데이터를 조회할 때 n8n은 데이터를 보내는가, 받는가?**

**Q3. Google Sheets의 Column과 n8n 데이터를 연결하는 과정은 무엇인가?**

**Q4. 새로운 고객이 들어올 때마다 Workflow를 새로 만들어야 하는가?**

---

# 10분 휴식

---

# 2교시  
# Gmail 연결과 실제 업무 자동화 만들기

## 18. 두 번째 외부 서비스 연결

이제 다음 목표를 추가합니다.

> 고객 정보를 Google Sheets에 저장한 뒤 고객에게 확인 이메일을 보낸다.

전체 Workflow가 길어집니다.

**Manual Trigger**

↓

**고객 정보**

↓

**Google Sheets 저장**

↓

**Gmail 발송**

이제 두 개의 외부 서비스가 하나의 Workflow에 연결됩니다.

---

# 19. Gmail Node

Gmail Node를 이용하면 n8n에서 Gmail의 여러 기능을 사용할 수 있습니다.

오늘은 **이메일 보내기** 기능을 사용합니다.

현재 Gmail Node의 Send 작업에서는 기본적으로 다음 정보를 지정할 수 있습니다.

- 받는 사람
- 제목
- 이메일 유형
- 본문

또한 필요에 따라 CC, BCC, 첨부파일 등의 옵션도 사용할 수 있습니다.

---

# 20. Gmail Credential 연결하기

Gmail Node를 추가하고 Google 계정을 연결합니다.

n8n Cloud에서는 Gmail 역시 Managed OAuth2 지원 대상에 포함됩니다.

연결이 완료되면 n8n Workflow에서 Gmail 기능을 사용할 수 있습니다.

---

# 21. 첫 번째 이메일 보내기

처음에는 Mapping 없이 고정값으로 테스트합니다.

### To

```text
자신의 이메일 주소
```

### Subject

```text
n8n 이메일 테스트
```

### Message

```text
n8n에서 보낸 첫 번째 자동 이메일입니다.
```

Workflow를 실행합니다.

실제 이메일이 도착했는지 확인합니다.

---

# 22. 고정값의 문제

현재 이메일은 항상 같은 내용을 보냅니다.

```text
안녕하세요.

n8n에서 보낸 첫 번째 자동 이메일입니다.
```

하지만 실제 업무에서는 사람마다 내용이 달라져야 합니다.

예:

```text
김민지님, 문의가 정상적으로 접수되었습니다.
```

다음 실행에서는

```text
박하늘님, 문의가 정상적으로 접수되었습니다.
```

라고 보내야 할 수 있습니다.

따라서 Gmail에서도 **동적 데이터**를 사용해야 합니다.

---

# 23. 이메일에 이전 Node 데이터 사용하기

DAY 02부터 계속 사용하고 있는 원리를 다시 적용합니다.

### 앞 Node의 Output

```text
name : 김민지

email : minji@example.com

request : AI Agent 과정에 대해 문의드립니다.

status : 신규
```

↓

### Gmail

```text
To
↓
email
```

```text
Message
↓
name + request
```

즉, 이전 Node의 Output을 Gmail의 여러 입력값에 Mapping합니다.

---

# 실습 04  
# 이름이 자동으로 바뀌는 이메일

다음과 같은 이메일을 만들어봅니다.

### 제목

```text
문의가 정상적으로 접수되었습니다.
```

### 본문

```text
김민지님, 안녕하세요.

문의가 정상적으로 접수되었습니다.

문의 내용:
AI Agent 과정에 대해 문의드립니다.

확인 후 안내드리겠습니다.
```

단,

```text
김민지
```

와

```text
AI Agent 과정에 대해 문의드립니다.
```

를 직접 입력하지 않습니다.

앞 Node에서 전달된 데이터를 사용합니다.

---

# 24. 고정 문장 + 동적 데이터

자동화에서 자주 사용하는 방식입니다.

### 고정 문장

```text
님, 안녕하세요.

문의가 정상적으로 접수되었습니다.
```

### 동적 데이터

```text
name
```

```text
request
```

이 둘을 조합하면 다음과 같습니다.

```text
[이름]님, 안녕하세요.

문의가 정상적으로 접수되었습니다.

문의 내용:
[문의 내용]

확인 후 안내드리겠습니다.
```

실행할 때마다 `[이름]`과 `[문의 내용]` 부분이 달라집니다.

---

# 25. 전체 Workflow 연결하기

이제 지금까지 만든 내용을 하나로 연결합니다.

## STEP 01

Manual Trigger

↓

## STEP 02

고객 정보 생성

```text
name
email
request
status
```

↓

## STEP 03

Google Sheets

새로운 Row 추가

↓

## STEP 04

Gmail

확인 이메일 발송

---

# 전체 구조

```text
Manual Trigger
        ↓
  Edit Fields
        ↓
Google Sheets
        ↓
      Gmail
```

이제 하나의 데이터를 여러 서비스가 함께 사용합니다.

---

# 실습 05  
# 고객 문의 접수 자동화

## 목표

다음 Workflow를 완성합니다.

**고객 정보 입력**

↓

**Google Sheets 기록**

↓

**고객에게 확인 이메일 발송**

---

## 테스트 데이터

```text
name : 자신의 이름

email : 자신의 이메일 주소

request : AI Agent 수업 신청 방법이 궁금합니다.

status : 신규
```

---

## Google Sheets 저장 결과

| name | email | request | status |
|---|---|---|---|
| 자신의 이름 | 자신의 이메일 | AI Agent 수업 신청 방법이 궁금합니다. | 신규 |

---

## Gmail 결과

### 받는 사람

```text
입력 데이터의 email
```

### 제목

```text
문의 접수가 완료되었습니다.
```

### 본문

```text
[이름]님, 안녕하세요.

문의가 정상적으로 접수되었습니다.

문의 내용:
[문의 내용]

확인 후 안내드리겠습니다.
```

---

# 26. 데이터는 어떻게 이동했을까?

완성된 Workflow를 데이터 기준으로 살펴봅니다.

### STEP 01

Edit Fields에서 데이터 생성

```text
name
email
request
status
```

↓

### STEP 02

Google Sheets가 데이터 사용

```text
name → name 열
email → email 열
request → request 열
status → status 열
```

↓

### STEP 03

Gmail이 데이터 사용

```text
email → 받는 사람

name → 이메일 본문

request → 이메일 본문
```

하나의 데이터가 여러 Node에서 서로 다른 용도로 사용되고 있습니다.

---

# 27. 중요한 질문

Google Sheets Node를 지나면 데이터가 무조건 사라질까요?

아닙니다.

Workflow를 만들 때는 **각 Node의 실제 Output을 확인하는 습관**이 중요합니다.

어떤 Node가 어떤 형태의 데이터를 반환하는지 확인한 뒤 다음 Node가 필요한 데이터를 어디에서 가져올 것인지 결정합니다.

따라서 다음 질문을 반복합니다.

**현재 Node의 Input은 무엇인가?**

↓

**현재 Node가 무엇을 했는가?**

↓

**현재 Output에는 어떤 값이 있는가?**

↓

**다음 Node에서는 어떤 값이 필요한가?**

---

# 28. Node를 건너뛰어 데이터 사용하기

Workflow가 다음과 같이 있다고 가정합니다.

```text
Edit Fields
     ↓
Google Sheets
     ↓
   Gmail
```

Gmail에서 필요한 데이터가 바로 앞 Google Sheets Node가 아니라 **처음 Edit Fields에 있는 경우**도 있습니다.

이때는 데이터를 무조건 바로 앞 Node에서만 가져와야 하는 것은 아닙니다.

필요한 Node의 Output을 찾아 사용할 수 있습니다.

이 개념은 Workflow가 길어질수록 중요해집니다.

---

# 29. 데이터를 찾는 습관

필요한 데이터가 보이지 않을 때 바로 직접 입력하지 않습니다.

다음 순서로 확인합니다.

### ① 내가 필요한 값은 무엇인가?

예:

```text
고객 이메일 주소
```

### ② 그 값은 어느 Node에서 만들어졌는가?

예:

```text
Edit Fields
```

### ③ 해당 Node의 Output에 값이 존재하는가?

확인

### ④ 필요한 입력란에 해당 값을 Mapping한다.

이것이 n8n에서 데이터를 다루는 기본적인 문제 해결 방식입니다.

---

# 실습 06  
# 데이터가 바뀌어도 동작하는지 확인하기

Edit Fields의 내용을 변경합니다.

### 테스트 01

```text
name : 박민수
request : 환불 규정이 궁금합니다.
```

실행

↓

Google Sheets 확인

↓

이메일 확인

---

### 테스트 02

```text
name : 이하늘
request : 수업 시간을 변경하고 싶습니다.
```

다시 실행

↓

Google Sheets 확인

↓

이메일 확인

Workflow를 수정하지 않았는데 결과의 내용만 바뀐다면 **동적 데이터가 정상적으로 연결된 것**입니다.

---

# 30. 잘못된 Mapping 만들어보기

이번에는 일부러 문제를 만들어봅니다.

예를 들어 기존 Field:

```text
email
```

을

```text
customer_email
```

로 변경합니다.

하지만 Gmail Node는 계속 기존 `email` 값을 사용하도록 둡니다.

Workflow를 실행하고 결과를 확인합니다.

---

# 문제 해결 순서

## STEP 01

어느 Node까지 정상적으로 실행되었는가?

## STEP 02

Gmail Node가 받은 Input을 확인한다.

## STEP 03

필요한 email 데이터가 존재하는지 확인한다.

## STEP 04

앞 Node의 Output을 확인한다.

## STEP 05

Field 이름이 변경되었는지 확인한다.

## STEP 06

Mapping을 수정한다.

## STEP 07

다시 실행한다.

---

# 31. Credential 문제와 데이터 문제 구분하기

외부 서비스를 연결하면 오류의 종류도 많아집니다.

크게 나누면 다음과 같이 생각할 수 있습니다.

## 연결 문제

Google 계정 또는 Credential과 관련된 문제

예:

```text
서비스에 접근할 수 없음
```

```text
인증 필요
```

```text
권한 부족
```

---

## 데이터 문제

Workflow에서 전달되는 값과 관련된 문제

예:

```text
email 값이 없음
```

```text
잘못된 Column을 선택함
```

```text
필요한 Field를 찾을 수 없음
```

---

## 설정 문제

Node의 작업 설정과 관련된 문제

예:

```text
잘못된 Spreadsheet 선택
```

```text
잘못된 Sheet 선택
```

```text
원하지 않는 Operation 선택
```

오류가 발생했을 때 먼저 **어떤 종류의 문제인지 구분하면 해결 범위를 줄일 수 있습니다.**

---

# 32. GPT에 질문하기 전에 확인할 것

문제가 발생하면 다음 다섯 가지를 먼저 확인합니다.

### ① 어느 Node에서 문제가 발생했는가?

### ② 해당 Node의 Input은 무엇인가?

### ③ 필요한 값이 Input에 존재하는가?

### ④ Credential은 정상적으로 연결되어 있는가?

### ⑤ 선택한 작업과 대상이 맞는가?

그래도 해결되지 않는다면 현재 화면을 캡처하여 GPT에게 질문합니다.

---

# 33. GPT 질문 예시

## 좋지 않은 질문

```text
구글시트 연결이 안 돼요.
```

이 질문만으로는 현재 문제가 무엇인지 알기 어렵습니다.

---

## 개선된 질문

```text
n8n Cloud에서 Google Sheets에 고객 정보를 저장하는
Workflow를 만들고 있습니다.

현재 구조는

Edit Fields → Google Sheets

입니다.

Edit Fields에는
name, email, request, status 데이터가 있습니다.

Google Sheets에 새로운 Row를 추가하려고 하는데
첨부한 화면처럼 실행되지 않습니다.

현재 화면을 기준으로

1. Credential 문제인지
2. Spreadsheet 설정 문제인지
3. Mapping 문제인지

확인하는 순서를 초보자 기준으로 설명해주세요.
```

---

# 34. 개인정보와 테스트 데이터

자동화 실습에서는 실제 고객의 개인정보를 사용하지 않습니다.

연습할 때는 다음과 같은 데이터를 사용합니다.

```text
테스트 이름
```

```text
자신의 이메일 주소
```

```text
가상의 문의 내용
```

자동화가 정상적으로 동작하는 것을 충분히 확인한 뒤 실제 업무에 적용합니다.

---

# 35. Mini Challenge 01  
# 강의 신청 자동화

다음 Workflow를 만들어봅니다.

**신청 정보**

↓

**Google Sheets 저장**

↓

**신청 완료 이메일**

### 데이터

```text
name
email
course
date
```

### 최종 이메일

```text
[이름]님의 [과정명] 신청이 완료되었습니다.

신청일:
[날짜]
```

---

# 36. Mini Challenge 02  
# 예약 접수 자동화

### 데이터

```text
name
email
service
reservation_date
reservation_time
```

### Workflow

```text
Manual Trigger
        ↓
 예약 정보 생성
        ↓
 Google Sheets
        ↓
      Gmail
```

### 이메일 결과

```text
[이름]님의 예약이 접수되었습니다.

서비스:
[서비스명]

예약일:
[예약 날짜]

시간:
[예약 시간]
```

---

# 37. Mini Challenge 03  
# 내부 담당자에게 알림 보내기

이번에는 고객에게 이메일을 보내는 것이 아니라 담당자에게 이메일을 보냅니다.

### Workflow

**고객 문의**

↓

**Google Sheets 저장**

↓

**담당자에게 이메일**

### 이메일 제목

```text
새로운 고객 문의가 등록되었습니다.
```

### 본문

```text
새로운 문의가 등록되었습니다.

고객명:
[이름]

이메일:
[이메일]

문의 내용:
[문의 내용]
```

고객의 이메일은 **받는 사람 주소가 아니라 본문 데이터로 사용됩니다.**

같은 데이터를 사용해도 **Workflow의 목적에 따라 사용 위치가 달라질 수 있습니다.**

---

# 38. 응용 Challenge  
# 두 개의 이메일 보내기

기본 Workflow:

```text
고객 정보
    ↓
Google Sheets
    ↓
고객 확인 이메일
```

여기에 하나의 Node를 더 추가합니다.

```text
고객 정보
    ↓
Google Sheets
    ↓
고객 확인 이메일
    ↓
담당자 알림 이메일
```

### 고객에게

```text
문의가 정상적으로 접수되었습니다.
```

### 담당자에게

```text
새로운 문의가 들어왔습니다.
```

하나의 Trigger로 여러 작업을 연속해서 실행할 수 있습니다.

---

# 39. Workflow가 길어졌을 때 읽는 방법

다음 Workflow를 봅니다.

```text
Manual Trigger
        ↓
  Edit Fields
        ↓
Google Sheets
        ↓
  Gmail 고객
        ↓
 Gmail 담당자
```

다음 세 가지를 기준으로 읽습니다.

### 시작

무엇이 Workflow를 시작시키는가?

### 데이터

어떤 정보가 Node 사이를 이동하는가?

### 행동

각 Node가 데이터를 이용해 어떤 작업을 하는가?

---

# 40. Node 이름 바꾸기

Workflow가 길어지면 다음과 같은 이름은 구분하기 어렵습니다.

```text
Google Sheets
Google Sheets1
Gmail
Gmail1
Edit Fields
Edit Fields1
```

역할을 알 수 있도록 이름을 정리합니다.

예:

```text
고객 정보 생성
```

```text
문의 내역 저장
```

```text
고객 확인 메일
```

```text
담당자 알림 메일
```

Workflow는 **만드는 것뿐만 아니라 나중에 다시 읽을 수 있어야 합니다.**

---

# 41. 오늘 완성한 자동화

오늘 처음으로 실제 외부 서비스가 연결된 Workflow를 만들었습니다.

```text
고객 정보 생성
        ↓
Google Sheets 저장
        ↓
확인 이메일 발송
```

이 구조를 실제 업무로 바꾸면 다음과 같이 발전할 수 있습니다.

```text
웹사이트 문의
        ↓
Google Sheets 저장
        ↓
AI가 내용 분석
        ↓
문의 종류 판단
        ↓
담당자 결정
        ↓
이메일 발송
```

오늘까지 배운 내용으로는

**데이터를 받는다**

↓

**저장한다**

↓

**전달한다**

까지 가능합니다.

이후 과정에서는 가운데에 **AI가 생각하고 처리하는 단계**를 추가합니다.

---

# 42. 오늘 배운 용어 정리

| 용어 | 의미 |
|---|---|
| External Service | n8n과 연결하여 사용하는 외부 서비스 |
| Credential | 외부 서비스 사용 권한을 연결하는 정보 |
| OAuth | 외부 서비스가 계정 비밀번호 자체를 공유하지 않고 접근 권한을 허용하는 방식 |
| Spreadsheet | Google Sheets의 하나의 문서 |
| Sheet | Spreadsheet 안에 있는 개별 시트 |
| Column | 세로 방향의 데이터 항목 |
| Row | 가로 방향의 데이터 한 건 |
| Append Row | Sheet 아래에 새로운 Row 추가 |
| Get Row(s) | Sheet에 저장된 Row 가져오기 |
| Mapping | 한 Node의 데이터를 다른 입력값과 연결하는 것 |
| Static Value | 직접 입력한 고정값 |
| Dynamic Value | 실행할 때 데이터에 따라 달라지는 값 |

---

# 43. 오늘의 핵심 개념

## 첫 번째

**n8n은 혼자 사용하는 프로그램이 아니라 여러 서비스를 연결할 수 있다.**

---

## 두 번째

**Credential을 통해 외부 서비스와 연결한다.**

---

## 세 번째

**앞 Node의 Output을 외부 서비스의 입력값으로 Mapping한다.**

---

## 네 번째

**하나의 데이터가 여러 서비스에서 서로 다른 용도로 사용될 수 있다.**

---

## 다섯 번째

**Workflow의 구조는 그대로 두고 데이터만 변경하여 반복 실행할 수 있다.**

---

# 44. Self Check

다음 질문에 스스로 답해봅니다.

**Q1. Credential은 어떤 역할을 하는가?**

**Q2. Google Sheets의 Row와 Column은 각각 무엇인가?**

**Q3. Append Row는 어떤 작업인가?**

**Q4. n8n의 name 데이터를 Google Sheets의 name 열과 연결하는 과정을 무엇이라고 하는가?**

**Q5. Gmail의 받는 사람 주소를 매번 직접 입력하지 않으려면 어떻게 해야 하는가?**

**Q6. Credential 오류와 Mapping 오류는 어떤 차이가 있는가?**

**Q7. Google Sheets에서 가져온 데이터를 다음 Node에서 다시 사용할 수 있는가?**

**Q8. 고정값과 동적 데이터는 어떤 차이가 있는가?**

---

# 45. 최종 실습  
# 처음부터 혼자 만들어보기

다음 요구사항을 보고 Workflow를 직접 구성합니다.

## 요구사항

> 교육 신청자가 있다.  
> 신청자의 이름, 이메일, 과정명, 신청 목적을 기록해야 한다.  
> 데이터는 Google Sheets에 저장한다.  
> 저장이 끝나면 신청자에게 접수 완료 이메일을 발송한다.

프로그램을 바로 만들기 전에 먼저 Flow를 작성합니다.

```text
____________________

        ↓

____________________

        ↓

____________________

        ↓

____________________
```

필요한 데이터도 작성합니다.

```text
1.

2.

3.

4.
```

그다음 필요한 Node를 선택하여 직접 Workflow를 완성합니다.

---

# DAY 03 COMPLETE

오늘은 처음으로 n8n과 실제 외부 서비스를 연결했습니다.

DAY 01부터 지금까지의 흐름은 다음과 같습니다.

### DAY 01

**Node로 작업을 나누는 방법**

↓

### DAY 02

**n8n에서 Node와 데이터를 연결하는 방법**

↓

### DAY 03

**n8n의 데이터를 실제 외부 서비스와 연결하는 방법**

오늘 만든 Workflow:

```text
입력 데이터
    ↓
Google Sheets
    ↓
    Gmail
```

다음 과정에서는 이 구조에 **AI**를 추가합니다.

```text
입력 데이터
    ↓
   Gemini
    ↓
Google Sheets
    ↓
    Gmail
```

단순히 데이터를 전달하는 자동화에서 벗어나

**내용을 읽고**

↓

**분석하고**

↓

**요약하고**

↓

**분류하고**

↓

**새로운 내용을 생성하는**

AI Workflow로 발전합니다.