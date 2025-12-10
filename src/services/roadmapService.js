import api from '../utils/api';

export const optionCareer = {
    getOptionsCareer: async () => {
        try {
            const response = await api.get('/roadmap/option');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};