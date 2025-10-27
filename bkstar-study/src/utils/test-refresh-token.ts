/**
 * Test utility để kiểm tra cơ chế refresh token
 * Sử dụng để debug và test API endpoint /login/get_new_token/
 */

export const testRefreshToken = async (refreshToken: string) => {
    try {
        console.log("Testing refresh token...");
        console.log("Refresh token:", refreshToken);

        const response = await fetch(
            // "https://b1u9y178ok.execute-api.ap-southeast-1.amazonaws.com/login/get_new_token/",
            "http://localhost:3000/api/auth/refresh/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Refresh token failed:", errorText);
            return {
                success: false,
                error: errorText,
                status: response.status,
            };
        }

        const data = await response.json();
        console.log("Refresh token success:", data);

        return {
            success: true,
            data,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        };
    } catch (error) {
        console.error("Error testing refresh token:", error);
        return { success: false, error: error };
    }
};

export const testTokenExpiry = (token: string) => {
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);

        console.log("Token expiry analysis:");
        console.log(
            "Current time:",
            new Date(currentTime * 1000).toISOString()
        );
        console.log(
            "Token expires:",
            new Date(decoded.exp * 1000).toISOString()
        );
        console.log("Time until expiry:", timeUntilExpiry, "seconds");
        console.log("Minutes until expiry:", minutesUntilExpiry);
        console.log("Is expiring soon (<5 min):", timeUntilExpiry < 300);

        return {
            currentTime,
            expiryTime: decoded.exp,
            timeUntilExpiry,
            minutesUntilExpiry,
            isExpiringSoon: timeUntilExpiry < 300,
        };
    } catch (error) {
        console.error("Error analyzing token:", error);
        return null;
    }
};
