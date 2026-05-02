import { useState } from "react";
import {
  Home,
  User,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  Eye,
  Download,
  Search,
  Filter,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { useAdminHistorial } from "@/myAccount/admin/hooks/use-admin-historial.admin.hook";
import type { AdminSaleHistoryItem } from "@/myAccount/admin/types/admin.types";

interface SoldProperty {
  id: string;
  property: string;
  type: string;
  client: string;
  clientEmail: string;
  agent: string;
  price: string;
  priceNum: number;
  location: string;
  zone: string;
  soldDate: string;
  daysToSell: number;
  paymentMethod: string;
  documents: string[];
  closedBy: string;
  closedAt: string;
}

const mapHistoryItem = (item: AdminSaleHistoryItem): SoldProperty => ({
  id: String(item.id),
  property: item.property.title,
  type: item.property.propertyType,
  client: item.client.name,
  clientEmail: "",
  agent: item.agent.name,
  price: `$${Number(item.salePrice).toLocaleString("es-MX")}`,
  priceNum: Number(item.salePrice) || 0,
  location: item.property.zone,
  zone: item.property.zone,
  soldDate: item.closedAt?.split("T")[0] ?? "",
  daysToSell: 0,
  paymentMethod: item.paymentMethod,
  documents: [],
  closedBy: item.agent.name,
  closedAt: item.closedAt?.split("T")[0] ?? "",
});

const HistorialSection = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { historyQuery, results } = useAdminHistorial();

  const soldProperties: SoldProperty[] = results.map(mapHistoryItem);

  const zones = [...new Set(soldProperties.map(p => p.zone))].filter(Boolean);
  const types = [...new Set(soldProperties.map(p => p.type))].filter(Boolean);

  const filteredProperties = soldProperties.filter(property => {
    const matchesSearch =
      property.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = filterZone === "all" || property.zone === filterZone;
    const matchesPayment = filterPayment === "all" || property.paymentMethod.includes(filterPayment);
    const matchesType = filterType === "all" || property.type === filterType;

    return matchesSearch && matchesZone && matchesPayment && matchesType;
  });

  const clearFilters = () => {
    setFilterZone("all");
    setFilterPayment("all");
    setFilterType("all");
    setSearchTerm("");
  };

  const hasActiveFilters = filterZone !== "all" || filterPayment !== "all" || filterType !== "all" || searchTerm !== "";

  const PropertyCard = ({ property }: { property: SoldProperty }) => (
    <Card className="border-border/30 hover:border-champagne-gold/50 hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-midnight">{property.property}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{property.type}</Badge>
                  <span className="text-sm text-foreground/60">{property.location}</span>
                </div>
              </div>
              <span className="text-xl font-bold text-champagne-gold">{property.price}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-champagne-gold" />
                <div>
                  <p className="text-foreground/50 text-xs">Cliente</p>
                  <p className="font-medium text-midnight truncate">{property.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-foreground/50 text-xs">Agente</p>
                  <p className="font-medium text-midnight">{property.agent}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-foreground/50 text-xs">Vendido</p>
                  <p className="font-medium text-midnight">{property.soldDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-foreground/50 text-xs">Método</p>
                  <p className="font-medium text-midnight text-xs">{property.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-midnight">
                    {property.property}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="p-4 bg-gradient-to-r from-champagne-gold/10 to-transparent rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge>{property.type}</Badge>
                        <p className="text-sm text-foreground/60 mt-1">{property.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-champagne-gold">{property.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-foreground/60 flex items-center gap-2">
                          <User className="w-4 h-4 text-champagne-gold" />
                          Cliente
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold text-midnight">{property.client}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-foreground/60 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Agente Asignado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold text-midnight">{property.agent}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/30 rounded-xl text-center">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-champagne-gold" />
                      <p className="text-xs text-foreground/60">Fecha de Venta</p>
                      <p className="font-semibold text-sm">{property.soldDate}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl text-center">
                      <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-foreground/60">Método de Pago</p>
                      <p className="font-semibold text-xs">{property.paymentMethod}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl text-center">
                      <MapPin className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-foreground/60">Zona</p>
                      <p className="font-semibold text-sm">{property.zone}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl text-center">
                      <Home className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <p className="text-xs text-foreground/60">Cierre</p>
                      <p className="font-semibold text-sm">{property.closedAt}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-midnight/5 rounded-xl">
                    <p className="text-xs text-foreground/60 mb-2">Registro de Auditoría</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-midnight">Cerrado por: {property.closedBy}</p>
                        <p className="text-xs text-foreground/60">Fecha de cierre: {property.closedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Historial de Ventas</h1>
        <p className="text-foreground/60">Registro completo de propiedades vendidas</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <Input
              placeholder="Buscar por propiedad, cliente o agente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-champagne-gold/10 border-champagne-gold")}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge className="ml-2 bg-champagne-gold text-white text-xs px-1.5">
                  {[filterZone !== "all", filterPayment !== "all", filterType !== "all"].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          )}

          {!isMobile && (
            <>
              <Select value={filterZone} onValueChange={setFilterZone}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las zonas</SelectItem>
                  {zones.map(zone => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Crédito">Crédito</SelectItem>
                  <SelectItem value="Contado">Contado</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>

        {isMobile && showFilters && (
          <Card className="border-champagne-gold/30">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select value={filterZone} onValueChange={setFilterZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las zonas</SelectItem>
                    {zones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Método de Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="Crédito">Crédito Hipotecario</SelectItem>
                  <SelectItem value="Contado">Contado</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          {historyQuery.isLoading ? "Cargando..." : `${filteredProperties.length} propiedades vendidas`}
        </p>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar Lista
        </Button>
      </div>

      <div className="space-y-4">
        {historyQuery.isLoading ? (
          <Card className="border-border/30">
            <CardContent className="p-12 text-center">
              <p className="text-foreground/60">Cargando historial...</p>
            </CardContent>
          </Card>
        ) : filteredProperties.length === 0 ? (
          <Card className="border-border/30">
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
              <p className="text-foreground/60">No se encontraron propiedades con los filtros seleccionados</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialSection;
