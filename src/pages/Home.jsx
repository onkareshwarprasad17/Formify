import React, { useContext, useEffect, useState } from "react";

import Form from "../components/Form";
import { useNavigate, useParams } from "react-router-dom";
import { FormDataContext } from "../context/FormDataContext";

const Home = () => {
  const params = useParams();
  const { getData } = useContext(FormDataContext);

  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.username) {
      const userExists = getData(params.username);
      if (userExists) setIsEdit(true);
      else {
        alert("Invalid Url");
        navigate("/");
      }
    } else {
      setIsEdit(false);
    }
  }, [params]);

  return (
    <>
      <Form editMode={isEdit} username={params?.username} />
    </>
  );
};

export default Home;
