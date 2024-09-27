import { apiInstance } from "./index";

const eventRoot = "events";

export const events = {
  getEvents: async (params: {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number | "*";
  }) => {
    try {
      const response = await apiInstance.post(`/${eventRoot}`, params);

      const events = response.data.data;
      const total = response.data.total;

      return { data: { events, total }, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data.message || "Server error",
      };
    }
  },
};
