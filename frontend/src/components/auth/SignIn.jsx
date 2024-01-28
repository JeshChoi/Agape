import React, { useState } from 'react';
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SignInError from './SignInError';
import SignUpError from './SignUpError';
import './SignIn.css';


const SignIn = () => {
    const [signInEmail, setSignInEmail] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signInError, setSignInError] = useState(false);
    const [signUpError, setSignUpError] = useState(false);

    const navigate = useNavigate();
    
    const signIn = (e) => {
        e.preventDefault();
            signInWithEmailAndPassword(auth, signInEmail, signInPassword).then((userCredential) => 
            {const userUID = userCredential.user.uid; console.log(userCredential); navigate("/Home", { state: { uid: userUID  } });}).catch((error) => {
            console.log(error);
            setSignInError('Error signing in');
        })
    }

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword).then(
            (userCredential) => {
                const userUID = userCredential.user.uid;
                console.log(userCredential);
                navigate("/Home", { state: { uid: userUID  } });})
            .catch((error) => {
            console.log(error);
        });
    };

    const handleSignInErrorClose = () => {
        setSignInError(false);
    };

    const handleSignUpErrorClose = () => {
        setSignUpError(false);
    };

    return (
        <div className='page'>
            <div className='title-container'>
            <div className='name'>
            <h1>AGAPE</h1>
            </div>
            </div>
            <div className='vertical-line'></div>
        
        <div className='sign-in-container'>
            <div className='sign-in-form'>
            <form onSubmit={signIn}>  
                <div>
                    <h1>Sign In</h1>
                    <div>
                    <input type="email" placeholder='Enter your email' value={signInEmail} onChange={(e)=> setSignInEmail(e.target.value)}></input>
                    <input type="password" placeholder='Enter your password' value={signInPassword} onChange={(e)=> setSignInPassword(e.target.value)}></input>
                    </div>
                    <button className='auth-button' type="submit">Log In</button>
                </div>
                
            </form>
            </div>
            
            <div className='sign-up-form'>
            <form onSubmit={signUp}>  
                <h1>Create Account</h1>
                <div>
                <input type="email" placeholder="Enter your email" value={signUpEmail} onChange={(e)=> setSignUpEmail(e.target.value)}></input>
                <input type="password" placeholder="Enter your password"  value={signUpPassword} onChange={(e)=> setSignUpPassword(e.target.value)}></input>
                </div>
                <button className='auth-button' type="submit">Sign Up</button>
                {signUpError && <SignUpError message={signUpError} />}
            </form>
            </div>
        

        
        </div>

        {signInError && <SignInError onClose={handleSignInErrorClose} message={signInError} />}
        </div>
        
    )
    
}

export default SignIn;