import { axiosInstance } from "@/shared/api/axios.instance";

export interface CityItem {
  id: number;
  name: string;
  state: number;
}

export const getCitiesAction = async (): Promise<CityItem[]> => {
  try {
    const { data } = await axiosInstance.get<CityItem[]>("/catalogs/cities");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
