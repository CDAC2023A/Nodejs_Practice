// interfaces.ts

export interface RegistrationData {
  name: string;
  email: string;
  phone: number;
  password: string;
  dob: string;
  gender: string;
  role: "admin" | "student" | "librarian";
}

export interface LoginData{
    email:string;
    password:string;
}
