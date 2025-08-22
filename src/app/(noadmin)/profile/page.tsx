import { auth } from '@/shared/api/auth/auth';

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    return <div className="container-section">Please sign in to view your profile.</div>;
  }

  return (
    <div className="container-section">
      <h1>Profile Page</h1>
      <p>Welcome, {session.user?.name || 'User'}!</p>
      <p>Email: {session.user?.email}</p>
      <p>User ID: {session.user?.id}</p>
    </div>
  );
};
export default ProfilePage;
