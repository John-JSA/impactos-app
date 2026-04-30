"use client";

import { useEffect, useMemo, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
  location: string;
  beneficiaries: string;
  fundingGoal: number;
  raised: number;
  createdAt?: string;
};

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [fundingId, setFundingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    beneficiaries: "",
    fundingGoal: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    beneficiaries: "",
    fundingGoal: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setMessage("Failed to load projects.");
    }
  }

  const totalRaised = useMemo(
    () => projects.reduce((sum, p) => sum + p.raised, 0),
    [projects]
  );

  const totalGoal = useMemo(
    () => projects.reduce((sum, p) => sum + p.fundingGoal, 0),
    [projects]
  );

  function currency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function progressPercent(raised: number, goal: number) {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  }

  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.beneficiaries.trim() ||
      !form.fundingGoal.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(form.fundingGoal) <= 0) {
      alert("Funding goal must be greater than 0.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: form.location,
          beneficiaries: form.beneficiaries,
          fundingGoal: Number(form.fundingGoal),
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      await fetchProjects();

      setForm({
        title: "",
        description: "",
        location: "",
        beneficiaries: "",
        fundingGoal: "",
      });

      setMessage("Project submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting the project.");
    } finally {
      setLoading(false);
    }
  }

  async function fundProject(id: number, amount: number) {
    if (amount <= 0) {
      alert("Funding amount must be greater than 0.");
      return;
    }

    setFundingId(id);
    setMessage("");

    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, amount }),
      });

      if (!res.ok) throw new Error("Funding update failed");

      await fetchProjects();
      setMessage(`${currency(amount)} added successfully.`);
    } catch (error) {
      console.error(error);
      alert("Funding update failed.");
    } finally {
      setFundingId(null);
    }
  }

  function handleCustomFunding(projectId: number) {
    const value = Number(customAmounts[projectId]);

    if (!value || value <= 0) {
      alert("Please enter a valid custom amount.");
      return;
    }

    fundProject(projectId, value);

    setCustomAmounts((prev) => ({
      ...prev,
      [projectId]: "",
    }));
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      location: project.location,
      beneficiaries: project.beneficiaries,
      fundingGoal: String(project.fundingGoal),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      location: "",
      beneficiaries: "",
      fundingGoal: "",
    });
  }

  async function saveEdit(id: number) {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.location.trim() ||
      !editForm.beneficiaries.trim() ||
      !editForm.fundingGoal.trim()
    ) {
      alert("Please fill in all edit fields.");
      return;
    }

    if (Number(editForm.fundingGoal) <= 0) {
      alert("Funding goal must be greater than 0.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: editForm.title,
          description: editForm.description,
          location: editForm.location,
          beneficiaries: editForm.beneficiaries,
          fundingGoal: Number(editForm.fundingGoal),
        }),
      });

      if (!res.ok) throw new Error("Edit failed");

      await fetchProjects();
      cancelEdit();
      setMessage("Project updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Edit failed.");
    }
  }

  async function deleteProject(id: number) {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchProjects();
      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-base font-semibold text-emerald-800">
                Ghana Education Transformation
              </p>

              <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                INEF Education Impact Platform
              </h1>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                Transforming education in Ghana through practical digital access.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                A focused pilot platform where schools and communities can post
                urgent education needs, attract support, and track funding for
                real projects.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                  Ghana
                </span>
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  Digital Classrooms
                </span>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                  Teacher Training
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
              <h2 className="text-2xl font-semibold">Pilot Focus</h2>
              <p className="mt-3 text-slate-300">
                Start with one country, one sector, and measurable outcomes.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Projects</p>
                  <p className="mt-2 text-2xl font-bold">{projects.length}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Funds Raised</p>
                  <p className="mt-2 text-2xl font-bold">
                    {currency(totalRaised)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Funding Goal</p>
                  <p className="mt-2 text-2xl font-bold">
                    {currency(totalGoal)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Focus Area</p>
                  <p className="mt-2 text-2xl font-bold">Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="mx-auto mt-6 max-w-6xl px-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            {message}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Education Projects</h2>
          <p className="mt-1 text-slate-600">
            Interactive pilot projects for schools and communities in Ghana.
          </p>
        </div>

        {projects.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            No projects yet. Add the first school need below.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.location}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  Education
                </span>
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {project.description}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Beneficiaries</p>
                  <p className="mt-1 font-semibold">{project.beneficiaries}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Funding Goal</p>
                  <p className="mt-1 font-semibold">
                    {currency(project.fundingGoal)}
                  </p>
                </div>
              </div>

              {editingId === project.id && (
                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-4 font-semibold text-blue-900">
                    Edit Project
                  </h4>

                  <div className="grid gap-3">
                    <input
                      className="rounded-xl border px-4 py-2"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Title"
                    />

                    <textarea
                      className="rounded-xl border px-4 py-2"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description"
                    />

                    <input
                      className="rounded-xl border px-4 py-2"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Location"
                    />

                    <input
                      className="rounded-xl border px-4 py-2"
                      value={editForm.beneficiaries}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          beneficiaries: e.target.value,
                        }))
                      }
                      placeholder="Beneficiaries"
                    />

                    <input
                      type="number"
                      className="rounded-xl border px-4 py-2"
                      value={editForm.fundingGoal}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          fundingGoal: e.target.value,
                        }))
                      }
                      placeholder="Funding Goal"
                    />
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => saveEdit(project.id)}
                      className="rounded-xl bg-blue-700 px-4 py-2 font-medium text-white"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="rounded-xl border px-4 py-2 font-medium text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {currency(project.raised)} raised
                  </span>
                  <span className="text-slate-500">
                    {progressPercent(project.raised, project.fundingGoal)}%
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{
                      width: `${progressPercent(
                        project.raised,
                        project.fundingGoal
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Support this project
                </p>

                <div className="flex flex-wrap gap-2">
                  {[10, 50, 100, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => fundProject(project.id, amount)}
                      disabled={fundingId === project.id}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:bg-gray-200"
                    >
                      {fundingId === project.id
                        ? "Processing..."
                        : currency(amount)}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmounts[project.id] || ""}
                    onChange={(e) =>
                      setCustomAmounts((prev) => ({
                        ...prev,
                        [project.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
                  />

                  <button
                    onClick={() => handleCustomFunding(project.id)}
                    disabled={fundingId === project.id}
                    className="rounded-xl bg-slate-900 px-5 py-2 font-medium text-white transition hover:bg-slate-700 disabled:bg-gray-400"
                  >
                    {fundingId === project.id ? "Processing..." : "Give Custom"}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => startEdit(project)}
                  className="rounded-2xl border border-blue-300 px-5 py-3 font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  disabled={deletingId === project.id}
                  className="rounded-2xl border border-red-300 px-5 py-3 font-medium text-red-700 transition hover:bg-red-50 disabled:bg-gray-100"
                >
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </button>

                <button className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold">Submit a School Need</h2>
          <p className="mt-2 text-slate-600">
            Add a real education need from Ghana and test how the platform grows.
          </p>

          <form onSubmit={addProject} className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Project Title
              </label>
              <input
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-slate-500"
                placeholder="School lacks tablets and digital lesson content"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                placeholder="Describe the school challenge, what is missing, and the impact on students or teachers."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <input
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                placeholder="Ashanti Region, Ghana"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Beneficiaries
              </label>
              <input
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                placeholder="500 students"
                value={form.beneficiaries}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    beneficiaries: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Funding Goal (USD)
              </label>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                placeholder="50000"
                value={form.fundingGoal}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fundingGoal: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl px-5 py-3 font-medium text-white transition ${
                  loading
                    ? "bg-gray-400"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
