import {
  MapPin, GraduationCap, ShoppingBag, Hospital, Train,
  Waves, Dumbbell, Shield, ArrowUpDown, Car, Leaf, Sun,
} from "lucide-react";

export const getPOIIcon = (iconType: string) => {
  switch (iconType) {
    case "school":    return <GraduationCap className="w-4 h-4" />;
    case "shopping":  return <ShoppingBag className="w-4 h-4" />;
    case "hospital":  return <Hospital className="w-4 h-4" />;
    case "transport": return <Train className="w-4 h-4" />;
    default:          return <MapPin className="w-4 h-4" />;
  }
};

export const getAmenityIcon = (iconName: string) => {
  switch (iconName) {
    case "waves":         return <Waves className="w-5 h-5" />;
    case "dumbbell":      return <Dumbbell className="w-5 h-5" />;
    case "shield":        return <Shield className="w-5 h-5" />;
    case "arrow-up-down": return <ArrowUpDown className="w-5 h-5" />;
    case "car":           return <Car className="w-5 h-5" />;
    case "leaf":          return <Leaf className="w-5 h-5" />;
    case "sun":           return <Sun className="w-5 h-5" />;
    default:              return <MapPin className="w-5 h-5" />;
  }
};
