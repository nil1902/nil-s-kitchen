import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface CodPaymentFormProps {
  onSubmit: () => void;
  amount: number;
  isProcessing?: boolean;
}

const CodPaymentForm: React.FC<CodPaymentFormProps> = ({
  onSubmit,
  amount,
  isProcessing = false,
}) => {
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptchaCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 180;
    const height = 50;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    ctx.font = "bold 28px Arial";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 20 + i * 25;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 60%, 30%)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCaptchaCode();
    setCaptchaImage(newCode);
    drawCaptcha(newCode);
    setCaptcha("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captcha === captchaImage) {
      onSubmit();
    } else {
      alert("Invalid captcha. Please try again.");
      refreshCaptcha();
    }
  };

  const handlingFee = 10;
  const totalAmount = amount + handlingFee;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
        <p className="text-amber-800">
          Due to handling costs, a nominal fee of ₹{handlingFee} will be charged
        </p>
      </div>

      {/* Captcha Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <canvas
            ref={canvasRef}
            className="rounded-md border border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={refreshCaptcha}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Refresh Captcha"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <Input
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          placeholder="Enter the characters"
          required
          className="flex-1"
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-6 text-lg transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing COD Order...
            </div>
          ) : (
            "Confirm Cash on Delivery Order"
          )}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center pt-2">
        Pay ₹{totalAmount.toFixed(2)} by cash when your order is delivered
      </div>
    </form>
  );
};

export default CodPaymentForm;