import { signInAnonymously, signInWithPopup, signOut } from '@firebase/auth';
import { auth, googleAuthProvider } from '@src/lib';
import toast from 'react-hot-toast';

interface CustomButtonProps {
  buttonText: string;
  handleClick: () => void;
  className: string;
}
const CustomButton = (props: CustomButtonProps) => {
  const { className, handleClick, buttonText } = props;
  return (
    <button className={className} onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export const AnonymouseSignInButton = () => {
  const handleClick = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      toast.error('Anonymous sign in failed');
    }
  };
  return <CustomButton buttonText="Skip" handleClick={handleClick} className={'btn btn-primary'} />;
};

export const GoogleSignInButton = () => {
  const handleClick = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      toast.error('Sign in failed');
    }
  };
  return <CustomButton buttonText="Sign In with Google" handleClick={handleClick} className={'btn btn-primary'} />;
};

export const LogoutButton = () => {
  const handleClick = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error('Logout failed');
    }
  };
  return <CustomButton buttonText="Logout" handleClick={handleClick} className={'btn btn-primary'} />;
};
