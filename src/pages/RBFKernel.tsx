import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const RBFKernel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gamma, setGamma] = useState([1]);
  const [testAge, setTestAge] = useState(30);
  const [testPurchases, setTestPurchases] = useState(10);
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
    ctx.fillText("Age", width / 2 - 10, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Monthly Purchases", 0, 0);
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

    // Define high interest clusters
    const clusters = [
      { cx: 0.25, cy: 0.7, radius: 0.15 },
      { cx: 0.65, cy: 0.35, radius: 0.12 },
      { cx: 0.5, cy: 0.55, radius: 0.1 },
    ];

    // Draw RBF regions (circular/blob-like)
    clusters.forEach((cluster) => {
      const centerX = padding + cluster.cx * (width - 2 * padding);
      const centerY = padding + (1 - cluster.cy) * (height - 2 * padding);
      const radius = cluster.radius * (width - 2 * padding) * (1 / gamma[0]);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, "rgba(234, 179, 8, 0.25)");
      gradient.addColorStop(1, "rgba(234, 179, 8, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Generate scattered low interest points (purple)
    const lowInterestPoints = [];
    for (let i = 0; i < 30; i++) {
      const point = { x: Math.random(), y: Math.random() };
      // Avoid high interest clusters
      let inCluster = false;
      for (const cluster of clusters) {
        const dist = Math.sqrt(Math.pow(point.x - cluster.cx, 2) + Math.pow(point.y - cluster.cy, 2));
        if (dist < cluster.radius) {
          inCluster = true;
          break;
        }
      }
      if (!inCluster) {
        lowInterestPoints.push(point);
      }
    }

    lowInterestPoints.forEach((point) => {
      const x = padding + point.x * (width - 2 * padding);
      const y = padding + (1 - point.y) * (height - 2 * padding);
      ctx.fillStyle = "#8B5CF6";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Generate high interest cluster points (yellow)
    clusters.forEach((cluster) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        const dist = Math.random() * cluster.radius * 0.7;
        const x = padding + (cluster.cx + Math.cos(angle) * dist) * (width - 2 * padding);
        const y = padding + (1 - (cluster.cy + Math.sin(angle) * dist)) * (height - 2 * padding);
        ctx.fillStyle = "#EAB308";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw circular decision boundaries around clusters
    clusters.forEach((cluster) => {
      const centerX = padding + cluster.cx * (width - 2 * padding);
      const centerY = padding + (1 - cluster.cy) * (height - 2 * padding);
      const radius = cluster.radius * (width - 2 * padding) * (1 / gamma[0]);

      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Legend
    ctx.fillStyle = "#8B5CF6";
    ctx.beginPath();
    ctx.arc(padding + 20, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.fillText("Low Interest", padding + 30, padding + 24);

    ctx.fillStyle = "#EAB308";
    ctx.beginPath();
    ctx.arc(padding + 120, padding + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("High Interest", padding + 130, padding + 24);
  };

  const checkPrediction = () => {
    const normalizedAge = testAge / 70;
    const normalizedPurchases = testPurchases / 20;

    // Check if point is in any cluster
    const clusters = [
      { cx: 0.25, cy: 0.7, radius: 0.15 },
      { cx: 0.65, cy: 0.35, radius: 0.12 },
      { cx: 0.5, cy: 0.55, radius: 0.1 },
    ];

    let inCluster = false;
    for (const cluster of clusters) {
      const dist = Math.sqrt(Math.pow(normalizedAge - cluster.cx, 2) + Math.pow(normalizedPurchases - cluster.cy, 2));
      if (dist < cluster.radius * (1 / gamma[0])) {
        inCluster = true;
        break;
      }
    }

    if (inCluster) {
      setPrediction("high");
      toast.success("🎯 High Interest Customer!");
    } else {
      setPrediction("low");
      toast.info("📊 Low Interest Customer");
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
          <div className="text-sm text-muted-foreground">RBF Kernel</div>
        </div>
      </header>

      <section className="py-12 px-4 bg-gradient-to-r from-[hsl(var(--kernel-rbf))] to-[hsl(var(--success))] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">RBF Kernel (Radial Basis Function)</h1>
          <p className="text-xl text-white/90">Most Popular! Creates Flexible, Circular Decision Regions</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">E-commerce Customer Segmentation</h2>
                <p className="text-muted-foreground mb-4">
                  Identifying high-interest customer clusters based on age and monthly purchases
                </p>
                <canvas ref={canvasRef} width={600} height={600} className="w-full border border-border rounded-lg" />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Key Insights</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-4 bg-success/5">
                    <p className="text-sm">
                      <strong>Island Effect:</strong> RBF creates isolated "islands" of high interest
                    </p>
                  </Card>
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm">
                      <strong>Cluster Focus:</strong> Groups similar customers together
                    </p>
                  </Card>
                  <Card className="p-4 bg-secondary/5">
                    <p className="text-sm">
                      <strong>Flexible Boundaries:</strong> Smooth, organic shapes
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
                    <Slider value={gamma} onValueChange={setGamma} min={0.1} max={5} step={0.1} />
                    <p className="text-xs text-muted-foreground mt-2">Low = smoother regions, High = tight circles</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Test Customer</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Age: {testAge}</label>
                    <Slider value={[testAge]} onValueChange={(v) => setTestAge(v[0])} min={18} max={70} step={1} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Monthly Purchases: {testPurchases}</label>
                    <Slider value={[testPurchases]} onValueChange={(v) => setTestPurchases(v[0])} min={0} max={20} step={1} />
                  </div>
                  <Button onClick={checkPrediction} className="w-full" size="lg">
                    Check Interest Level
                  </Button>

                  {prediction && (
                    <Card className={`p-4 ${prediction === "high" ? "bg-success/10 border-success" : "bg-primary/10 border-primary"}`}>
                      <p className="text-center font-semibold">
                        {prediction === "high" ? "🎯 High Interest!" : "📊 Low Interest"}
                      </p>
                    </Card>
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-accent/20">
                <p className="text-xs text-muted-foreground">
                  <strong>RBF Advantage:</strong> Can handle complex, non-linear patterns with multiple disconnected regions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why RBF is Most Popular</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-success">✓ Strengths</h3>
              <ul className="space-y-2 text-sm">
                <li>• Handles any complexity level</li>
                <li>• Works with non-linear data</li>
                <li>• Creates smooth boundaries</li>
                <li>• Single parameter (gamma)</li>
                <li>• Great default choice</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-warning">⚠ Considerations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Can be computationally expensive</li>
                <li>• May overfit with high gamma</li>
                <li>• Requires proper scaling</li>
                <li>• Less interpretable than linear</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RBFKernel;
