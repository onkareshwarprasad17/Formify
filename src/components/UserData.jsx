import React, { useContext } from "react";
import { FormDataContext } from "../context/FormDataContext";
import { useNavigate } from "react-router-dom";

const UserData = () => {
  const { formList, deleteData } = useContext(FormDataContext);

  const navigate = useNavigate();

  function handleEdit(formData) {
    navigate(`/${formData.username}`);
  }

  function handleDelete(username) {
    const formLength = deleteData(username);
    if (formLength === 0) {
      navigate("/");
    }
  }

  function backHandler() {
    navigate("/");
  }

  return (
    <>
      <h2 className="back-button" onClick={backHandler}>
        &#8592; Back
      </h2>
      <table>
        <caption>Form Filled Data</caption>
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Project Name</th>
            <th scope="col">Age</th>
            <th scope="col">Gender</th>
            <th scope="col">Newsletter(Subscribed)</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {formList.map((formData) => (
            <tr key={formData.username}>
              <td data-label={"Username"}>{formData.username}</td>
              <td data-label={"ProjectName"}>{formData.projectName}</td>
              <td data-label={"Age"}>{formData.age}</td>
              <td data-label={"Gender"}>
                {formData.gender === "male" ? "M" : "F"}
              </td>
              <td data-label={"Subscription"}>
                {formData.subscribed ? "Yes" : "No"}
              </td>
              <td data-label={"Edit"}>
                <button
                  className="edit_button"
                  onClick={() => handleEdit(formData)}
                >
                  Edit
                </button>
              </td>
              <td data-label={"Delete"}>
                <button
                  className="delete_button"
                  onClick={() => handleDelete(formData.username)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserData;
