import React from "react";
import { createContext, useState } from "react";

export const FormDataContext = createContext();

export const FormDataContextProvider = ({ children }) => {
  const [formList, setFormList] = useState([]);

  function addData(formData) {
    // Check if username exists
    const userExists = formList.find(
      (data) => data.username === formData.username
    );

    if (userExists) {
      return false;
    } else {
      setFormList((prevData) => [...prevData, formData]);
      return true;
    }
  }

  function getData(username) {
    return formList.find((data) => data.username === username);
  }

  function updateData(formData) {
    setFormList((prevData) => {
      const updatedData = prevData.map((data) => {
        if (data.username === formData.username) {
          return formData;
        }
        return data;
      });
      return updatedData;
    });
  }

  function deleteData(username) {
    const updatedFormList = formList.filter(
      (data) => data.username !== username
    );

    setFormList(updatedFormList);
    return updatedFormList.length;
  }

  const value = {
    formList,
    addData,
    getData,
    updateData,
    deleteData,
  };
  return (
    <FormDataContext.Provider value={value}>
      {children}
    </FormDataContext.Provider>
  );
};
