# Maru UI Docs

[Fumadocs](https://github.com/fuma-nama/fumadocs) 기반 문서 사이트입니다.

## 실행

```bash
# 루트에서
pnpm docs:dev

# 또는 docs에서
pnpm dev
```

개발 서버: http://localhost:3001

## 빌드

```bash
pnpm docs:build
# 또는
cd docs && pnpm build
```

## 콘텐츠

- MDX 파일: `content/docs/`
- 사이드바 구조: `content/docs/meta.json`의 `pages` 배열로 정의
