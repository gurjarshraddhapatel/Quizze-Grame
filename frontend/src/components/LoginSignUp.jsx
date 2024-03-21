import React, { useContext, useState } from 'react'
import '../index.css'
import styles from '../styles/loginSignup.module.css'
import axios from 'axios'
import { userServer } from '../App'
import { Context } from '..'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

const LoginSignUp = () => {

    const [shadowForSignUp, setShadowForSignUp] = useState(true)
    const [shadowForLogin, setShadowForLogin] = useState(false)

    const[loginBtn, setLoginBtn] = useState(false)
    const[signUpBtn, setSignUpBtn] = useState(true)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const {loading, setLoading, isAuthenticated, setIsAuthenticated} = useContext(Context)


    const signup = () => {
        setShadowForSignUp(true)
        setSignUpBtn(true)
        setLoginBtn(false)
        setShadowForLogin(false)
    }

    const login = () => {
        setShadowForLogin(true)
        setLoginBtn(true)
        setSignUpBtn(false)
        setShadowForSignUp(false)
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!name) {
            toast.error("Name field cannot be empty.");
            setLoading(false);
            return;
        } else if (name.length < 3) {
            toast.error("Please enter a valid name. It should be at least 3 characters long.");
            setLoading(false);
            return;
        }
        
        if (!email) {
            toast.error("Email field cannot be empty.");
            setLoading(false);
            return;
        } else if (!email.includes('@')) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        
        if (!password) {
            toast.error("Password field cannot be empty.");
            setLoading(false);
            return;
        } else if (password.length < 8) {
            toast.error("Your password is too weak. It should be at least 8 characters long.");
            setLoading(false);
            return;
        }
        
        if (!confirmPassword) {
            toast.error("Confirm password field cannot be empty.");
            setLoading(false);
            return;
        } else if (password !== confirmPassword) {
            toast.error("Password and confirm password do not match.");
            setLoading(false);
            return;
        }

        try {
            const {data} = await axios.post(`http://localhost:4000/api/v1/user/register`, {name, email, password, confirmPassword}, {withCredentials : true, headers : {"Content-Type" : "application/json"}});
            toast.success(data.message);
            console.log(data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!email) {
            toast.error("Email field cannot be empty.");
            setLoading(false);
            return;
        } else if (!email.includes('@')) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        
        if (!confirmPassword) {
            toast.error("Password field cannot be empty.");
            setLoading(false);
            return;
        } else if (confirmPassword.length < 8) {
            toast.error("Your password is too weak. It should be at least 8 characters long.");
            setLoading(false);
            return;
        }

        try {
            const {data} = await axios.post(`http://localhost:4000/api/v1/user/login`, {email, password : confirmPassword}, {withCredentials : true, headers : {"Content-Type" : "application/json"}})
            toast.success(data.message)
            setLoading(false)
            setIsAuthenticated(true)
        } catch (error) {
            toast.error(error.response.data.message)
            setIsAuthenticated(false)
            setLoading(false)
        }
    }

    if(isAuthenticated) return <Navigate to={'/home'}/>

  return (
    <div className={`${styles.parent} container`}>
       <div className={styles.child_box}>
            <div className={styles.box}>
                <h2>quizzie</h2>
                <div className={styles.login_signup_btns}>
                    <button onClick={signup} className={shadowForSignUp ? styles.btn_shadow : null}>Sign Up</button>
                    <button onClick={login} className={shadowForLogin ? styles.btn_shadow : null}>Log In</button>
                </div>
                    { signUpBtn ? 
                        <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.form_group}>
                            <label htmlFor="name">Name</label>
                            <input onChange={(e) => setName(e.target.value)} type="text" id="name" />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" />
                        </div>
        
                        <div className={styles.form_group}>
                            <label htmlFor="pass">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="pass" />
                        </div>
        
                        <div className={styles.form_group}>
                            <label htmlFor="cnfPss">Confirm Password</label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="cnfPss" />
                        </div>
                        <div className={styles.btn_div}>
                            <button>{loading ? "Wait..." : "Sign-Up"}</button>
                        </div>
                    </form>
                    :
                    <form onSubmit={handleLogin} className={styles.form}>
    
                        <div className={styles.form_group}>
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" id="email" />
                        </div>
        
                        <div className={styles.form_group}>
                            <label htmlFor="pass">Password</label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="pass" />
                        </div>
        
                        <div className={styles.flex}>
                            <button className={` ${styles.login_btn}`}>{loading ? "Please wait..." : "Log In"}</button>
                        </div>
                    </form>    
                }
            </div>
       </div>
    </div>
  )
}

export default LoginSignUp
