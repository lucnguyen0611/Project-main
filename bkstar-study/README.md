# Exam Management System

Hệ thống quản lý bài thi và lớp học thông minh.

## Tính năng đã phát triển

### 1. Màn hình Đăng nhập

-   **Mục tiêu**: Người dùng nhập email & password để nhận token đăng nhập
-   **Luồng hoạt động**:
    1. Người dùng nhập email và mật khẩu
    2. FE gọi API POST /login/ gửi thông tin
    3. BE trả về access_token, refresh_token và thông tin user
    4. FE lưu token vào cookie (httpOnly + secure)
    5. Điều hướng vào trang chính theo role
-   **Tính năng nâng cao**:
    -   Remember Me (lưu email 30 ngày)
    -   Auto-fill email từ remember me
    -   Loading states và error handling
    -   Form validation real-time

### 2. Màn hình Đăng ký

-   **Mục tiêu**: Người dùng tạo tài khoản mới
-   **Luồng hoạt động**:
    1. Người dùng nhập thông tin đăng ký
    2. Gửi API POST /master/user/ để tạo tài khoản
    3. Nếu thành công → điều hướng sang login
-   **Tính năng nâng cao**:
    -   Role selection (student/teacher)
    -   Password confirmation
    -   Real-time validation
    -   Loading states và error handling

### 3. Auto Token Refresh

-   **Mục tiêu**: Tự động refresh token khi sắp hết hạn
-   **Luồng hoạt động**:
    1. Kiểm tra token expiration trước mỗi request
    2. Nếu token < 5 phút → gọi API refresh
    3. Cập nhật token mới và retry request
    4. Nếu refresh thất bại → logout và redirect

### 4. Logout & Remember Me

-   **Logout**: Xóa token, clear state, redirect login
-   **Remember Me**: Lưu email 30 ngày, extended token validity

### 5. Quản lý lớp học

-   **Danh sách lớp**: Hiển thị tất cả lớp học với thông tin chi tiết
-   **Tạo lớp**: Chỉ teacher/admin có quyền tạo lớp mới
-   **Tìm kiếm**: Debounce search với real-time filtering
-   **Role-based UI**: Ẩn/hiện nút tạo lớp theo role

### 6. Cập nhật thông tin cá nhân

-   **Profile Update**: Cập nhật thông tin cá nhân (email không sửa được)
-   **Change Password**: Đổi mật khẩu với Base64 encoding
-   **Validation**: Real-time validation cho tất cả fields
-   **Toast Notifications**: Thông báo thành công/thất bại

## API Endpoints

### Authentication

-   `POST /login/` - Đăng nhập
-   `POST /master/user/` - Đăng ký
-   `POST /login/get_new_token/` - Refresh token
-   `POST /logout/` - Đăng xuất

### Class Management

-   `GET /master/class/` - Lấy danh sách lớp học
-   `POST /master/class/` - Tạo lớp học mới
-   `PUT /master/class/{id}/` - Cập nhật lớp học
-   `DELETE /master/class/{id}/` - Xóa lớp học

### User Profile

-   `GET /master/user/{id}/` - Lấy thông tin user
-   `PUT /master/user/{id}/` - Cập nhật thông tin user
-   `POST /master/user/change_password/` - Đổi mật khẩu

### API Base URL

-   Production: `https://b1u9y178ok.execute-api.ap-southeast-1.amazonaws.com`
-   Development: `http://localhost:8000/api`

## Cấu trúc dự án

```
src/
├── api/                    # API layer
│   ├── axios.ts           # Cấu hình Axios với interceptors
│   ├── auth.api.ts        # API authentication
│   ├── class.api.ts       # API class management
│   ├── user.api.ts        # API user profile
│   └── index.ts
├── components/            # UI Components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── class/
│   │   └── CreateClassForm.tsx
│   ├── user/
│   │   └── ChangePasswordForm.tsx
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── ErrorBoundary.tsx
│   └── index.ts
├── config/               # Cấu hình
│   └── api.config.ts
├── constants/            # Hằng số
│   ├── routes.ts
│   └── api.constants.ts
├── contexts/             # React Contexts
│   ├── AuthContext.tsx
│   └── index.ts
├── pages/               # Pages
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── class/
│   │   └── ClassListPage.tsx
│   ├── user/
│   │   └── UserProfilePage.tsx
│   ├── NotFoundPage.tsx
│   └── index.ts
├── routes/              # Routing
│   ├── AppRoutes.tsx    # Main router configuration
│   └── RouteGuards.tsx  # Route protection components
├── types/               # TypeScript types
│   ├── auth.types.ts
│   ├── class.types.ts
│   ├── user.types.ts
│   └── index.ts
├── utils/               # Utilities
│   ├── storage.utils.ts
│   ├── validation.utils.ts
│   ├── jwt.utils.ts
│   ├── encoding.utils.ts
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Cài đặt và chạy

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy development server:

```bash
npm run dev
```

3. Mở trình duyệt và truy cập: `http://localhost:5173`

## Cấu hình môi trường

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Tính năng bảo mật

-   **Token Management**: Sử dụng js-cookie với secure flags
-   **Auto Refresh**: Tự động refresh token khi < 5 phút hết hạn
-   **JWT Decode**: Giải mã token để lấy thông tin user
-   **Remember Me**: Lưu email 30 ngày với secure cookies
-   **Validation**: Validation client-side cho tất cả forms
-   **Error Handling**: Xử lý lỗi tập trung và user-friendly
-   **Role-based UI**: Ẩn/hiện nút "Tạo lớp" theo role teacher

## Validation Rules

### Email

-   Phải có định dạng email hợp lệ

### Password

-   Ít nhất 8 ký tự
-   Phải có ít nhất 1 chữ hoa
-   Phải có ít nhất 1 chữ thường
-   Phải có ít nhất 1 số

### Name

-   Ít nhất 2 ký tự
-   Không quá 50 ký tự

## Tech Stack

-   **Frontend**: React 19 + TypeScript
-   **UI Library**: Material-UI (MUI)
-   **Routing**: React Router v7
-   **HTTP Client**: Axios
-   **Build Tool**: Vite
-   **State Management**: React Context API

## Cấu trúc Authentication

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    role: "teacher" | "student" | "admin";
    status: "active" | "inactive" | "confirming";
}

interface LoginResponse {
    access: string; // JWT access token
    refresh: string; // JWT refresh token
    user: User;
}
```

## Luồng Authentication

1. **Login**: User nhập credentials → API call → Lưu tokens → Redirect theo role
2. **Token Refresh**: Axios interceptor tự động refresh khi 401
3. **Logout**: Clear tokens → Redirect to login
4. **Route Protection**: Kiểm tra authentication trước khi vào protected routes
