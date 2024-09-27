import { apiInstance } from "./index";

const participantRoot = "participants";

export const participants = {
  getParticipants: async (params: {
    name?: string;
    email?: string;
    eventId: string;
  }) => {
    try {
      const response = await apiInstance.post(`/${participantRoot}`, params);

      const participants = response.data.data;
      return { data: participants, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Server error",
      };
    }
  },

  addParticipant: async (params: {
    name: string;
    email: string;
    birthDate: string;
    whereHear: string;
    eventId: string;
  }) => {
    try {
      const response = await apiInstance.post(
        `/${participantRoot}/add`,
        params
      );

      const participant = response.data.data;
      return { data: participant, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Server error",
      };
    }
  },
};
