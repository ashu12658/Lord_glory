import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import styled, { keyframes } from "styled-components";
import { FiUpload, FiLoader } from "react-icons/fi";

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const CompactFormContainer = styled.div`
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  max-width: 600px;
  margin: 1rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const CompactLogo = styled.img`
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto 1rem;
  border-radius: 50%;
  border: 2px solid #3498db;
  padding: 3px;
  background: white;
`;

const CompactFormTitle = styled.h3`
  text-align: center;
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: #3498db;
    margin: 8px auto;
    border-radius: 2px;
  }
`;

const CompactForm = styled.form`
  animation: ${fadeIn} 0.4s ease-out;
`;

const CompactInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  border: 1px solid #e0e6ed;
  font-size: 14px;
  transition: all 0.2s ease;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const CompactTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  border: 1px solid #e0e6ed;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const CompactLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
`;

const CompactRadioGroup = styled.div`
  margin-bottom: 1rem;
`;

const CompactRadioOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CompactRadioOption = styled.label`
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 6px 10px;
  background: ${props => props.checked ? '#3498db' : '#f7fafc'};
  color: ${props => props.checked ? 'white' : '#4a5568'};
  border-radius: 20px;
  border: 1px solid ${props => props.checked ? '#3498db' : '#e0e6ed'};
  cursor: pointer;
  transition: all 0.2s ease;
  input {
    display: none;
  }
`;

const CompactCheckboxGroup = styled.div`
  margin-bottom: 1rem;
`;

const CompactCheckboxOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CompactCheckboxOption = styled.label`
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 6px 10px;
  background: ${props => props.checked ? '#e3f2fd' : '#f7fafc'};
  color: #4a5568;
  border-radius: 20px;
  border: 1px solid ${props => props.checked ? '#3498db' : '#e0e6ed'};
  cursor: pointer;
  transition: all 0.2s ease;
  input {
    display: none;
  }
`;

const CompactFileInput = styled.div`
  position: relative;
  margin-bottom: 1rem;
  input[type="file"] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    position: absolute;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background: #f7fafc;
    border: 1px dashed #cbd5e0;
    border-radius: 6px;
    font-size: 13px;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: #3498db;
      background: #ebf5ff;
    }
    svg {
      margin-right: 6px;
    }
  }
`;

const CompactSubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
  }
  svg {
    margin-right: 6px;
    animation: ${props => props.loading ? 'spin 1s linear infinite' : 'none'};
  }
`;

const CompactErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
  background: rgba(229, 62, 62, 0.05);
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const SkinCareForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    skinType: "",
    skinConditions: [],
    allergies: "",
    skincareRoutine: "",
    otherDetails: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedConditions = checked
          ? [...prevData.skinConditions, value]
          : prevData.skinConditions.filter((condition) => condition !== value);
        return { ...prevData, skinConditions: updatedConditions };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to submit the form.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, Array.isArray(value) ? value.join(", ") : value);
      });

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/skincare/submit-skin-care-form",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Form submitted successfully!");
      navigate("/products");
      setFormData({
        name: "",
        email: "",
        age: "",
        skinType: "",
        skinConditions: [],
        allergies: "",
        skincareRoutine: "",
        otherDetails: "",
      });
      setImageFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompactFormContainer>
      <CompactLogo src={logo} alt="Lord Glory Logo" />
      <CompactFormTitle>Skin Consultation</CompactFormTitle>
      
      {error && <CompactErrorMessage>{error}</CompactErrorMessage>}

      <CompactForm onSubmit={handleSubmit}>
        <CompactLabel>Your Name</CompactLabel>
        <CompactInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <CompactLabel>Your Email</CompactLabel>
        <CompactInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <CompactLabel>Your Age</CompactLabel>
        <CompactInput
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min="10"
          max="100"
        />

        <CompactRadioGroup>
          <CompactLabel>Skin Type</CompactLabel>
          <CompactRadioOptions>
            {["Dry", "Oily", "Combination", "Sensitive"].map((type) => (
              <CompactRadioOption 
                key={type}
                checked={formData.skinType === type}
              >
                <input
                  type="radio"
                  name="skinType"
                  value={type}
                  onChange={handleChange}
                  checked={formData.skinType === type}
                />
                {type}
              </CompactRadioOption>
            ))}
          </CompactRadioOptions>
        </CompactRadioGroup>

        <CompactCheckboxGroup>
          <CompactLabel>Skin Concerns</CompactLabel>
          <CompactCheckboxOptions>
            {["Acne", "Dark Spots", "Dryness", "Aging", "Dullness", "Redness"].map((condition) => (
              <CompactCheckboxOption 
                key={condition}
                checked={formData.skinConditions.includes(condition)}
              >
                <input
                  type="checkbox"
                  name="skinConditions"
                  value={condition}
                  onChange={handleChange}
                  checked={formData.skinConditions.includes(condition)}
                />
                {condition}
              </CompactCheckboxOption>
            ))}
          </CompactCheckboxOptions>
        </CompactCheckboxGroup>

        <CompactLabel>Current Routine</CompactLabel>
        <CompactTextArea
          name="skincareRoutine"
          placeholder="Products you use, frequency, etc."
          value={formData.skincareRoutine}
          onChange={handleChange}
        />

        <CompactLabel>Allergies</CompactLabel>
        <CompactInput
          type="text"
          name="allergies"
          placeholder="Any known allergies?"
          value={formData.allergies}
          onChange={handleChange}
        />

        <CompactLabel>Additional Details</CompactLabel>
        <CompactTextArea
          name="otherDetails"
          placeholder="Anything else we should know?"
          value={formData.otherDetails}
          onChange={handleChange}
        />

        <CompactFileInput>
          <CompactLabel>Upload Photos</CompactLabel>
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <label htmlFor="file-upload">
            <FiUpload size={14} />
            {imageFiles.length > 0 
              ? `${imageFiles.length} file(s) selected` 
              : "Choose files"}
          </label>
        </CompactFileInput>

        <CompactSubmitButton type="submit" disabled={loading} loading={loading}>
          {loading ? (
            <>
              <FiLoader size={16} />
              Processing...
            </>
          ) : (
            "Get Recommendations"
          )}
        </CompactSubmitButton>
      </CompactForm>
    </CompactFormContainer>
  );
};

export default SkinCareForm;