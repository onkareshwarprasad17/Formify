import React, { useContext, useEffect, useState } from "react";
import { FormDataContext } from "../context/FormDataContext";
import { useNavigate } from "react-router-dom";

let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|`,.<>\/?]/;

const Form = ({ editMode, username }) => {
  const [formData, setFormData] = useState({
    username: "",
    projectName: "",
    age: null,
    gender: "",
    subscribed: false,
  });

  const [errors, setErrors] = useState({});

  const { getData, updateData, addData } = useContext(FormDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (editMode) {
      if (username) {
        const data = getData(username);
        setFormData(data);
      }
    }
  }, [editMode, username]);

  function inputChangeHandler(e) {
    const { name, value, checked, type } = e.target;

    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Validate the field and update the errors dynamically
    const validationErrors = validateField(name, fieldValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));
  }

  function submitHandler(e) {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      let userExists = null;

      if (editMode) {
        updateData(formData);
        navigate("/details");
      } else {
        userExists = addData(formData);
        if (userExists) {
          // navigate to user details page
          navigate("/details");
        } else {
          alert("Username already exists. Please use another username!");
        }
      }

      // Reset form data and errors
      setFormData({
        username: "",
        projectName: "",
        age: null,
        gender: "",
        subscribed: false,
      });
      setErrors({});
    } else {
      // Form has errors, display error messages
      setErrors(validationErrors);
    }
  }

  const validateForm = () => {
    const errors = {};

    // Validate each field and add error message if invalid
    for (const fieldName in formData) {
      const fieldValue = formData[fieldName];
      const fieldErrors = validateField(fieldName, fieldValue);
      if (Object.keys(fieldErrors).length > 0) {
        errors[fieldName] = fieldErrors[fieldName];
      }
    }

    return errors;
  };

  const validateField = (name, value) => {
    const fieldErrors = {};

    // Validate each field individually and add error message if invalid
    if (name === "username" && !value?.trim()) {
      fieldErrors[name] = "Username is required";
    } else if (name === "username" && specialChars.test(value)) {
      fieldErrors[name] = "Username should not have special characters!";
    }

    if (name === "projectName" && !value?.trim()) {
      fieldErrors[name] = "Project Name is required";
    } else if (name === "projectName" && specialChars.test(value)) {
      fieldErrors[name] = "Project Name should not have special characters!";
    }

    if (name === "age" && !value?.trim()) {
      fieldErrors[name] = "Age is required";
    } else if (name === "age" && (isNaN(value) || value < 0)) {
      fieldErrors[name] = "Please enter a valid age";
    }

    if (name === "gender" && !value) {
      fieldErrors[name] = "Gender is required";
    }

    return fieldErrors;
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="username">Username</label>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Type your Username"
            maxLength={10}
            onChange={(e) => inputChangeHandler(e)}
            defaultValue={formData.username}
            autoComplete="off"
          />
        </div>
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <label htmlFor="projectName">Project</label>
        <div>
          <input
            type="text"
            name="projectName"
            id="projectName"
            placeholder="Type your Project Name"
            autoComplete="off"
            onChange={(e) => inputChangeHandler(e)}
            defaultValue={formData.projectName}
          />
        </div>
        {errors.projectName && (
          <span className="error">{errors.projectName}</span>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <div>
          <input
            type="number"
            name="age"
            id="age"
            autoComplete="off"
            placeholder="Type your Age"
            defaultValue={formData.age}
            onChange={(e) => inputChangeHandler(e)}
            min={20}
            max={45}
            pattern=".*"
          />
        </div>
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <div>
          <select
            name="gender"
            id="gender"
            placeholder="Select Gender"
            defaultValue={formData.gender}
            value={formData.gender}
            onChange={inputChangeHandler}
          >
            <option value="" disabled hidden>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div>
        <label htmlFor="newsletter">Subscribe to Newsletter:</label>

        <input
          type="checkbox"
          name="newsletter"
          id="newsletter"
          defaultValue={formData.subscribed}
          onChange={inputChangeHandler}
        />
      </div>

      <button type="submit">{editMode ? "Update" : "Submit"}</button>
    </form>
  );
};

export default Form;
