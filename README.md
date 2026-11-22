# o-ca

오늘의 운세 카드. 나의 오행과 오늘의 오행을 섞어 그래픽 카드로 보여주고, 친구에게 카드로 공유한다. 토스 앱(앱인토스) 미니앱 출시가 목표.

## 구성

| 경로 | 내용 |
|---|---|
| `prototypes/fortune-card.html` | 모바일 카드 프로토타입 (three.js 3D 아이콘, 셰이더 그라데이션, 오행별 라인 장식) |
| `docs/framing.md` | 프로젝트 프레이밍 (배경·목적·성공 기준·방향·제약) |
| `docs/tasks.md` | 태스크 목록 |
| `docs/appsintoss-research.md` | 앱인토스 출시 요건 조사 |
| `docs/privacy-research.md` | 생년월일 개인정보 처리 조사 |

## 프로토타입 실행

ES 모듈과 CDN을 쓰므로 로컬 서버로 연다.

```bash
cd prototypes
python3 -m http.server 5178
# http://localhost:5178/fortune-card.html
```
