import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface GmailForm {
  code: string;
  email: string;
  password: string;
  twoFA: string;
  phone: string;
  country: string;
  year: number;
  owner: string;
  status: string;
}

export default function GmailDialog() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<GmailForm>({
    code: "",
    email: "",
    password: "",
    twoFA: "",
    phone: "",
    country: "",
    year: new Date().getFullYear(),
    owner: "",
    status: "Active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "year"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSave = () => {
    console.log(form);

    // TODO:
    // axios.post("/api/gmail", form)

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>

        <Button>
          + Add Gmail
        </Button>

      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">

        <DialogHeader>

          <DialogTitle>
            Add Gmail Account
          </DialogTitle>

        </DialogHeader>

        <div className="grid grid-cols-2 gap-5 py-4">

          <div>

            <Label>Code</Label>

            <Input
              name="code"
              value={form.code}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Email</Label>

            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Password</Label>

            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>2FA</Label>

            <Input
              name="twoFA"
              value={form.twoFA}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Phone</Label>

            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Country</Label>

            <Input
              name="country"
              value={form.country}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Year</Label>

            <Input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
            />

          </div>

          <div>

            <Label>Owner</Label>

            <Input
              name="owner"
              value={form.owner}
              onChange={handleChange}
            />

          </div>

          <div className="col-span-2">

            <Label>Status</Label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
              <option value="Disabled">Disabled</option>
            </select>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
          >
            Save
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}