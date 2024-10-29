import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
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
import { DollarSign, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface profileData {
  username: string;
  nationality: string | null;
  cash: number;
  indiancash: number;
}

const Profile = () => {
  const [data, setData] = useState<profileData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addUsFunds, setAddUsFunds] = useState(0);
  const [addIndianFunds, setAddIndianFunds] = useState(0);
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

  const handleAddFunds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (addUsFunds > 10000 || addIndianFunds > 10000) {
        toast({
          title : "Unauthorized",
          description : "Add funds limit is 10000",
          variant : "destructive"
        })
        throw new Error("Limit breached, you can only add 10000 at once")
      }
      const res = await axios.post(
        `${url}/editbalances`,
        {
          cash: addUsFunds || 0,
          indiancash: addIndianFunds || 0,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        toast({
          title : "Balance updated",
          variant : 'default'
        })
        setData(prevData => {
          if (prevData) {
            return {
              ...prevData,
              cash: prevData.cash + (addUsFunds || 0),
              indiancash: prevData.indiancash + (addIndianFunds || 0)
            };
          }
          return prevData;
        });
        setAddIndianFunds(0)
        setAddUsFunds(0)
      }
    } catch (error) {
      console.error("Unable to update the funds");
      setError("Error updating funds for the user.");
    } finally {
      setError("")
    }
  };

  return (
    <div className="flex flex-col justify-center w-3/4 mx-auto border border-neutral-400 shadow-md mt-5 rounded-xl p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {data && (
        <Card className="px-6 py-4 my-5">
          <CardTitle className="text-2xl font-semibold">
            Username: {data.username}
          </CardTitle>
          <CardDescription className="text-xl font-semibold">
            Indian Cash Balance: ₹{data.indiancash.toFixed(2)}
          </CardDescription>
          <CardDescription className="text-xl font-semibold">
            US Cash Balance: ${data.cash.toFixed(2)}
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
      <Card className="px-4 py-4">
        <CardTitle className="text-md my-1">Update Balance:</CardTitle>
        <CardDescription className="my-1">
          Update the Indian or Us account balance:
        </CardDescription>
        <CardContent className="my-1">
          <CardDescription>Add Funds for Us account:</CardDescription>
          <Input
            className="px-4 my-2"
            placeholder="Enter US Balance amount..."
            value={addUsFunds}
            onChange={(e) => setAddUsFunds(Number(e.target.value))}
            max={10000}
          />
          <Button onClick={handleAddFunds}>
            Add Funds <DollarSign />{" "}
          </Button>
        </CardContent>
        <CardContent className="my-1">
          <CardDescription>Add Funds for Indian account:</CardDescription>
          <Input
            className="px-4 my-2"
            value={addIndianFunds}
            placeholder="Enter US Balance amount..."
            onChange={(e) => setAddIndianFunds(Number(e.target.value))}
            max={10000}
          />
          <Button onClick={handleAddFunds}>
            Add Funds <IndianRupee />{" "}
          </Button>
        </CardContent>
      </Card>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Profile;
