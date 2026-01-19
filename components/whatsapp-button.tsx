"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola, quiero más información sobre los zapatos.");
    window.open(`https://wa.me/57300975612?text=${message}`, "_blank");
  };

  return (
    <div className="flex justify-center py-8">
      <Button
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg animate-pulse hover:animate-none transition-all duration-300"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Habla con nosotros por WhatsApp
      </Button>
    </div>
  );
}