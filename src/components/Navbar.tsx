import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";
import { FaBars, FaHome, FaSignInAlt, FaSignOutAlt} from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { userApi } from "../features/api/userApiSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
    const user_id = user?.user.user_id;
    const{data:userData} = userApi.useGetUserByIdQuery(user_id,{
        skip: !isAuthenticated
    });
    const profilePicture = `https://ui-avatars.com/api/?name=${userData?.full_name}&background=random` || 'https://via.placeholder.com/150';

    const handleLogout = () => {
        dispatch(clearCredentials());
        navigate('/login');
    };

    return (
        <div className="navbar  bg-neutral text-neutral-content">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <FaBars className="text-xl text-green-600" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <Link to="/" className="flex items-center text-dark font-bold hover:text-gray-300">
                                <FaHome className="mr-2 text-2xl text-green-600" />
                                Home
                            </Link>
                        </li>                       
                        
                    </ul>
                </div>
                <Link to="/" className="">
                    <span>DataVista</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/" className="flex items-center text-dark font-bold hover:text-gray-300">
                            <FaHome className="text-2xl text-green-600 mr-2" />
                            Home
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                {!isAuthenticated ? (
                    <Link to="/login" className="btn btn-ghost text-dark text-xl flex items-center">
                        <FaSignInAlt className="mr-2 mt-1 text-xl text-green-600" />
                        Login
                    </Link>
                ) : (
                    <div className="dropdown dropdown-end">
                        <button className="btn btn-ghost flex items-center ">  
                            <span className="text-dark">Hey,</span>                              
                            <svg
                                className="w-6 h-6 "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>                     
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="profile"
                                            src={ profilePicture} />
                                    </div>
                                </div>

                        </button>
                        <ul className="dropdown-content bg-neutral-200 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <Link
                                    to={role === 'admin' ? '/dashboard/admin' : '/dashboard/me'}
                                    className="flex items-center  hover:text-gray-300 mb-2"
                                >
                                    <GrDashboard className="mr-3 text-xl text-green-600" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="flex items-center  hover:text-gray-300">
                                    <FaSignOutAlt className="text-xl text-green-600 mr-3" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
