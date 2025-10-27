// Test login functionality
export const testLogin = async () => {
    const testData = {
        email: "admin12345@gmail.com",
        password: "admin123",
    };

    try {
        const response = await fetch(
            "https://b1u9y178ok.execute-api.ap-southeast-1.amazonaws.com/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testData),
            }
        );

        const data = await response.json();
        console.log("Login response:", data);

        if (response.ok) {
            console.log("Login successful!");
            console.log("Access token:", data.access);
            console.log("Refresh token:", data.refresh);
            return data;
        } else {
            console.log("Login failed:", data);
            return null;
        }
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
};
