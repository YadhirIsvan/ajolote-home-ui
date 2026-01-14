import { useState } from "react";
import { Check, ChevronLeft, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PipelineActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: number;
  stageName: string;
  onAdvance: (note: string) => void;
  onRevert: (note: string) => void;
  isMobile?: boolean;
}

const PipelineActionSheet = ({
  isOpen,
  onClose,
  currentStage,
  stageName,
  onAdvance,
  onRevert,
  isMobile = false,
}: PipelineActionSheetProps) => {
  const [note, setNote] = useState("");

  const handleAdvance = () => {
    onAdvance(note);
    setNote("");
    onClose();
  };

  const handleRevert = () => {
    onRevert(note);
    setNote("");
    onClose();
  };

  const content = (
    <div className="space-y-6">
      {/* Status Note */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-midnight">
          <MessageSquare className="w-4 h-4 text-champagne-gold" />
          Nota de Estado (Opcional)
        </label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe el motivo del cambio..."
          className="min-h-[100px] border-slate-200 focus:border-champagne-gold focus:ring-champagne-gold/20 bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleRevert}
          disabled={currentStage <= 1}
          className="min-h-[52px] border-slate-200 hover:border-champagne-gold hover:bg-champagne-gold/5 text-midnight disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Regresar Etapa
        </Button>
        <Button
          variant="gold"
          onClick={handleAdvance}
          disabled={currentStage >= 9}
          className="min-h-[52px]"
        >
          <Check className="w-5 h-5 mr-2" />
          Completado
        </Button>
      </div>

      <p className="text-xs text-center text-foreground/50">
        Los cambios se guardarán automáticamente
      </p>
    </div>
  );

  // Use Drawer (bottom sheet) on mobile for better UX
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="px-4 pb-8 bg-white">
          <DrawerHeader className="text-left pt-6 pb-2">
            <DrawerTitle className="text-xl font-bold text-midnight">
              Etapa: {stageName}
            </DrawerTitle>
            <DrawerDescription className="text-foreground/60">
              Etapa actual: {currentStage} de 9
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Use Dialog on desktop
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-midnight">
            Etapa: {stageName}
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            Etapa actual: {currentStage} de 9
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineActionSheet;
