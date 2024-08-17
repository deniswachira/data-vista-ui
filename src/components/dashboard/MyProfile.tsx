import { useEffect, useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { userApi } from '../../features/api/userApiSlice';

interface FormValues {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  password?: string;
}

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [updateProfile, { isLoading }] = userApi.useUpdateUserProfileMutation();
  const { data: userData } = userApi.useGetUserByIdQuery(user?.user.user_id, {
    skip: !isAuthenticated,
  });
  const profilePicture = `https://ui-avatars.com/api/?name=${userData?.full_name}&background=random` || 'https://via.placeholder.com/150';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role !== 'admin') {
      navigate('/dashboard/me');
    }
  }, [isAuthenticated, role, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Data to update", data);
    try {
      await updateProfile({ ...data, user_id: user?.user.user_id }).unwrap();
      handleModalToggle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen text-dark py-10 px-5">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={userData?.profile_picture || profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-500"
            />
            <div>
              <h2 className="text-3xl font-bold">{userData?.full_name}</h2>
              <p className="text-gray-400">{userData?.email}</p>
            </div>
          </div>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleModalToggle}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
            <p className="mb-2">
              <span className="font-bold">Phone:</span> {userData?.phone_number}
            </p>
            <p className="mb-2">
              <span className="font-bold">Address:</span> {userData?.address}
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button onClick={handleModalToggle} className="text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900"
                  defaultValue={userData?.full_name}
                  {...register('full_name', { required: 'Full Name is required' })}
                />
                {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900"
                  defaultValue={userData?.email}
                  {...register('email', { required: 'Email is required' })}
                  disabled
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900"
                  defaultValue={userData?.phone_number}
                  {...register('phone_number', { required: 'Phone Number is required' })}
                />
                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900"
                  defaultValue={userData?.address}
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
