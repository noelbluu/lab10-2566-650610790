"use client";

import { UserCard } from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RandomUserPage() {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(0);
  const [isFirstLoad, setFirstLoad] = useState(true);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanedUsers = users.map((person) => cleanUser(person));
    setUsers(cleanedUsers);
  };

  useEffect(() => {
    if (isFirstLoad) {
      setFirstLoad(false);
      return;
    }
    localStorage.setItem("genAmount", genAmount);
  }, [genAmount]);

  useEffect(() => {
    const genAmount = localStorage.getItem("genAmount");
    if (genAmount == null || genAmount == "") {
      setGenAmount(1);
      localStorage.setItem("genAmount", 1);
      return;
    }
  }, []);

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((users) => (
        <UserCard
          key={users.email}
          name={users.name}
          email={users.email}
          imgUrl={users.imgUrl}
          address={users.address}
        />
      ))}
    </div>
  );
}