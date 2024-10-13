import React from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGO } from "@/assets";
import { login } from "@/store/slices/authSlice";

interface IState {
  loading: boolean;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<IState["loading"]>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signup", values);
      if (data && data?.success) {
        const authData = {
          isAuthenticated: true,
          token: data?.token,
          user: data?.data,
        };
        toast.success(data?.message);
        dispatch(login(authData));
        navigate("/");
      }
    } catch (error: any) {
      if (error && error?.response) {
        toast.error(error?.response?.data?.error);
      }
      console.log("Error : ", error?.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen w-full px-5 md:px-0">
      <div className="w-full md:w-[30%] bg-white shadow-md border border-gray-300 rounded-lg p-5">
        <div className="flex items-center justify-center mb-5">
          <img className="w-28" src={LOGO} alt="health-plus" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address *</FormLabel>
                  <FormControl>
                    <Input placeholder="john@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-3" type="submit">
              {loading ? "Please wait.." : "Sign Up"}
            </Button>

            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-sm">Already have an account?</span>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
