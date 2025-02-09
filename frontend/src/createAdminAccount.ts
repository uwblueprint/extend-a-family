import authAPIClient from "./APIClients/AuthAPIClient.js";

const createAdminAccount = async () => {
  const firstName = "Abeer";
  const lastName = "Das";
  const email = "abeerdas647+3@gmail.com";
  const password = "abeerabeer";
  const role = "Administrator";

  try {
    const user = await authAPIClient.signup(
      firstName,
      lastName,
      email,
      password,
      role,
    );
    if (user) {
      console.log("Admin account created successfully:", user);
    } else {
      console.error("Failed to create admin account.");
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};

createAdminAccount();
