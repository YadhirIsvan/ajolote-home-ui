import { axiosInstance } from "@/shared/api/axios.instance";

export interface CityItem {
  id: number;
  name: string;
  state: number;
}

// Decisión de diseño: devuelve [] en lugar de lanzar error porque la lista de
// ciudades es un catálogo de UI opcional — su ausencia no rompe ningún flujo crítico.
export const getCitiesAction = async (): Promise<CityItem[]> => {
  try {
    const { data } = await axiosInstance.get<CityItem[]>("/catalogs/cities");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[getCitiesAction] Error al obtener catálogo de ciudades:", error);
    return [];
  }
};
