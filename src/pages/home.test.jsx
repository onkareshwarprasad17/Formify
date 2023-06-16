import React from "react";
import { render, screen } from "@testing-library/react";
import {
  FormDataContext,
  FormDataContextProvider,
} from "../context/FormDataContext";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import Home from "./Home";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: () => mockNavigate,
}));

describe("Home Component", () => {
  const mockGetData = jest.fn();
  const formList = [
    {
      username: "testuser",
      projectName: "testProject",
      age: 20,
      gender: "male",
      subscribed: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Form with create mode when username doesn't exists in context", () => {
    const mockParams = {};
    useParams.mockReturnValue(mockParams);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <FormDataContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </FormDataContextProvider>
      </MemoryRouter>
    );

    let usernameInput = screen.getByRole("textbox", { name: "Username" });
    let projectInput = screen.getByRole("textbox", { name: "Project" });
    let ageInput = screen.getByRole("spinbutton", { name: "Age" });
    let genderInput = screen.getByRole("combobox", { name: "Gender" });
    let submitButton = screen.getByRole("button", { name: "Submit" });

    expect(usernameInput).toBeInTheDocument();
    expect(projectInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
    expect(genderInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("renders the Form with pre-populated data in edit mode when username exists in context", () => {
    const mockParams = { username: "testuser" };
    useParams.mockReturnValue(mockParams);
    mockGetData.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/testuser"]}>
        <FormDataContext.Provider
          value={{
            formList,
            getData: mockGetData,
          }}
        >
          <Routes>
            <Route path="/:username" element={<Home />} />
          </Routes>
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    let updateButton = screen.getByRole("button", { name: "Update" });

    expect(mockGetData).toHaveBeenCalled();
    expect(updateButton).toBeInTheDocument();
  });

  test("renders the Form with pre-populated data in edit mode when username exists in context", async () => {
    const mockParams = { username: "testuser" };
    useParams.mockReturnValue(mockParams);
    mockGetData.mockReturnValue(false);

    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/testuser"]}>
        <FormDataContext.Provider
          value={{
            getData: mockGetData,
          }}
        >
          <Routes>
            <Route path="/:username" element={<Home />} />
          </Routes>
        </FormDataContext.Provider>
      </MemoryRouter>
    );

    expect(mockAlert).toHaveBeenCalledWith("Invalid Url");

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
