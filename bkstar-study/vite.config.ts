// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// // https://vite.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, "./src"),
//         },
//     },
// });



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,      // 👈 Cho phép truy cập từ bên ngoài container (0.0.0.0)
        port: 5173,      // 👈 Đảm bảo trùng với port bạn map trong docker-compose
        strictPort: true // 👈 Không tự động đổi sang cổng khác nếu bị chiếm
    }
});