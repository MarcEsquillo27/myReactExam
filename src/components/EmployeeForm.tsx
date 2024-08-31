import React, { useState } from "react";
import axios from "axios";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// For Text Field input
const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
}) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      type={type}
      className="form-control"
      id={id}
      value={value}
      onChange={onChange}
    />
  </div>
);

function EmployeeForm() {
  // MyStates
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    picture: null as File | null, // Update to handle File type
  });
  // myHandleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { id, value } = e.target;
    if (id === "phone") {
      if (value.match(/[a-zA-Z]/)) {
        value = value.replace(/[a-zA-Z]/g, ""); //NOTE: this change letters to empty string
        alert("Numbers Only");
      }
      // 11 digits
      const newValue = value.slice(0, 11);
      setFormData((prevData) => ({
        ...prevData,
        [id]: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      picture: file,
    }));
  };

  // Send Function
  const handleSubmit = () => {
    // TRAPPING BEFORE SEND
    // Check if all the fields
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    // Check if the email contains '@'
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (!formData.picture) {
      alert("Please Input File");
      return;
    }
    //END OF TRAPPING

    const data = new FormData();

    // Append text fields
    data.append("first_name", formData.first_name);
    data.append("middle_name", formData.middle_name);
    data.append("last_name", formData.last_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    // Append file if it exists
    if (formData.picture) {
      data.append("picture", formData.picture);
    }

    axios({
      method: "POST",
      url: "http://localhost:12799/employee/api/insertEmployee",
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        alert(response.data.message);
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          phone: "",
          picture: null,
        });
        const fileInput = document.getElementById(
          "picture"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = ""; // Clear the file input
      })
      .catch((error) => {
        alert(`Error submitting form data: ${error}`);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card m-3" style={{ width: "24rem" }}>
        <div className="card-body">
          <h5 className="card-title">Employee Form</h5>
          <InputField
            id="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <InputField
            id="middle_name"
            label="Middle Name"
            value={formData.middle_name}
            onChange={handleChange}
          />
          <InputField
            id="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            id="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="mb-3">
            <label htmlFor="picture" className="form-label">
              Insert Image
            </label>
            <input
              type="file"
              className="form-control"
              id="picture"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              className="btn btn-primary w-100 mt-2"
              type="button"
              onClick={handleSubmit}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;
