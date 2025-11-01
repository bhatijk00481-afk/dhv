import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const PolynomialKernel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [degree, setDegree] = useState([2]);
  const [cParameter, setCParameter] = useState([1]);
  const [testHours, setTestHours] = useState(20);
  const [testScore, setTestScore] = useState(70);
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    drawVisualization();
  }, [degree, cParameter]);

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
    ctx.fillText("Study Hours/Week", width / 2 - 50, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Previous Test Score %", 0, 0);
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

    // Draw colored regions (polynomial boundary)
    ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    for (let x = padding; x < width - padding; x += 2) {
      const normalizedX = (x - padding) / (width - 2 * padding);
      const curveY = Math.pow(normalizedX, degree[0]) * (height - 2 * padding);
      const y = height - padding - curveY;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(234, 179, 8, 0.15)";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    for (let x = padding; x < width - padding; x += 2) {
      const normalizedX = (x - padding) / (width - 2 * padding);
      const curveY = Math.pow(normalizedX, degree[0]) * (height - 2 * padding);
      const y = height - padding - curveY;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width - padding, padding);
    ctx.closePath();
    ctx.fill();

    // Draw polynomial boundary curve
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = padding; x < width - padding; x += 2) {
      const normalizedX = (x - padding) / (width - 2 * padding);
      const curveY = Math.pow(normalizedX, degree[0]) * (height - 2 * padding);
      const y = height - padding - curveY;
      if (x === padding) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Generate data points - Failed students (purple)
    const failedPoints = [
      // High score, low hours (overconfident)
      { x: 0.2, y: 0.8 },
      { x: 0.25, y: 0.85 },
      { x: 0.15, y: 0.75 },
      // Low both
      { x: 0.2, y: 0.2 },
      { x: 0.3, y: 0.25 },
      { x: 0.25, y: 0.3 },
      // Middle borderline
      { x: 0.5, y: 0.45 },
      { x: 0.45, y: 0.5 },
    ];

    failedPoints.forEach((point) => {
      const x = padding + point.x * (width - 2 * padding);
      const y = padding + (1 - point.y) * (height - 2 * padding);
      ctx.fillStyle = "#8B5CF6";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Passed students (yellow)
    const passedPoints = [
      // High both
      { x: 0.7, y: 0.8 },
      { x: 0.75, y: 0.85 },
      { x: 0.8, y: 0.75 },
      // High hours, moderate score
      { x: 0.8, y: 0.5 },
      { x: 0.85, y: 0.55 },
      { x: 0.75, y: 0.45 },
      // Middle-bottom (compensated with hours)
      { x: 0.6, y: 0.4 },
      { x: 0.65, y: 0.35 },
    ];

    passedPoints.forEach((point) => {
      const x = padding + point.x * (width - 2 * padding);
      const y = padding + (1 - point.y) * (height - 2 * padding);
      ctx.fillStyle = "#EAB308";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw support vectors
    const supportVectors = [
      { x: 0.45, y: 0.48, class: "failed" },
      { x: 0.55, y: 0.52, class: "passed" },
    ];

    supportVectors.forEach((sv) => {
      const x = padding + sv.x * (width - 2 * padding);
      const y = padding + (1 - sv.y) * (height - 2 * padding);
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = sv.class === "failed" ? "#8B5CF6" : "#EAB308";
      ctx.fill();
    });

    // Legend
    ctx.fillStyle = "#8B5CF6";
    ctx.beginPath();
    ctx.arc(padding + 20, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.fillText("Failed", padding + 30, padding + 24);

    ctx.fillStyle = "#EAB308";
    ctx.beginPath();
    ctx.arc(padding + 90, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("Passed", padding + 100, padding + 24);
  };

  const checkPrediction = () => {
    const normalizedHours = testHours / 40;
    const normalizedScore = testScore / 100;
    const combined = Math.pow(normalizedHours, degree[0]) + normalizedScore * 0.5;

    if (combined > 0.6) {
      setPrediction("pass");
      toast.success("✅ Likely to Pass!");
    } else {
      setPrediction("fail");
      toast.error("❌ At Risk of Failing");
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
          <div className="text-sm text-muted-foreground">Polynomial Kernel</div>
        </div>
      </header>

      <section className="py-12 px-4 bg-gradient-to-r from-[hsl(var(--kernel-polynomial))] to-[hsl(var(--secondary))] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Polynomial Kernel</h1>
          <p className="text-xl text-white/90">Creating Curved Decision Boundaries</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Student Performance Prediction</h2>
                <p className="text-muted-foreground mb-4">
                  Predicting exam pass/fail based on study hours per week and previous test score
                </p>
                <canvas ref={canvasRef} width={600} height={600} className="w-full border border-border rounded-lg" />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Key Insights</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm">
                      <strong>Non-linear Relationship:</strong> More study hours can compensate for lower previous scores
                    </p>
                  </Card>
                  <Card className="p-4 bg-secondary/5">
                    <p className="text-sm">
                      <strong>Curved Boundary:</strong> The polynomial curve captures complex patterns in student performance
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
                    <label className="text-sm font-medium mb-2 block">Polynomial Degree: {degree[0]}</label>
                    <Slider value={degree} onValueChange={setDegree} min={2} max={5} step={1} />
                    <p className="text-xs text-muted-foreground mt-2">Higher degree = more complex curves</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">C Parameter: {cParameter[0].toFixed(1)}</label>
                    <Slider value={cParameter} onValueChange={setCParameter} min={0.1} max={10} step={0.1} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Test Yourself</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Study Hours/Week: {testHours}</label>
                    <Slider value={[testHours]} onValueChange={(v) => setTestHours(v[0])} min={0} max={40} step={5} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Previous Test Score: {testScore}%</label>
                    <Slider value={[testScore]} onValueChange={(v) => setTestScore(v[0])} min={0} max={100} step={5} />
                  </div>
                  <Button onClick={checkPrediction} className="w-full" size="lg">
                    Predict Result
                  </Button>

                  {prediction && (
                    <Card className={`p-4 ${prediction === "pass" ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"}`}>
                      <p className="text-center font-semibold">
                        {prediction === "pass" ? "✅ Likely to Pass!" : "❌ At Risk"}
                      </p>
                    </Card>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">When to Use Polynomial Kernel</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-success">✓ Best For</h3>
              <ul className="space-y-2 text-sm">
                <li>• Image classification tasks</li>
                <li>• Pattern recognition with curves</li>
                <li>• Feature interactions matter</li>
                <li>• Moderately complex relationships</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-warning">⚠ Limitations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Can overfit with high degrees</li>
                <li>• More parameters to tune</li>
                <li>• Slower than linear kernel</li>
                <li>• Not ideal for very complex data</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PolynomialKernel;
