import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const SigmoidKernel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gamma, setGamma] = useState([0.1]);
  const [testBMI, setTestBMI] = useState(25);
  const [testBP, setTestBP] = useState(120);
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    drawVisualization();
  }, [gamma]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Draw axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Axes labels
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.fillText("BMI", width / 2 - 10, height - 10);
    ctx.save();
    ctx.translate(15, height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Blood Pressure (mmHg)", 0, 0);
    ctx.restore();

    // Draw grid
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw S-shaped sigmoid boundary regions
    const drawSigmoidCurve = (startX: number, startY: number, endX: number, endY: number, curvature: number) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const sigmoid = 1 / (1 + Math.exp(-curvature * (t - 0.5) * 10));
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * sigmoid;
        ctx.lineTo(x, y);
      }
      return ctx;
    };

    // Fill low risk region (purple/lower-left)
    ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    const curve1 = drawSigmoidCurve(padding, height - padding, width - padding, padding, gamma[0] * 2);
    ctx.lineTo(padding, padding);
    ctx.closePath();
    ctx.fill();

    // Fill high risk region (yellow/upper-right)
    ctx.fillStyle = "rgba(234, 179, 8, 0.15)";
    ctx.beginPath();
    ctx.moveTo(width - padding, height - padding);
    const curve2 = drawSigmoidCurve(padding, height - padding, width - padding, padding, gamma[0] * 2);
    ctx.lineTo(width - padding, padding);
    ctx.closePath();
    ctx.fill();

    // Draw S-shaped decision boundary
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 3;
    drawSigmoidCurve(padding, height - padding, width - padding, padding, gamma[0] * 2);
    ctx.stroke();

    // Draw margin boundaries (parallel S-curves)
    ctx.strokeStyle = "#6B7280";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Upper margin
    ctx.beginPath();
    ctx.moveTo(padding, height - padding + 20);
    drawSigmoidCurve(padding, height - padding + 20, width - padding, padding + 20, gamma[0] * 2);
    ctx.stroke();
    
    // Lower margin
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - 20);
    drawSigmoidCurve(padding, height - padding - 20, width - padding, padding - 20, gamma[0] * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Generate low risk points (purple - lower-left)
    const lowRiskPoints = [
      { x: 0.2, y: 0.2 },
      { x: 0.3, y: 0.25 },
      { x: 0.25, y: 0.15 },
      { x: 0.35, y: 0.3 },
      { x: 0.15, y: 0.25 },
      { x: 0.4, y: 0.35 },
      { x: 0.3, y: 0.2 },
    ];

    lowRiskPoints.forEach((point) => {
      const x = padding + point.x * (width - 2 * padding);
      const y = padding + (1 - point.y) * (height - 2 * padding);
      ctx.fillStyle = "#8B5CF6";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Add heart icon
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "12px serif";
      ctx.fillText("❤", x + 8, y + 4);
    });

    // Generate high risk points (yellow - upper-right)
    const highRiskPoints = [
      { x: 0.7, y: 0.8 },
      { x: 0.75, y: 0.75 },
      { x: 0.8, y: 0.85 },
      { x: 0.65, y: 0.7 },
      { x: 0.85, y: 0.8 },
      { x: 0.7, y: 0.9 },
    ];

    highRiskPoints.forEach((point) => {
      const x = padding + point.x * (width - 2 * padding);
      const y = padding + (1 - point.y) * (height - 2 * padding);
      ctx.fillStyle = "#EAB308";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Add warning icon
      ctx.fillStyle = "#EAB308";
      ctx.font = "12px serif";
      ctx.fillText("⚠", x + 8, y + 4);
    });

    // Draw support vectors
    const supportVectors = [
      { x: 0.5, y: 0.48, class: "low" },
      { x: 0.52, y: 0.52, class: "high" },
    ];

    supportVectors.forEach((sv) => {
      const x = padding + sv.x * (width - 2 * padding);
      const y = padding + (1 - sv.y) * (height - 2 * padding);
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = sv.class === "low" ? "#8B5CF6" : "#EAB308";
      ctx.fill();
    });

    // Legend
    ctx.fillStyle = "#8B5CF6";
    ctx.beginPath();
    ctx.arc(padding + 20, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.fillText("Low Risk ❤", padding + 30, padding + 24);

    ctx.fillStyle = "#EAB308";
    ctx.beginPath();
    ctx.arc(padding + 130, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("High Risk ⚠", padding + 140, padding + 24);
  };

  const checkPrediction = () => {
    const normalizedBMI = (testBMI - 15) / 25;
    const normalizedBP = (testBP - 90) / 90;
    
    // Sigmoid-style decision
    const combined = (normalizedBMI + normalizedBP) / 2;
    const risk = 1 / (1 + Math.exp(-gamma[0] * 10 * (combined - 0.5)));

    if (risk > 0.7) {
      setPrediction("high");
      toast.error("🚨 High Risk - Medical attention recommended");
    } else if (risk > 0.4) {
      setPrediction("moderate");
      toast("⚠ Moderate Risk - Monitor closely", { icon: "⚠️" });
    } else {
      setPrediction("low");
      toast.success("✅ Low Risk - Healthy range");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/parameters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" /> Back to Kernels
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">Sigmoid Kernel</div>
        </div>
      </header>

      <section className="py-12 px-4 bg-gradient-to-r from-[hsl(var(--kernel-sigmoid))] to-[hsl(var(--warning))] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Sigmoid Kernel</h1>
          <p className="text-xl text-white/90">Neural Network-Style S-Shaped Boundaries</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Healthcare: Disease Risk Prediction</h2>
                <p className="text-muted-foreground mb-4">
                  Predicting health risk based on BMI and Blood Pressure with smooth transitions
                </p>
                <canvas ref={canvasRef} width={600} height={600} className="w-full border border-border rounded-lg" />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Key Insights</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-4 bg-warning/5">
                    <p className="text-sm">
                      <strong>Soft Boundaries:</strong> Gradual transitions match medical reality
                    </p>
                  </Card>
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm">
                      <strong>S-Curve Shape:</strong> Smooth progression from low to high risk
                    </p>
                  </Card>
                  <Card className="p-4 bg-destructive/5">
                    <p className="text-sm">
                      <strong>Threshold Effect:</strong> Clear decision zones with gradual transitions
                    </p>
                  </Card>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Parameters</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Gamma: {gamma[0].toFixed(2)}</label>
                    <Slider value={gamma} onValueChange={setGamma} min={0.01} max={1} step={0.01} />
                    <p className="text-xs text-muted-foreground mt-2">Controls steepness of S-curve</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Test Patient</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">BMI: {testBMI}</label>
                    <Slider value={[testBMI]} onValueChange={(v) => setTestBMI(v[0])} min={15} max={40} step={1} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Blood Pressure: {testBP} mmHg</label>
                    <Slider value={[testBP]} onValueChange={(v) => setTestBP(v[0])} min={90} max={180} step={5} />
                  </div>
                  <Button onClick={checkPrediction} className="w-full" size="lg">
                    Check Risk Level
                  </Button>

                  {prediction && (
                    <Card
                      className={`p-4 ${
                        prediction === "high"
                          ? "bg-destructive/10 border-destructive"
                          : prediction === "moderate"
                          ? "bg-warning/10 border-warning"
                          : "bg-success/10 border-success"
                      }`}
                    >
                      <p className="text-center font-semibold">
                        {prediction === "high" ? "🚨 High Risk" : prediction === "moderate" ? "⚠ Moderate Risk" : "✅ Low Risk"}
                      </p>
                    </Card>
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-accent/20">
                <p className="text-xs text-muted-foreground">
                  <strong>Medical Application:</strong> Sigmoid boundaries reflect gradual health changes better than sharp divisions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Sigmoid Kernel Characteristics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-success">✓ When to Use</h3>
              <ul className="space-y-2 text-sm">
                <li>• Neural network-like behavior</li>
                <li>• Gradual transitions needed</li>
                <li>• Medical/health applications</li>
                <li>• Probability-based decisions</li>
                <li>• Similar to logistic regression</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-warning">⚠ Limitations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Less popular than RBF</li>
                <li>• Can be unstable with wrong parameters</li>
                <li>• Not positive semi-definite always</li>
                <li>• May converge poorly</li>
                <li>• Requires careful tuning</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SigmoidKernel;
