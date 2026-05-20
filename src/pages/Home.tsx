import { CheckCircle2, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const  handlWatchVideo = ()=>{
    toast.message("Video comming soon")
  }
  const features = [
    {
      icon: CheckCircle2,
      title: "Smart Task Management",
      description:
        "Organize your tasks effortlessly with list and board view type.",
    },
    {
      icon: Calendar,
      title: "Add Descryption",
      description:
        "Add detail descryption to your todo.",
    },
    
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border px-4 py-1 text-sm text-muted-foreground">
            Organize. Focus. Achieve.
          </span>

          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            The smart way to manage your{" "}
            <span className="bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              tasks & goals
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Stay productive with a beautifully designed task manager
            built for your daily life. Plan projects, set reminders,
            and achieve more.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            

            <Button variant="outline" size="lg" onClick={handlWatchVideo}>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Card */}
    

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">
            Everything you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            Designed to help you stay focused and productive.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border p-6 hover:shadow-lg transition-all"
              >
                <Icon className="mb-4 h-8 w-8 text-primary" />

                <h3 className="mb-2 font-semibold">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 BlobNotes. Built for productivity.
      </footer>
    </div>
  );
}