import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import "./App.css";

const KVDB_BUCKET = "BLbtbuWvN1B5uCxdV8Nzk6";

function App() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch(`https://kvdb.io/${KVDB_BUCKET}/jobs:`);
    const data = await res.json();
    setJobs(data);
  };

  const createJob = async () => {
    await fetch(`https://kvdb.io/${KVDB_BUCKET}/jobs:${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", description: "", url: "" });
    setOpen(false);
    fetchJobs();
  };

  const updateJob = async (key) => {
    await fetch(`https://kvdb.io/${KVDB_BUCKET}/jobs:${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", description: "", url: "" });
    setOpen(false);
    fetchJobs();
  };

  const deleteJob = async (key) => {
    await fetch(`https://kvdb.io/${KVDB_BUCKET}/jobs:${key}`, {
      method: "DELETE",
    });
    fetchJobs();
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>AI Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setOpen(true)}>Add Job</Button>
          </div>
          <Table>
            <TableCaption>AI Job Listings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job, index) => (
                <TableRow key={index}>
                  <TableCell>{job.value.title}</TableCell>
                  <TableCell>{job.value.description}</TableCell>
                  <TableCell>
                    <a href={job.value.url} target="_blank">
                      {job.value.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(job.value);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="outline" className="ml-2" onClick={() => deleteJob(job.key)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Job</DialogTitle>
            <DialogDescription>Enter the job details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <img src={`https://source.unsplash.com/random/?portrait%20professional`} alt="Random" className="h-16 w-16 rounded-full" />
              <div className="col-span-3 space-y-2">
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Job Title" />
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Job Description" />
                <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="URL" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                formData.key ? updateJob(formData.key) : createJob();
              }}
            >
              {formData.key ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
