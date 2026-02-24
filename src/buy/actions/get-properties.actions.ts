import buyApi, { ENDPOINTS } from "@/buy/api/buy.api";
import type { BuyPropertyListItem, GetPropertiesParams } from "@/buy/types/property.types";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface GetPropertiesResponse {
  data: BuyPropertyListItem[];
  fromFallback: boolean;
}

const FALLBACK_PROPERTIES: BuyPropertyListItem[] = [
  { id: 1,  image: property1, price: "$4,500,000",  priceNum: 4500000,  title: "Casa Moderna en Zona Residencial",       address: "Orizaba, Veracruz",  beds: 3, baths: 2, sqm: 180, type: "casa",         state: "nueva"    },
  { id: 2,  image: property2, price: "$6,800,000",  priceNum: 6800000,  title: "Departamento de Lujo con Vista Panorámica", address: "Córdoba, Veracruz",  beds: 2, baths: 2, sqm: 145, type: "departamento", state: "preventa" },
  { id: 3,  image: property3, price: "$12,500,000", priceNum: 12500000, title: "Villa con Jardín Amplio",                address: "Fortín, Veracruz",   beds: 4, baths: 3, sqm: 320, type: "casa",         state: "usada"    },
  { id: 4,  image: property1, price: "$3,200,000",  priceNum: 3200000,  title: "Casa Colonial Restaurada",             address: "Peñuela, Veracruz",  beds: 4, baths: 3, sqm: 220, type: "casa",         state: "usada"    },
  { id: 5,  image: property2, price: "$5,900,000",  priceNum: 5900000,  title: "Penthouse Contemporáneo",              address: "Amatlán, Veracruz",  beds: 3, baths: 3, sqm: 200, type: "departamento", state: "nueva"    },
  { id: 6,  image: property3, price: "$8,500,000",  priceNum: 8500000,  title: "Residencia con Alberca",               address: "Río Blanco, Veracruz", beds: 5, baths: 4, sqm: 380, type: "casa",       state: "preventa" },
  { id: 7,  image: property1, price: "$2,800,000",  priceNum: 2800000,  title: "Departamento en Torre Premium",        address: "Nogales, Veracruz",  beds: 2, baths: 2, sqm: 120, type: "departamento", state: "usada"    },
  { id: 8,  image: property2, price: "$7,200,000",  priceNum: 7200000,  title: "Casa Minimalista con Jardín",          address: "Orizaba, Veracruz",  beds: 3, baths: 2, sqm: 250, type: "casa",         state: "nueva"    },
  { id: 9,  image: property3, price: "$15,000,000", priceNum: 15000000, title: "Mansión con Vista Panorámica",         address: "Córdoba, Veracruz",  beds: 6, baths: 5, sqm: 500, type: "casa",         state: "nueva"    },
  { id: 10, image: property1, price: "$4,100,000",  priceNum: 4100000,  title: "Loft Industrial Remodelado",           address: "Fortín, Veracruz",   beds: 2, baths: 1, sqm: 140, type: "departamento", state: "usada"    },
  { id: 11, image: property2, price: "$9,500,000",  priceNum: 9500000,  title: "Casa en Condominio Exclusivo",         address: "Orizaba, Veracruz",  beds: 4, baths: 3, sqm: 300, type: "casa",         state: "preventa" },
  { id: 12, image: property3, price: "$5,600,000",  priceNum: 5600000,  title: "Residencia Ecológica",                 address: "Amatlán, Veracruz",  beds: 3, baths: 2, sqm: 190, type: "casa",         state: "nueva"    },
];

export const getPropertiesAction = async (
  params: GetPropertiesParams
): Promise<GetPropertiesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.zone) searchParams.set("zone", params.zone);
  if (params.type) searchParams.set("type", params.type);
  if (params.state) searchParams.set("state", params.state);
  if (params.amenities?.length) {
    params.amenities.forEach((a) => searchParams.append("amenities", a));
  }
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.offset != null) searchParams.set("offset", String(params.offset));

  try {
    const url = `${ENDPOINTS.PROPERTIES}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const { data } = await buyApi.get<BuyPropertyListItem[]>(url);
    return { data, fromFallback: false };
  } catch {
    const zone = params.zone;
    const filtered = FALLBACK_PROPERTIES.filter((p) => {
      const matchZone = !zone || p.address.includes(zone);
      const matchType = !params.type || params.type === "all" || p.type === params.type;
      const matchState = !params.state || params.state === "all" || p.state === params.state;
      return matchZone && matchType && matchState;
    });

    return {
      data: filtered.length ? filtered : FALLBACK_PROPERTIES,
      fromFallback: true,
    };
  }
};
