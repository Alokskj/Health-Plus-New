import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LOGO } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/rootReducer";
import { AiOutlineLogout } from "react-icons/ai";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="bg-white z-50 w-full p-5 h-14 fixed flex items-center justify-between border-b border-b-gray-200 shadow-md">
      <div className="flex items-center">
        <img className="w-28" src={LOGO} alt="health-plus" />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="w-9 h-9">
              <AvatarImage className="w-10 h-10" src={user?.profilePic} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.profilePic}
                  alt="user-profile"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs font-normal">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <AiOutlineLogout size={18} />
              <span className="mb-[2px]">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
