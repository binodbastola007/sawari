"use client"
import React from 'react';
import { Formik, Form, Field ,resetForm} from 'formik';
import * as Yup from 'yup';
import style from '../../styles/form.module.css';
import { useToast } from '@chakra-ui/react'
import { setLoginDetails } from '@/redux/reducerSlices/userSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { color } from 'framer-motion';
import Image from 'next/image';
import { Footer } from '..';


const SigninSchema = Yup.object().shape({
 
  phoneNumber: Yup.string()
    .min(9,'Too Short!')
    .max(11,'Too Long')
    .required('Required'),
  password: Yup.string()
  .min(7, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required')
});
 
const login = () => {

const toast = useToast();
const router = useRouter();
const dispatch = useDispatch();

const handleLogin = async (values) => {
 const res = await fetch('http://localhost:3005/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)  
  })
  const data = await res.json();
  if(data.isLoggedIn){
    dispatch(setLoginDetails(data));
    if(data.userDetails.role == 'Rider'){
      router.push('/rider');
    }
    else{
      router.push('/');
    }
    
  }
 

  toast({
    title: data.msg,
    status: res.status==401 ?'warning' : 'success',
    isClosable: true,
  })
  


}
return (
  <>
      <main className='container'>
      <div className='navbarLogin'>
      <Image className='logoLogin'
              src="/logo.jpg"
              alt="Vercel Logo"
              width={100}
              height={24}
            />
        <p className='titleLogin'>
         Welcome to Sawari
        </p>
        </div>
      </main>
  <div className={style.bg}>
 <div className={style.container}>
    <h1 style={{fontSize:'30px',textAlign:'center',fontWeight:'bolder', color:'white'}}>Sign In</h1>
    <Formik
      initialValues={{
        phoneNumber:'',
        password: '',
      }}
      validationSchema={SigninSchema}
      onSubmit={(values,{resetForm}) => {
        handleLogin(values);
        resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form className={style.form}>
          
          <Field className={style.formElements} placeholder="Phone number"  name="phoneNumber" />
          {errors.phoneNumber && touched.phoneNumber ? (
            <div className={style.err}>{errors.phoneNumber}</div>
          ) : null}
          
          <Field className={style.formElements} placeholder="Password"  name="password" />
          {errors.password && touched.password ? (
            <div className={style.err}>{errors.password}</div>
          ) : null}
          
          <button type="submit" className={style.submitbtn}>Submit</button>
        </Form>
      )}
    </Formik>
  </div>
  <div className='footbar'>
    Don't have an account ? <Link href='/register'> &nbsp;<span className= 'reflink' >Sign up</span></Link>
  </div>
  </div>
  <Footer/>
  </>
);
          }
export default login;