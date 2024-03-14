import React, { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Update({ setOpenUpdate, user }) {
  const queryClient = useQueryClient();

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    city: "",
    website: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(inputs);

  const mutaion = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    let name = inputs.name === "" ? user.name : inputs.name;
    let city = inputs.city === "" ? user.city : inputs.city;
    let website = inputs.website === "" ? user.website : inputs.website;
    mutaion.mutate({
      name,
      city,
      website,
      coverPic: coverUrl,
      profilePic: profileUrl,
    });
    setOpenUpdate(false);
  };
  return (
    <div className="update">
      Update <button onClick={() => setOpenUpdate(false)}>X</button>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        <input
          type="text"
          placeholder="name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="city"
          name="city"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="website"
          name="website"
          onChange={handleChange}
        />
        <button>update</button>
      </form>
    </div>
  );
}
