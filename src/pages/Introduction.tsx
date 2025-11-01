import { Link } from "react-router-dom";
import { Brain, Target, TrendingUp, ArrowRight, Sparkles, Code, Database, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Introduction = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:40px_40px]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Understanding Support Vector Machines
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              Learn how SVM finds the best way to separate different groups of data
            </p>
            <Link to="/parameters">
              <Button variant="hero" size="xl" className="animate-scale-in">
                Start Learning <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-lg animate-float-delayed" />
      </section>

      {/* What is SVM Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">What is SVM?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Support Vector Machines find the best way to separate different groups of data—like separating apples from oranges on a table
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 gradient-card hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">The Concept</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Imagine you have red apples and green apples mixed on a table. SVM draws the widest possible path between them, ensuring maximum separation while using only the closest items (support vectors) to define the boundary.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 gradient-card hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Brain className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">How It Works</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    SVM identifies key data points called "support vectors" that lie closest to the decision boundary. These critical points determine the optimal separation line or hyperplane.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Real-World Applications</h2>
            <p className="text-xl text-muted-foreground">SVM powers solutions across industries</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Database, title: "Medical Diagnosis", description: "Disease detection and risk prediction", color: "text-kernel-linear" },
              { icon: Image, title: "Face Recognition", description: "Identifying faces in images", color: "text-kernel-polynomial" },
              { icon: Code, title: "Text Classification", description: "Email spam detection and sentiment analysis", color: "text-kernel-rbf" },
              { icon: Sparkles, title: "Handwriting Recognition", description: "Converting handwritten text to digital", color: "text-kernel-sigmoid" },
            ].map((app, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <app.icon className={`w-12 h-12 mb-4 ${app.color}`} />
                <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
                <p className="text-muted-foreground text-sm">{app.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Classification Focus */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-10 gradient-card hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 rounded-full bg-primary/10">
                <TrendingUp className="w-16 h-16 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Classification vs Regression</h2>
                <p className="text-lg text-muted-foreground">
                  While SVM can handle both, this course focuses on <span className="font-semibold text-primary">classification</span>—sorting data into distinct categories like spam vs. not spam, or disease vs. healthy.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Dive Deeper?</h2>
          <p className="text-xl text-white/90 mb-8">
            Learn about SVM parameters, kernels, and how to build your own models
          </p>
          <Link to="/parameters">
            <Button variant="hero" size="xl" className="bg-white text-primary hover:bg-white/90">
              Explore Parameters & Kernels <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Introduction;
