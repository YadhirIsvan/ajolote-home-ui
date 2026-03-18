import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Clock,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppointmentType {
  id: string;
  name: string;
  duration: number; // in minutes
  color: string;
  description: string;
}

const colorOptions = [
  { value: "blue", className: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "green", className: "bg-green-100 text-green-700 border-green-200" },
  { value: "gold", className: "bg-champagne-gold/20 text-champagne-gold-dark border-champagne-gold/30" },
  { value: "purple", className: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "orange", className: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "red", className: "bg-red-100 text-red-700 border-red-200" },
];

const mockTypes: AppointmentType[] = [
  { id: "1", name: "Primera Visita", duration: 60, color: "blue", description: "Primera visita del cliente a la propiedad" },
  { id: "2", name: "Seguimiento", duration: 30, color: "green", description: "Llamada o visita de seguimiento" },
  { id: "3", name: "Cierre de Contrato", duration: 90, color: "gold", description: "Firma de contrato de compraventa" },
  { id: "4", name: "Entrega de Llaves", duration: 45, color: "purple", description: "Entrega oficial de la propiedad" },
  { id: "5", name: "Avalúo", duration: 120, color: "orange", description: "Visita del valuador a la propiedad" },
];

const ConfigCitasSection = () => {
  const isMobile = useIsMobile();
  const [types, setTypes] = useState<AppointmentType[]>(mockTypes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 60,
    color: "blue",
    description: "",
  });

  const handleEdit = (type: AppointmentType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      duration: type.duration,
      color: type.color,
      description: type.description,
    });
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingType(null);
    setFormData({
      name: "",
      duration: 60,
      color: "blue",
      description: "",
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingType) {
      setTypes(prev => prev.map(t => 
        t.id === editingType.id 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      setTypes(prev => [...prev, { id: Date.now().toString(), ...formData }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setTypes(prev => prev.filter(t => t.id !== id));
  };

  const getColorClass = (color: string) => {
    return colorOptions.find(c => c.value === color)?.className || colorOptions[0].className;
  };

  const FormContent = () => (
    <div className="space-y-5 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Tipo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ej: Primera Visita"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duración (minutos)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
              className={cn(
                "w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center",
                color.className,
                formData.color === color.value ? "ring-2 ring-midnight ring-offset-2" : ""
              )}
            >
              {formData.color === color.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción breve..."
          className="h-12"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Tipos de Cita</h1>
          <p className="text-foreground/60">Configura los tipos de citas disponibles</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Nuevo Tipo
        </Button>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => (
          <Card key={type.id} className="border-border/50 hover:border-champagne-gold/50 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <Badge className={getColorClass(type.color)}>
                  <Tag className="w-3 h-3 mr-1" />
                  {type.name}
                </Badge>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-foreground/60 hover:text-midnight"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-foreground/60 mb-4">{type.description}</p>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-champagne-gold" />
                <span className="font-medium text-midnight">{type.duration} minutos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingType ? "Editar Tipo" : "Nuevo Tipo"}</DrawerTitle>
            </DrawerHeader>
            <FormContent />
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSave} className="w-full h-12">
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingType ? "Editar Tipo" : "Nuevo Tipo"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ConfigCitasSection;
