import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userApi } from '../features/api/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import Navbar from '../components/Navbar';
import loginPic from '../assets/login1.svg';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import { RootState } from '../app/store';
import { setGdpData, setPopulationData, setGdpPerCapitaData, setExchangeRateData, setInflationRateData, setSafaricomSharePriceData } from '../features/dataSlice';
import { dataApi } from '../features/api/dataApiSlice';

type FormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [loginUser, { isLoading }] = userApi.useLoginUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
    const { data: gdpData } = dataApi.useGetGdpQuery(1, {});
    const { data: populationData } = dataApi.useGetPopulationQuery(1, {});
    const { data: gdpPerCapitaData } = dataApi.useGetGdpPerCapitaQuery(1, {});
    const { data: exchangeRateData } = dataApi.useGetExchangeRateQuery(1, {});
    const { data: inflationRateData } = dataApi.useGetInflationRateQuery(1, {});
    const {data: safaricomSharePriceData} = dataApi.useGetSafaricomSharePriceQuery(1, {});

    useEffect(() => {
        if (isAuthenticated) {
            // Fetch data once after login and store it in the Redux store
            if (gdpData) dispatch(setGdpData(gdpData));
            if (populationData) dispatch(setPopulationData(populationData));
            if (gdpPerCapitaData) dispatch(setGdpPerCapitaData(gdpPerCapitaData));
            if (exchangeRateData) dispatch(setExchangeRateData(exchangeRateData));
            if (inflationRateData) dispatch(setInflationRateData(inflationRateData));
            if (safaricomSharePriceData) dispatch(setSafaricomSharePriceData(safaricomSharePriceData));

            // Navigate based on the user's role
            if (role === 'admin') {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/me');
            }
        }
    }, [isAuthenticated, role, navigate, gdpData, populationData, gdpPerCapitaData, exchangeRateData,inflationRateData,safaricomSharePriceData, dispatch]);

    const onSubmit = async (data: FormValues) => {
        try {
            const user = await loginUser(data).unwrap();
            dispatch(setCredentials({ user, token: user.token, role: user.role }));
            navigate('/');
        } catch (err: any) {
            toast.error('Failed to login: ' + (err.data?.msg || err.msg || err.error || err));
        }
    };

    return (
        <>
            <Toaster toastOptions={{
                classNames: {
                    error: 'bg-red-400',
                    success: 'text-green-400',
                    warning: 'text-yellow-400',
                    info: 'bg-blue-400',
                },
            }}
            />
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow grid sm:grid-cols-2">
                    <div className="flex items-center justify-center">
                        <img src={loginPic} alt="Login Illustration" className="max-h-[50vh] w-[50vh]" />
                    </div>
                    <div className="flex items-center m-5 p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="card gap-6 p-10 shadow-xl rounded-lg w-full max-w-lg">
                            <h1 className="text-4xl text-dark text-center mb-6">Login</h1>
                            <div className="grid grid-cols-1 gap-2 place-items-center rounded-box max-w-fit min-w-full">
                                <label className="input input-bordered flex items-center gap-2 w-full max-w-xs">
                                    <input {...register("email", { required: true })} type="email" className="grow" placeholder="Email" />
                                </label>
                                {errors.email && <span className="text-red-600">Email is required</span>}
                                <label className="input input-bordered flex items-center gap-2 w-full max-w-xs">
                                    <input {...register("password", { required: true })} type="password" className="grow" placeholder="Password" />
                                </label>
                                {errors.password && <span className="text-red-600">Password is required</span>}
                            </div>
                            <div className="w-full flex justify-center">
                                <button type="submit" className="btn btn-success py-3 pb-10 px-10 rounded-lg text-lg">
                                    {isLoading ? <span className="loading loading-spinner text-error"></span> : 'Login'}
                                </button>
                            </div>
                            <NavLink to="/" className="text-dark mt-4 text-center block">
                                🏡 Go to HomePage
                            </NavLink>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-dark-400">
                                    Don't have an account?{' '}
                                    <NavLink to="/register" className="text-blue-500 hover:underline">
                                        Create here
                                    </NavLink>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
