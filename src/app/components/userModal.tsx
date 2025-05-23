import React, { useState, useEffect } from 'react';

interface UserData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  bar: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  mode: 'add' | 'edit';
  initialData?: Partial<UserData>;
  onSubmit: (data: UserData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<Props> = ({ mode, initialData = {}, onSubmit, isOpen, onClose }) => {
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    username: '',
    email: '',
    role: '',
    bar: '',
    password: '',
    confirmPassword: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="text-2xl font-bold mb-4">
          {mode === 'add' ? 'Add New Account' : 'Edit Account'}
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="input input-bordered w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Role</option>
              <option>Staff</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Bar</span>
            </label>
            <select
              name="bar"
              value={formData.bar}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Bar</option>
              <option>NOIR</option>
              <option>BarSan</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input input-bordered w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action mt-4 md:col-span-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-neutral">
              {mode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
