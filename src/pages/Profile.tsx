import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import url from "@/lib/url";

interface profileData {
  username: string;
  nationality: string | null;
  cash: number;
}

const Profile = () => {
  const [data, setData] = useState<profileData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const res = await axios.get<profileData>(`${url}/profile`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!res.data) {
        throw new Error("Unable to fetch the data");
      }

      setData(res.data);
      setError("");
    } catch (err: any) {
      setData(null);
      setError("Error fetching profile.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  const updateNationality = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      await axios.post(
        `${url}/selectnation`,
        { nation: nationality },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      await getProfile();
      setDialogOpen(false);
    } catch (err: any) {
      setError("Error updating nationality.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex flex-col justify-center w-3/4 mx-auto border border-neutral-400 shadow-md mt-5 rounded-xl p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {data && (
        <Card className="px-6 py-4 my-5">
          <CardTitle className="text-2xl font-semibold">
            Username: {data.username}
          </CardTitle>
          <CardDescription className="text-xl font-semibold">
            Balance: ${data.cash.toFixed(2)}
          </CardDescription>
          <CardDescription className="text-xl font-semibold">
            {data.nationality ? (
              <p>Nationality: {data.nationality}</p>
            ) : (
              <div className="my-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setDialogOpen(true)}>
                      Select Nationality
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a Nationality</DialogTitle>
                      <DialogDescription>
                        Add your nationality here!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="">Select...</option>
                        <option value="USA">USA</option>
                        <option value="India">India</option>
                      </select>
                      <Button onClick={updateNationality}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardDescription>
        </Card>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Profile;
