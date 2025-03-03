import { User } from "next-auth";

export interface User {
  name: string;
  email: string;
  image: string;
}
