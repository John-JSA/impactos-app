"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Globe, Lightbulb, DollarSign, BarChart3, Users } from "lucide-react";

const starterProblems = [
  {
    id: 1,
    title: "Rural schools lack internet-enabled learning tools",
    category: "Education",
    country: "Ghana",
    description:
      "Many students in rural communities do not have access to digital classrooms, learning platforms, or reliable devices.",
    impact: "4,500 students affected",
    fundingGoal: 250000,
    raised: 85000,
    status: "Open",
    aiSolution:
      "Deploy solar-powered learning hubs with offline-first content sync, teacher training, and shared tablets for classroom rotation.",
  },
  {
    id: 2,
    title: "Farmers lose crops due to poor storage and market access",
    category: "Agriculture",
    country: "Ghana",
    description:
      "Small farmers face post-harvest losses because of weak logistics, limited cold storage, and low bargaining power.",
    impact: "1,200 farmers affected",
    fundingGoal: 500000,
    raised: 120000,
    status: "Open",
    aiSolution:
      "Create a shared storage and transport network with demand forecasting, SMS pricing alerts, and local aggregation centers.",
  },
  {
    id: 3,
    title: "Youth unemployment remains high despite technical talent",
    category: "Jobs",
    country: "Nigeria",
    description:
      "Young people need structured pathways into remote work, vocational skills, apprenticeships, and small business finance.",
    impact: "8,000 youth affected",
    fundingGoal: 800000,
    raised: 410000,
    status: "In Progress",
    aiSolution:
      "Launch a skills-to-income platform with verified training tracks, mentorship, employer matching, and micro-grants for tools.",
  },
];

function currency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function percent(raised, goal) {
  return Math.min(100, Math.round((raised / goal) * 100));
}

export default function ImpactOSMVP() {
  const [problems, setProblems] = useState(starterProblems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [role, setRole] = useState("Community");
  const [form, setForm] = useState({
    title: "",
    category: "Education",
    country: "",
    description: "",
    impact: "",
    fundingGoal: "",
  });

  const stats = useMemo(() => {
    const totalRaised = problems.reduce((sum, p) => sum + p.raised, 0);
    const totalGoal = problems.reduce((sum, p) => sum + p.fundingGoal, 0);
    return {
      totalProblems: problems.length,
      totalRaised,
      totalGoal,
      openProjects: problems.filter((p) => p.status === "Open").length,
    };
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = [p.title, p.category, p.country, p.description]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [problems, search, categoryFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.country || !form.description || !form.fundingGoal) return;

    const solutionMap = {
      Education: "Create a blended learning solution with offline content, teacher coaching, device-sharing, and community-backed operations.",
      Agriculture: "Build a supply chain solution with storage, transport coordination, market visibility, and farmer training.",
      Jobs: "Develop a job pipeline with skills assessments, mentorship, project experience, and employer connections.",
      Health: "Set up mobile care access, digital records, telehealth support, and community outreach partnerships.",
      Logistics: "Design a smart logistics network using local hubs, route coordination, and transparent shipment tracking.",
    };

    const newProblem = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      country: form.country,
      description: form.description,
      impact: form.impact || "Impact estimate pending",
      fundingGoal: Number(form.fundingGoal),
      raised: 0,
      status: "Open",
      aiSolution: solutionMap[form.category] || "AI-generated solution draft pending.",
    };

    setProblems((prev) => [newProblem, ...prev]);
    setForm({
      title: "",
      category: "Education",
      country: "",
      description: "",
      impact: "",
      fundingGoal: "",
    });
  };

  const quickFund = (id, amount) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, raised: p.raised + amount } : p))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]"
          >
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Globe className="h-4 w-4" /> ImpactOS MVP
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                One platform to turn real-world problems into fundable solutions.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Communities post challenges. AI drafts solutions. Experts refine them. Funders back execution.
                Progress is visible in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="rounded-full px-4 py-1 text-sm">Education</Badge>
                <Badge className="rounded-full px-4 py-1 text-sm">Agriculture</Badge>
                <Badge className="rounded-full px-4 py-1 text-sm">Jobs</Badge>
                <Badge className="rounded-full px-4 py-1 text-sm">Health</Badge>
                <Badge className="rounded-full px-4 py-1 text-sm">Logistics</Badge>
              </div>
            </div>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Join the platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">I am joining as</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                      <SelectItem value="Funder">Funder</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full rounded-2xl">Continue as {role}</Button>
                <p className="text-sm text-slate-500">
                  This MVP shows the problem marketplace, AI solution drafts, and quick-funding workflow.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Problems Listed", value: stats.totalProblems, icon: Lightbulb },
            { label: "Open Projects", value: stats.openProjects, icon: BarChart3 },
            { label: "Funds Raised", value: currency(stats.totalRaised), icon: DollarSign },
            { label: "Community Reach", value: "13,700+", icon: Users },
          ].map((item) => (
            <Card key={item.label} className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
                <item.icon className="h-7 w-7 text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="marketplace">Problem Marketplace</TabsTrigger>
            <TabsTrigger value="submit">Submit a Problem</TabsTrigger>
            <TabsTrigger value="roadmap">MVP Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="rounded-2xl pl-10"
                  placeholder="Search by title, category, country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Filter category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Jobs">Jobs</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <Card className="h-full rounded-3xl border-0 shadow-sm">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl leading-7">{problem.title}</CardTitle>
                          <p className="mt-1 text-sm text-slate-500">{problem.country}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                          {problem.category}
                        </Badge>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{problem.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          AI Solution Draft
                        </p>
                        <p className="text-sm leading-6 text-slate-700">{problem.aiSolution}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Impact</p>
                          <p className="mt-1 font-semibold">{problem.impact}</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                          <p className="mt-1 font-semibold">{problem.status}</p>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>{currency(problem.raised)} raised</span>
                          <span>Goal {currency(problem.fundingGoal)}</span>
                        </div>
                        <Progress value={percent(problem.raised, problem.fundingGoal)} className="h-3 rounded-full" />
                        <p className="mt-2 text-xs text-slate-500">
                          {percent(problem.raised, problem.fundingGoal)}% funded
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl" onClick={() => quickFund(problem.id, 10000)}>
                          Fund $10,000
                        </Button>
                        <Button variant="outline" className="rounded-2xl">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submit">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Submit a real-world problem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Problem title</label>
                    <Input
                      className="rounded-2xl"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Example: Clinics lack affordable diagnostics"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Category</label>
                    <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Jobs">Jobs</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Country</label>
                    <Input
                      className="rounded-2xl"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="Ghana"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Description</label>
                    <Textarea
                      className="min-h-32 rounded-2xl"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the challenge, who is affected, and what is currently missing."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Impact estimate</label>
                    <Input
                      className="rounded-2xl"
                      value={form.impact}
                      onChange={(e) => setForm({ ...form, impact: e.target.value })}
                      placeholder="2,000 people affected"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Funding goal (USD)</label>
                    <Input
                      type="number"
                      className="rounded-2xl"
                      value={form.fundingGoal}
                      onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
                      placeholder="150000"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <Button type="submit" className="rounded-2xl">Submit problem</Button>
                    <Button type="button" variant="outline" className="rounded-2xl">
                      Save draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Phase 1: MVP",
                  items: [
                    "Problem listing",
                    "AI solution drafts",
                    "Simple funding workflow",
                    "Basic dashboards",
                  ],
                },
                {
                  title: "Phase 2: Operations",
                  items: [
                    "User authentication",
                    "Expert review workflow",
                    "NGO and donor profiles",
                    "Project milestones",
                  ],
                },
                {
                  title: "Phase 3: Scale",
                  items: [
                    "Country chapters",
                    "Payments integration",
                    "Impact analytics",
                    "Government and enterprise plans",
                  ],
                },
              ].map((phase) => (
                <Card key={phase.title} className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {phase.items.map((item) => (
                      <div key={item} className="rounded-2xl border p-3 text-sm">
                        {item}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
