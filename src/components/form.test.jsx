import React from "react";
import { MemoryRouter } from "react-router-dom";
import Form from "./Form";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  FormDataContext,
  FormDataContextProvider,
} from "../context/FormDataContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Form Renders", () => {
  it("should render without data not in edit mode", () => {
    let mockGetData = jest.fn();
    let mockAddData = jest.fn();
    let mockUpdateData = jest.fn();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FormDataContextProvider
          value={{
            getData: mockGetData,
            updateData: mockUpdateData,
            addData: mockAddData,
          }}
        >
          <Form editMode={false} username={undefined} />
        </FormDataContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("textbox", { name: "Username" })).toHaveValue("");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should show proper validation errors for invalid data", async () => {
    let mockGetData = jest.fn();
    let mockAddData = jest.fn();
    let mockUpdateData = jest.fn();

    render(
      <MemoryRouter initialEntries={["/testuser"]}>
        <FormDataContextProvider
          value={{
            getData: mockGetData,
            updateData: mockUpdateData,
            addData: mockAddData,
          }}
        >
          <Form editMode={false} username={undefined} />
        </FormDataContextProvider>
      </MemoryRouter>
    );

    let usernameInput = screen.getByRole("textbox", { name: "Username" });
    let projectInput = screen.getByRole("textbox", { name: "Project" });
    let ageInput = screen.getByRole("spinbutton", { name: "Age" });
    let submitButton = screen.getByRole("button", { name: "Submit" });

    await fireEvent.click(submitButton);

    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Project Name is required")).toBeInTheDocument();
    expect(screen.getByText("Age is required")).toBeInTheDocument();
    expect(screen.getByText("Gender is required")).toBeInTheDocument();

    await fireEvent.change(usernameInput, { target: { value: "a#b4@" } });

    expect(
      screen.getByText("Username should not have special characters!")
    ).toBeInTheDocument();

    await fireEvent.change(projectInput, { target: { value: "p@ssw()rd" } });

    expect(
      screen.getByText("Project Name should not have special characters!")
    ).toBeInTheDocument();

    await fireEvent.change(ageInput, { target: { value: "-10" } });

    expect(screen.getByText("Please enter a valid age")).toBeInTheDocument();
  });

  it("should submit form with valid input values", async () => {
    let addData = jest.fn(() => true);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FormDataContext.Provider
          value={{
            addData,
          }}
        >
          <Form editMode={false} username={undefined} />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    let usernameInput = screen.getByRole("textbox", { name: "Username" });
    let projectInput = screen.getByRole("textbox", { name: "Project" });
    let ageInput = screen.getByRole("spinbutton", { name: "Age" });
    let genderInput = screen.getByRole("combobox", { name: "Gender" });
    let submitButton = screen.getByRole("button", { name: "Submit" });

    await fireEvent.change(usernameInput, { target: { value: "testuser" } });
    await fireEvent.change(projectInput, { target: { value: "testProject" } });
    await fireEvent.change(ageInput, { target: { value: "25" } });
    await fireEvent.change(genderInput, { target: { value: "male" } });

    await fireEvent.click(submitButton);

    expect(addData).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/details");
  });

  it("should throw alert when username already exists", async () => {
    let addData = jest.fn(() => false);
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FormDataContext.Provider
          value={{
            addData,
          }}
        >
          <Form editMode={false} username={undefined} />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    let usernameInput = screen.getByRole("textbox", { name: "Username" });
    let projectInput = screen.getByRole("textbox", { name: "Project" });
    let ageInput = screen.getByRole("spinbutton", { name: "Age" });
    let genderInput = screen.getByRole("combobox", { name: "Gender" });
    let submitButton = screen.getByRole("button", { name: "Submit" });

    await fireEvent.change(usernameInput, { target: { value: "testuser" } });
    await fireEvent.change(projectInput, { target: { value: "testProject" } });
    await fireEvent.change(ageInput, { target: { value: "25" } });
    await fireEvent.change(genderInput, { target: { value: "male" } });

    await fireEvent.click(submitButton);

    expect(mockAlert).toHaveBeenCalledWith(
      "Username already exists. Please use another username!"
    );

    mockAlert.mockRestore();
  });

  it("should throw alert when username already exists", async () => {
    let updateData = jest.fn();

    let getData = jest.fn().mockReturnValue({
      username: "testuser",
      projectName: "projectUser",
      age: 20,
      gender: "male",
      subscribed: false,
    });

    render(
      <MemoryRouter initialEntries={["/testuser"]}>
        <FormDataContext.Provider
          value={{
            updateData,
            getData,
          }}
        >
          <Form editMode={true} username={"testuser"} />
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    let usernameInput = screen.getByRole("textbox", { name: "Username" });
    let projectInput = screen.getByRole("textbox", { name: "Project" });
    let ageInput = screen.getByRole("spinbutton", { name: "Age" });
    let genderInput = screen.getByRole("combobox", { name: "Gender" });
    let updateButton = screen.getByRole("button", { name: "Update" });

    expect(usernameInput).toHaveValue("testuser");
    expect(updateButton).toBeInTheDocument();

    await fireEvent.change(usernameInput, { target: { value: "testuser12" } });
    await fireEvent.change(projectInput, { target: { value: "testProject" } });
    await fireEvent.change(ageInput, { target: { value: "25" } });
    await fireEvent.change(genderInput, { target: { value: "male" } });

    await fireEvent.click(updateButton);

    expect(mockNavigate).toHaveBeenCalledWith("/details");
  });
});
