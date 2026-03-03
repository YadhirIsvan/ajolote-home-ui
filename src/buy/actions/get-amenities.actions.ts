import { axiosInstance } from "@/shared/api/axios.instance";

export interface AmenityItem {
  id: number;
  name: string;
  icon: string;
}

export const getAmenitiesAction = async (): Promise<AmenityItem[]> => {
  try {
    const { data } = await axiosInstance.get<AmenityItem[]>("/catalogs/amenities");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
