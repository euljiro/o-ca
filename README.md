# o-ca

오늘의 운세 카드. 나의 오행과 오늘의 오행을 섞어 그래픽 카드로 보여주고, 친구에게 카드로 공유한다. 토스 앱(앱인토스) 미니앱 출시가 목표.

## 구성

| 경로 | 내용 |
|---|---|
| `prototypes/fortune-card.html` | 모바일 카드 프로토타입 (three.js 3D 아이콘, 셰이더 그라데이션, 오행별 라인 장식) |
| `assets/fortune-pop-v1/` | 오행 POP 키링 투명 PNG 5종, 동작 미리보기, 스프링 모션 코드, 프롬프트·매니페스트 |
| `docs/fortune-pop-style-guide.md` | 에셋 제작 방식, 오행별 구성, 스타일·파일·모션 규칙과 재생성 절차 |
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

## 오행 POP 에셋과 모션

목·화·토·금·수의 기존 실루엣을 투명 레진·크롬·비즈 키링으로 만든 에셋 탐색안이다. 각 PNG는 1122×1402 RGBA이며, 독립 미리보기에서 오행별 무게감의 흔들림과 포인터·터치·키보드 반응을 확인할 수 있다. 운세 서비스 화면에는 아직 연결하지 않았다.

레포 루트에서 서버를 실행한다. 별도 설치나 이미지 생성 API 호출은 필요 없다.

```bash
python3 -m http.server 5178
# http://localhost:5178/assets/fortune-pop-v1/
```

- [제작·스타일·모션 가이드](docs/fortune-pop-style-guide.md)
- [전체 생성 프롬프트](assets/fortune-pop-v1/prompts.json)
- [해상도·파일 크기·체크섬](assets/fortune-pop-v1/manifest.json)

| 목 | 화 | 토 | 금 | 수 |
|---|---|---|---|---|
| ![목 키링](assets/fortune-pop-v1/wood.png) | ![화 키링](assets/fortune-pop-v1/fire.png) | ![토 키링](assets/fortune-pop-v1/earth.png) | ![금 키링](assets/fortune-pop-v1/metal.png) | ![수 키링](assets/fortune-pop-v1/water.png) |
