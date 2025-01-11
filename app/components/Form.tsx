import { FormData, UserSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormField from "./FormField";
import axios from "axios";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  // Define the onSubmit function
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form data on submit:", data); // Check if form data is logged
    // Ensure the values are correctly formatted
    const formattedData = {
      email: data.email,
      githubUrl: data.githubUrl,
      yearsOfExperience: Number(data.yearsOfExperience), // Ensure it's a number
      password: String(data.password), // Convert password to string
      confirmPassword: String(data.confirmPassword), // Convert confirmPassword to string
    };

    try {
      // Make a POST request with the correct data
      const response = await axios.post("/api/form", formattedData);
      console.log("Response from server:", response); // Check if response is logged

      const { errors: serverErrors = {} } = response.data; // Destructure the 'errors' property from the response data

      // Handle server-side validation errors
      if (serverErrors) {
        // Iterate through each error field from the server response
        Object.entries(serverErrors).forEach(([field, message]) => {
          setError(field as keyof FormData, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        alert("Form submitted successfully!");
        console.log("Response:", response.data);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Something went wrong while submitting the form!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4 text-black">Zod & React-Hook-Form</h1>

        <FormField
          type="email"
          placeholder="Email"
          name="email"
          register={register}
          error={errors.email}
        />

        <FormField
          type="text"
          placeholder="GitHub URL"
          name="githubUrl"
          register={register}
          error={errors.githubUrl}
        />

        <FormField
          type="number"
          placeholder="Years of Experience (1 - 10)"
          name="yearsOfExperience"
          register={register}
          error={errors.yearsOfExperience}
          valueAsNumber
        />

        <FormField
          type="password"
          placeholder="Password"
          name="password"
          register={register}
          error={errors.password}
        />

        <FormField
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
        />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Form;
