# GitHub Copilot Instructions — React + Vite + TypeScript

## Context
- SPA chạy bằng **Vite**, **React 18+**, **TypeScript strict**.
- Ưu tiên: component nhỏ, typed chặt, A11y tốt, hiệu năng ổn (code-splitting, memo hóa).
- Thư viện mặc định: React Router, Testing Library + Vitest. (Zustand tùy chọn; nếu không nêu thì KHÔNG tạo store.)

## Cách bạn (Copilot) phản hồi
- Trả về **code hoàn chỉnh** kèm import chính xác; không giả định thư viện ngoài nếu chưa đề cập.
- Giải thích ngắn gọn (≤4 dòng) cho quyết định kiến trúc/hiệu năng khi cần.
- Mặc định dùng **CSS Modules** và alias `@` → `src`.

## Cấu trúc thư mục
src/
app/ # App shell, providers, router, error boundary
pages/ # Route-level components (default export)
components/ # Reusable UI components (named exports)
features/ # Vertical slices (nếu có)
hooks/ # Reusable hooks
services/ # API wrapper, endpoints, adapters
lib/ # utils, types, constants, schemas
styles/ # global.css / variables
test/ # test utils (render, mocks)


## Quy tắc TypeScript
- `strict: true`; tránh `any` → ưu tiên `unknown` + type guards.
- Đặt tên: `PascalCase` (Component/Type), `camelCase` (biến/hàm), file `kebab-case.tsx`.
- Khai báo `type Props = { ... }`; đặt default value **trong** body component.
- **Default export** chỉ dùng cho `pages`; nơi khác dùng **named export**.

## React & A11y
- Functional components + hooks; hạn chế context, chỉ dùng khi state thực sự global.
- Tối ưu re-render bằng `React.memo`, `useMemo`, `useCallback` **khi có lợi ích đo được**.
- Sử dụng HTML semantic, `aria-*`, label-for input, focus management cho modal/dialog.

## Routing
- Dùng **react-router v6+**; code-splitting với `React.lazy` + `Suspense` ở route-level.
- Không fetch dữ liệu trong constructor; xử lý trong hooks/services.

## Data & API
- Tạo **wrapper `api.ts`** dùng `fetch` (JSON). Ném `ApiError(status, data)` với non-2xx.
- Phân tách **DTO ↔ domain** bằng adapter khi cần.
- Không lưu **server state** vào global store trừ khi có lý do rõ ràng.

## State (tuỳ chọn Zustand)
- Nếu dùng Zustand: mỗi feature một slice, export **selectors**; luôn dùng `useStore(selector)` thay vì lấy toàn store.

## UI & Styles
- Mặc định dùng **CSS Modules**; class `kebab-case`.
- Tránh style inline nặng; ưu tiên class.

## Testing
- **Vitest + Testing Library**: query theo role/text; hạn chế snapshot lớn.
- Test hooks/utils riêng; component quan trọng có test interaction.

## Mặc định khi yêu cầu mơ hồ
- Dùng `fetch` wrapper, CSS Modules, không thêm lib mới.
- Không tạo Redux/Context/Zustand nếu không yêu cầu.
- Tạo file ở đúng thư mục trong cấu trúc ở trên.

## Ví dụ

### `src/services/api.ts`
```ts
export class ApiError extends Error {
  constructor(public status: number, public data?: unknown) { super(`HTTP ${status}`); }
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
  let data: unknown = undefined;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
