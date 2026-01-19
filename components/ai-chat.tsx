"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X } from "lucide-react";

const MAX_LEN = 10;

const responses = {
  greeting: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
  shipping: "Estamos ubicados en Cúcuta, Colombia. Enviamos a toda Colombia en 1-3 días hábiles. Ofrecemos pago contra entrega para que sea más seguro al recibir tus zapatos. ¡Total confianza!",
  payment: "Pagos seguros: Nequi, Bancolombia, Daviplata o contra entrega. ¿Cuál eliges?",
  products: "Zapatos premium con descuentos: 10% x2, 15% x3, 20% x4. ¿Qué talla necesitas?",
  returns: "Garantía 30 días. Si no te gusta, devolución total. ¡Compra tranquilo!",
  security: "100% seguro. Encriptación SSL y pagos protegidos. Confía en nosotros.",
  quality: "Calidad superior. Zapatos duraderos y cómodos. Miles de clientes felices.",
  urgency: "¡Stock limitado! Los mejores zapatos se agotan rápido. ¿Compramos ahora?",
  affirmation: "¡Genial! ¿Qué más quieres saber? ¿Precios, tallas o cómo comprar?",
  details: "Tenemos zapatos en negro, blanco, azul y marrón. Tallamos del 35 al 45. ¿Qué combinación te gusta?",
  buy: "¡Perfecto! Ve a la página principal y agrega al carrito. ¿Te ayudo con algo más?",
  thanks: "¡Gracias a ti! ¿Listo para comprar tus zapatos?",
  goodbye: "¡Adiós! Vuelve pronto. ¡Los zapatos te esperan!",
  default: "¡Entiendo! Nuestros zapatos cómodos y de calidad son ideales. ¿Quieres saber sobre precios, colores o cómo comprar?",
  insult: "Lamento que te sientas así. Estoy aquí para ayudarte. ¿En qué puedo servirte? 😊",
  origin: "Nuestros productos son fabricados en Colombia. ¡100% calidad garantizada! 🇨🇴",
  colors: "Tenemos disponibles los siguientes colores: negro, blanco, rojo, azul y verde. ¿Te interesa alguno en especial? 🎨",
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [vocab, setVocab] = useState<Record<string, number>>({});
  const [intents, setIntents] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<string>("initial");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar vocabulario e intents (modelo no disponible, usando solo reglas regex)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const vocabResponse = await fetch("/chat/model/vocab.json");
        const vocabData = await vocabResponse.json();
        setVocab(vocabData);

        const intentsResponse = await fetch("/chat/model/intents.json");
        const intentsData = await intentsResponse.json();
        setIntents(intentsData);
      } catch (error) {
        console.error("Error al cargar metadatos:", error);
      }
    };

    loadMetadata();
  }, []);

  // Scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tokenizar texto
  function tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean);
  }

  // Vectorizar texto
  function vectorize(text: string): number[] {
    const tokens = tokenize(text);
    const vector = new Array(MAX_LEN).fill(0);

    tokens.slice(0, MAX_LEN).forEach((word, i) => {
      vector[i] = vocab[word] || 0;
    });

    return vector;
  }

  // Predecir intent
  const predictIntent = async (text: string) => {
    const lowerText = text.toLowerCase();

    // Reglas basadas en expresiones regulares
    if (lowerText.match(/\b(hola|buenos|buenas|hey|hi|saludos|epa|qué más|qué hubo)\b/)) {
      return "greeting";
    }
    if (lowerText.match(/\b(gracias|thank|thanks|agradecido)\b/)) {
      return "thanks";
    }
    if (lowerText.match(/\b(adios|bye|chau|hasta|nos vemos)\b/)) {
      return "goodbye";
    }
    if (lowerText.match(/\b(pago|pagar|método|forma|como|nequi|bancolombia|daviplata|transferencia)\b/)) {
      return "payment";
    }
    if (lowerText.match(/\b(envio|entrega|envian|llega|tiempo|dias|cuanto|demora|ubicados|donde|tienda|local|fisico|cucuta|colombia)\b/)) {
      return "shipping";
    }
    if (lowerText.match(/\b(zapato|producto|precio|descuento|oferta)\b/)) {
      return "products";
    }
    if (lowerText.match(/\b(talla|color|estilo|modelo|disponible|hay|qué|de qué color|colores)\b/)) {
      return "details";
    }
    if (lowerText.match(/\b(devolucion|retorno|garantia|cambio|problema|defecto|no gusta)\b/)) {
      return "returns";
    }
    if (lowerText.match(/\b(seguro|seguridad|protegido|confiable|encriptacion|ssl|fraude)\b/)) {
      return "security";
    }
    if (lowerText.match(/\b(calidad|duradero|comodo|bueno|premium|superior|material)\b/)) {
      return "quality";
    }
    if (lowerText.match(/\b(stock|limitado|agotado|rapido|ahora|urgente|prisa)\b/)) {
      return "urgency";
    }
    if (lowerText.match(/\b(si|yes|claro|por supuesto|ok|vale|bueno|perfecto|genial|excelente|bien|me gusta|gusta|interesante)\b/)) {
      return "affirmation";
    }
    if (lowerText.match(/\b(comprar|carrito|pedido|orden|quiero|necesito|listo|me gusta|gusta|blanco|negro|azul|marrón|talla|si|claro|perfecto|genial|excelente)\b/)) {
      return "buy";
    }
    if (lowerText.match(/\b(malparido|ladrón|hp|gonorrea|maldito|no sea malparido|no joda|no sea sapo)\b/)) {
      return "insult";
    }
    if (lowerText.match(/\b(de dónde|dónde|origen|fabrican|colombia|importado|país|hechos)\b/)) {
      return "origin";
    }
    if (lowerText.match(/\b(color|colores|qué color|tienen color|negro|blanco|rojo|azul|verde)\b/)) {
      return "colors";
    }

    return "default";
  };

  // Manejar envío de mensaje
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const intent = await predictIntent(input);
    let response = responses[intent as keyof typeof responses] || responses.default;

    // Lógica contextual
    if (intent === "affirmation") {
      if (conversationState === "awaiting_topic") {
        response = "¡Genial! Te cuento sobre nuestros zapatos premium con descuentos: 10% x2, 15% x3, 20% x4. ¿Qué talla buscas?";
        setConversationState("products_mentioned");
      } else if (conversationState === "products_mentioned") {
        response = "¡Excelente! ¿Quieres que te ayude a elegir talla o ver opciones?";
      }
    } else if (intent === "greeting") {
      setConversationState("awaiting_topic");
    } else if (intent === "products") {
      setConversationState("products_mentioned");
    } else if (intent === "details") {
      setConversationState("details_given");
    } else if (intent === "buy") {
      if (conversationState === "details_given") {
        response = "¡Perfecto! Los zapatos blancos son ideales. ¿Quieres proceder con la compra?";
      }
      setConversationState("ready_to_buy");
    }

    // Simulate typing delay based on response length
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, Math.max(1000, response.length * 20)); // 1-3 seconds based on length
  };

  // Abrir WhatsApp
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola, vi su sitio web y quiero más información sobre los zapatos.");
    window.open(`https://wa.me/57300975612?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1">
            Online
          </Badge>
        </Button>
      </div>

      {/* Diálogo del chat */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <div
            onClick={() => {
              const message = encodeURIComponent("Hola, quiero hablar directamente con el gerente sobre los zapatos.");
              window.open(`https://wa.me/57300975612?text=${message}`, "_blank");
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-t-lg text-center cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-300 animate-pulse hover:animate-none shadow-lg hover:shadow-xl -mx-6 -mt-6 mb-4"
          >
            💬 ¡Haz clic aquí para hablar con el gerente por WhatsApp!
          </div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Asistente Virtual
              <Badge variant="outline" className={`border-green-600 ${isTyping ? 'text-orange-600 animate-pulse' : 'text-green-600'}`}>
                {isTyping ? 'Escribiendo...' : 'Online'}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {conversationState === "ready_to_buy" && (
            <div className="p-4 border-t">
              <Button onClick={handleWhatsApp} className="w-full bg-green-500 hover:bg-green-600">
                Continuar en WhatsApp
              </Button>
            </div>
          )}

          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
