import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Circle, Ruler, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Parameters = () => {
  const kernels = [
    {
      name: "Linear Kernel",
      icon: Ruler,
      color: "kernel-linear",
      description: "Creates straight decision boundaries",
      link: "/linear-kernel",
    },
    {
      name: "Polynomial Kernel",
      icon: Circle,
      color: "kernel-polynomial",
      description: "Creates curved boundaries using polynomial equations",
      link: "/polynomial-kernel",
    },
    {
      name: "RBF Kernel",
      icon: Sparkles,
      color: "kernel-rbf",
      description: "Most popular! Creates flexible, circular decision regions",
      link: "/rbf-kernel",
    },
    {
      name: "Sigmoid Kernel",
      icon: Shield,
      color: "kernel-sigmoid",
      description: "Creates boundaries similar to neural networks",
      link: "/sigmoid-kernel",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" /> Back to Introduction
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-hero">
        <div className="max-w-5xl mx-auto text-center text-white animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">The Building Blocks of SVM</h1>
          <p className="text-xl text-white/90">Understanding parameters, margins, support vectors, and kernels</p>
        </div>
      </section>

      {/* Section 1: Margins */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Understanding Parameters & Margins</h2>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6 animate-slide-up">
              <Card className="p-8 gradient-card">
                <h3 className="text-2xl font-semibold mb-4">What is a Margin?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The margin is the "safety zone" between the decision boundary and the closest data points from each class. Think of it as the width of the road between two groups.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">SVM's goal:</strong> Find the boundary that maximizes this margin, creating the widest possible separation.
                </p>
              </Card>

              <Card className="p-8 gradient-card">
                <h3 className="text-2xl font-semibold mb-4">Hard vs Soft Margin</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-lg mb-2">Hard Margin</h4>
                    <p className="text-sm text-muted-foreground">
                      Strict separation with no errors allowed. Works only when data is perfectly separable.
                    </p>
                  </div>
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <h4 className="font-semibold text-lg mb-2">Soft Margin</h4>
                    <p className="text-sm text-muted-foreground">
                      Flexible separation that allows some errors. Controlled by the C parameter.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-accent/30">
                <h4 className="font-semibold mb-3">The C Parameter</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Low C (e.g., 0.1):</strong> Soft margin—tolerates more errors for wider margin
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>High C (e.g., 10):</strong> Hard margin—minimizes errors, narrower margin
                </p>
              </Card>
            </div>

            <div className="flex items-center justify-center">
              <Card className="p-8 w-full max-w-md gradient-card hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Ruler className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground px-4">
                      Interactive visualization showing narrow vs wide margins with animated boundary transitions
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground italic">
                  Visual demonstration of margin width and C parameter effects
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Support Vectors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Support Vectors: The VIP Data Points</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up order-2 lg:order-1">
              <Card className="p-8 gradient-card">
                <h3 className="text-2xl font-semibold mb-4">What are Support Vectors?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Support vectors are the data points closest to the decision boundary. They are like pillars holding up a fence—only these critical points determine where the boundary is drawn.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Key insight:</strong> All other data points could be removed without changing the boundary. Only support vectors matter!
                </p>
              </Card>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { title: "Why Important?", text: "They define the entire decision boundary" },
                  { title: "How Many?", text: "Usually just a small subset of all data" },
                  { title: "What Makes Them Special?", text: "Closest points to the boundary" },
                ].map((item, index) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.text}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Card className="p-8 gradient-card hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Circle className="w-16 h-16 mx-auto mb-4 text-secondary animate-pulse-glow" />
                    <p className="text-sm text-muted-foreground px-4">
                      Interactive animation showing support vectors highlighted with glowing circles, demonstrating boundary shift when removed
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Kernels */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Kernel</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Kernels transform data to make separation easier. Different patterns require different kernels.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {kernels.map((kernel, index) => (
              <Link key={index} to={kernel.link} target="_blank" rel="noopener noreferrer">
                <Card className={`p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up group`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`p-4 rounded-full bg-${kernel.color}/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <kernel.icon className={`w-12 h-12 text-${kernel.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{kernel.name}</h3>
                  <p className="text-muted-foreground mb-4">{kernel.description}</p>
                  <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explore <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2" /> Previous: Introduction
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Select a kernel above to continue learning
          </div>
        </div>
      </section>
    </div>
  );
};

export default Parameters;
