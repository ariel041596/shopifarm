import bcryptjs from "bcryptjs";
const users = [
  {
    name: "Admin User",
    email: "admin@admin.com",
    password: bcryptjs.hashSync("password", 10),
    isAdmin: true,
  },
  {
    name: "Ariel",
    email: "ariel@email.com",
    password: bcryptjs.hashSync("password", 10),
  },
  {
    name: "Client",
    email: "client@email.com",
    password: bcryptjs.hashSync("password", 10),
  },
];

export default users;
