import baseAPIClient from "./BaseAPIClient";

const getNotifications = async (userId: string) => {
    try {
        const { data } = await baseAPIClient.get(`/notifications?user=${userId}`);
        return data;
    } catch(error) {
        return []
    }
}

export {
    getNotifications
};