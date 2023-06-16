import React from "react";
import { MemoryRouter } from "react-router-dom";
import { FormDataContext } from "../context/FormDataContext";
import UserData from "./UserData";
import { fireEvent, render, screen } from "@testing-library/react";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserData Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render table with data in context", () => {
    const formList = [
      {
        username: "testuser",
        projectName: "testProject",
        age: 20,
        gender: "female",
        subscribed: true,
      },
    ];

    const deleteData = jest.fn();

    render(
      <MemoryRouter initialEntries={["/details"]}>
        <FormDataContext.Provider
          value={{
            formList,
            deleteData,
          }}
        >
          <UserData />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    const usernameTableHeader = screen.getByText("Username");
    const username = screen.getByText("testuser");
    const isSubscribedText = screen.getByText("Yes");

    const editButton = screen.getByRole("button", { name: "Edit" });
    const deleteButton = screen.getByRole("button", { name: "Delete" });

    expect(usernameTableHeader).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(isSubscribedText).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("should navigate to respective user on edit", async () => {
    const formList = [
      {
        username: "testuser",
        projectName: "testProject",
        age: 20,
        gender: "female",
        subscribed: false,
      },
    ];

    const deleteData = jest.fn();

    render(
      <MemoryRouter initialEntries={["/details"]}>
        <FormDataContext.Provider
          value={{
            formList,
            deleteData,
          }}
        >
          <UserData />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    const editButton = screen.getByRole("button", { name: "Edit" });
    const isSubscribedText = screen.getByText("No");

    expect(isSubscribedText).toBeInTheDocument();

    await fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/testuser");
  });

  it("should navigate to homepage when last user is deleted", async () => {
    const formList = [
      {
        username: "testuser",
        projectName: "testProject",
        age: 20,
        gender: "female",
        subscribed: true,
      },
    ];

    const deleteData = jest.fn(() => 0);

    render(
      <MemoryRouter initialEntries={["/details"]}>
        <FormDataContext.Provider
          value={{
            formList,
            deleteData,
          }}
        >
          <UserData />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    await fireEvent.click(deleteButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
