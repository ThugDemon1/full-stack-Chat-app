import axios from "axios";

const ZEROBOUNCE_API_KEY = "240ab0f77523405785ef72fcb617c189"; // Replace with your actual API key

export const verifyGmailExists = async (email) => {
    try {
        const response = await axios.get(
            `https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`
        );

        return response.data.status === "valid";
    } catch (error) {
        console.error("Error verifying email:", error.message);
        return false;
    }
};
