import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, MapPin, Users, Zap, Heart, Globe, Award, Shield } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Planning",
      description: "Advanced AI algorithms create personalized itineraries tailored to your preferences and budget.",
    },
    {
      icon: MapPin,
      title: "Global Destinations",
      description: "Explore thousands of destinations worldwide with local insights and hidden gems.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your travel data is protected with enterprise-grade security and privacy measures.",
    },
    {
      icon: Heart,
      title: "Loved by Travelers",
      description: "Join thousands of satisfied travelers who trust us with their dream vacations.",
    },
  ]

  const team = [
    {
      name: "Shlok Patel",
      role: "Project Manager",
      description: "Strategic leader who oversees the entire project lifecycle, ensuring the team stays on track to deliver a successful product.",
    },
    {
      name: "Garv Patel",
      role: "Full Stack Developer",
      description: "Versatile coder who builds and maintains both the user-facing and server-side components of the application.",
    },
    {
      name: "Jigar Prajapati",
      role: "UI/UX Designer",
      description: "Creative problem-solver focused on designing intuitive, accessible, and visually appealing user experiences.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Travelers" },
    { number: "200+", label: "Countries Covered" },
    { number: "1M+", label: "Itineraries Created" },
    { number: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center gap-2 mb-6">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold text-balance">About AI Travel Planner</h1>
            </div>
            <p className="text-xl text-muted-foreground text-balance mb-8">
              We're revolutionizing travel planning with artificial intelligence, making it easier than ever to create
              personalized, budget-friendly itineraries for your dream destinations.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="px-4 py-2">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Global Coverage
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Budget-Friendly
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Personalized
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-8">Our Mission</h2>
            <p className="text-lg text-muted-foreground text-balance mb-12">
              We believe that everyone deserves to explore the world without the stress of complex planning. Our
              AI-powered platform democratizes travel planning, making it accessible, affordable, and enjoyable for
              travelers of all backgrounds and budgets.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Global Accessibility</h3>
                  <p className="text-muted-foreground">
                    Making travel planning accessible to everyone, regardless of experience or budget constraints.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Excellence in Service</h3>
                  <p className="text-muted-foreground">
                    Delivering exceptional travel experiences through cutting-edge technology and personalized service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Our platform combines advanced AI technology with deep travel expertise to create the perfect trip for
              you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Our diverse team of travel experts, technologists, and designers work together to create amazing travel
              experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground text-balance">
                The principles that guide everything we do at AI Travel Planner.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                <p className="text-muted-foreground">
                  Every decision we make is centered around creating the best possible experience for our travelers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of what's possible in travel technology and planning.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust</h3>
                <p className="text-muted-foreground">
                  We build trust through transparency, reliability, and protecting our users' privacy and data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Ready to Start Planning?</h2>
            <p className="text-lg text-muted-foreground text-balance mb-8">
              Join thousands of travelers who have discovered the joy of stress-free trip planning with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Start Planning Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
