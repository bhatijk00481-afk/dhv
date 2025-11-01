import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw, Shuffle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const LinearKernel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cParameter, setCParameter] = useState([1]);
  const [numPoints, setNumPoints] = useState([50]);
  const [testIncome, setTestIncome] = useState(70000);
  const [testScore, setTestScore] = useState(650);
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    drawVisualization();
  }, [cParameter, numPoints]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system
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

    // Draw colored regions
    const gradient1 = ctx.createLinearGradient(padding, 0, width / 2, 0);
    gradient1.addColorStop(0, "rgba(239, 68, 68, 0.15)");
    gradient1.addColorStop(1, "rgba(239, 68, 68, 0.05)");
    ctx.fillStyle = gradient1;
    ctx.fillRect(padding, padding, (width - 2 * padding) / 2, height - 2 * padding);

    const gradient2 = ctx.createLinearGradient(width / 2, 0, width - padding, 0);
    gradient2.addColorStop(0, "rgba(16, 185, 129, 0.05)");
    gradient2.addColorStop(1, "rgba(16, 185, 129, 0.15)");
    ctx.fillStyle = gradient2;
    ctx.fillRect(width / 2, padding, (width - 2 * padding) / 2, height - 2 * padding);

    // Draw decision boundary (vertical line in middle for linear separation)
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2, padding);
    ctx.lineTo(width / 2, height - padding);
    ctx.stroke();

    // Draw margin boundaries
    const marginWidth = 30 / cParameter[0]; // Wider margin for smaller C
    ctx.strokeStyle = "#6B7280";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width / 2 - marginWidth, padding);
    ctx.lineTo(width / 2 - marginWidth, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2 + marginWidth, padding);
    ctx.lineTo(width / 2 + marginWidth, height - padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Generate and draw data points
    const points = numPoints[0];
    for (let i = 0; i < points; i++) {
      const isClass0 = i < points / 2;
      const baseX = isClass0 ? width / 4 : (3 * width) / 4;
      const x = baseX + (Math.random() - 0.5) * 80;
      const y = padding + Math.random() * (height - 2 * padding);

      ctx.fillStyle = isClass0 ? "#EF4444" : "#10B981";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw support vectors (highlighted points near the boundary)
    const supportVectors = [
      { x: width / 2 - marginWidth - 10, y: height / 3, class: 0 },
      { x: width / 2 - marginWidth - 10, y: (2 * height) / 3, class: 0 },
      { x: width / 2 + marginWidth + 10, y: height / 3, class: 1 },
      { x: width / 2 + marginWidth + 10, y: (2 * height) / 3, class: 1 },
    ];

    supportVectors.forEach((sv) => {
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sv.x, sv.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = sv.class === 0 ? "#EF4444" : "#10B981";
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#374151";
    ctx.font = "14px sans-serif";
    ctx.fillText("Class 0 (Red)", padding + 10, padding + 20);
    ctx.fillText("Class 1 (Green)", width - padding - 100, padding + 20);
  };

  const playAnimation = () => {
    setIsAnimating(true);
    toast.success("Animation started!");
    setTimeout(() => {
      setIsAnimating(false);
      drawVisualization();
      toast.success("Animation complete!");
    }, 3000);
  };

  const resetVisualization = () => {
    setCParameter([1]);
    setNumPoints([50]);
    setPrediction(null);
    toast.info("Visualization reset");
  };

  const randomizeData = () => {
    setNumPoints([Math.floor(Math.random() * 40) + 30]);
    toast.info("Data randomized!");
  };

  const checkApproval = () => {
    const normalizedIncome = (testIncome - 20000) / 100000;
    const normalizedScore = (testScore - 300) / 550;
    const combined = (normalizedIncome + normalizedScore) / 2;

    if (combined > 0.5) {
      setPrediction("approved");
      toast.success("✅ Loan Approved! Strong candidate.");
    } else {
      setPrediction("rejected");
      toast.error("❌ Loan Rejected. Consider improving credit score.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/parameters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" /> Back to Kernels
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">Linear Kernel</div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[hsl(var(--kernel-linear))] to-[hsl(var(--primary-glow))] text-white">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">Linear Kernel in SVM</h1>
          <p className="text-xl text-white/90">The Foundation - Creating Straight Decision Boundaries</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 gradient-card hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3">What is Linear Kernel?</h3>
              <p className="text-sm text-muted-foreground">
                Creates straight decision boundaries to separate data—like drawing the straightest line to separate red and green apples.
              </p>
            </Card>
            <Card className="p-6 gradient-card hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3">When to Use</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for linearly separable data: spam detection, text classification, and binary decisions.
              </p>
            </Card>
            <Card className="p-6 gradient-card hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3">Advantages</h3>
              <p className="text-sm text-muted-foreground">
                Fast, efficient, interpretable, and works well in high dimensions.
              </p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
              <div className="space-y-4">
                {[
                  "1. Identify Data: Plot all data points in space",
                  "2. Find Boundaries: Test multiple potential separation lines",
                  "3. Maximize Margin: Select the line with widest margin",
                  "4. Identify Support Vectors: Highlight closest points that define boundary",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm">{step.substring(3)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-6">Real-World Uses</h3>
              <div className="space-y-3">
                {[
                  { icon: "📧", title: "Email Spam Detection", desc: "Red = Spam, Green = Not Spam" },
                  { icon: "💰", title: "Loan Approval", desc: "Based on income & credit score" },
                  { icon: "🏥", title: "Medical Diagnosis", desc: "Risk vs Healthy patients" },
                  { icon: "📝", title: "Text Classification", desc: "Document categorization" },
                ].map((app, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors duration-300">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{app.title}</h4>
                      <p className="text-xs text-muted-foreground">{app.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Visualization */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Interactive Visualization</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full max-w-full border border-border rounded-lg"
                />
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Controls</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      C Parameter: {cParameter[0].toFixed(1)}
                      <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                        <Info className="h-4 w-4" />
                      </Button>
                    </label>
                    <Slider value={cParameter} onValueChange={setCParameter} min={0.1} max={10} step={0.1} className="mb-2" />
                    <p className="text-xs text-muted-foreground">Lower = Soft margin, Higher = Hard margin</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Points: {numPoints[0]}</label>
                    <Slider value={numPoints} onValueChange={setNumPoints} min={20} max={100} step={10} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button onClick={playAnimation} disabled={isAnimating} className="w-full" variant="default">
                    <Play className="mr-2 h-4 w-4" />
                    {isAnimating ? "Animating..." : "Play Animation"}
                  </Button>
                  <Button onClick={resetVisualization} className="w-full" variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={randomizeData} className="w-full" variant="secondary">
                    <Shuffle className="mr-2 h-4 w-4" />
                    Randomize Data
                  </Button>
                </div>
              </Card>

              <Card className="p-4 bg-accent/20">
                <p className="text-xs text-muted-foreground">
                  <strong>Legend:</strong> Red dots = Class 0, Green dots = Class 1, Black circles = Support Vectors, Solid line = Decision boundary, Dashed lines = Margins
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Approval Scenario */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Real-World: Bank Loan Approval</h2>

          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Test Yourself</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Annual Income: ${testIncome.toLocaleString()}</label>
                    <Slider value={[testIncome]} onValueChange={(v) => setTestIncome(v[0])} min={20000} max={120000} step={5000} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Credit Score: {testScore}</label>
                    <Slider value={[testScore]} onValueChange={(v) => setTestScore(v[0])} min={300} max={850} step={10} />
                  </div>
                  <Button onClick={checkApproval} className="w-full" size="lg">
                    Check Approval Status
                  </Button>

                  {prediction && (
                    <Card className={`p-4 ${prediction === "approved" ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"}`}>
                      <p className="text-center font-semibold">
                        {prediction === "approved" ? "✅ Loan Approved!" : "❌ Loan Rejected"}
                      </p>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        {prediction === "approved" ? "Strong candidate with good financials" : "Consider improving credit score or income"}
                      </p>
                    </Card>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-primary/5">
                    <p className="text-sm">
                      <strong>Decision Boundary:</strong> The line separating approved from rejected applications
                    </p>
                  </Card>
                  <Card className="p-4 bg-success/5">
                    <p className="text-sm">
                      <strong>Support Vectors:</strong> Edge cases—applicants right on the approval threshold
                    </p>
                  </Card>
                  <Card className="p-4 bg-warning/5">
                    <p className="text-sm">
                      <strong>Margin:</strong> Confidence zone—wider margin = more confident decisions
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Advantages & Limitations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Advantages & Limitations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 gradient-card">
              <h3 className="text-2xl font-semibold mb-6 text-success">✓ Advantages</h3>
              <ul className="space-y-3">
                {[
                  "Fast & efficient for large datasets",
                  "Highly interpretable results",
                  "Works well in high dimensions",
                  "Low risk of overfitting",
                  "Only one parameter (C) to tune",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-success font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 gradient-card">
              <h3 className="text-2xl font-semibold mb-6 text-warning">⚠ Limitations</h3>
              <ul className="space-y-3">
                {[
                  "Only handles linear patterns",
                  "Struggles with overlapping classes",
                  "Sensitive to outliers",
                  "Cannot solve XOR-like problems",
                  "Requires feature scaling",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Compare Kernels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Compare with Other Kernels</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Polynomial", desc: "Need curves?", link: "/polynomial-kernel", color: "kernel-polynomial" },
              { name: "RBF", desc: "Most flexible!", link: "/rbf-kernel", color: "kernel-rbf" },
              { name: "Sigmoid", desc: "Neural network-style?", link: "/sigmoid-kernel", color: "kernel-sigmoid" },
            ].map((kernel, i) => (
              <Link key={i} to={kernel.link} target="_blank">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <h3 className="text-xl font-semibold mb-2">{kernel.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{kernel.desc}</p>
                  <div className={`text-${kernel.color} font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center`}>
                    Explore <ArrowLeft className="ml-2 rotate-180 w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LinearKernel;
