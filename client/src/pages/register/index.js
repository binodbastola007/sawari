"use client"
import React from 'react';
import { Formik, Form, Field ,resetForm} from 'formik';
import * as Yup from 'yup';
import style from '../../styles/form.module.css';
import { useToast } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '..';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  phoneNumber: Yup.string()
    .min(9,'Too Short!')
    .max(11,'Too Long')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
  .min(7, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required'),
  confirmPassword: Yup.string()
  .min(7, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required'),
  role: Yup.string().required('Required')
  
});
 
const register = () => {

const toast = useToast()
const handleRegister = async (values) => {
  console.log(values);
 const res = await fetch('http://localhost:3005/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)  
  })
  const data = await res.json();
  toast({
    title: data.msg,
    status: res.status==409 ?'warning' : 'success',
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
    <h1 style={{fontSize:'30px',textAlign:'center',fontWeight:'bolder',color:'white'}}>Sign Up</h1>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        phoneNumber:'',
        email: '',
        password: '',
        confirmPassword: '',
        role:''
      }}
      validationSchema={SignupSchema}
      onSubmit={(values,{resetForm}) => {
        handleRegister(values);
        resetForm();
        
      }}
    >
      {({ errors, touched }) => (
        <Form className={style.form}>
          <Field className={style.formElements} placeholder="Firstname" name="firstName" />
          {errors.firstName && touched.firstName ? (
            <div className={style.err}>{errors.firstName}</div>
          ) : null}
          <Field className={style.formElements} placeholder="Lastname" name="lastName" />
          {errors.lastName && touched.lastName ? (
            <div className={style.err}>{errors.lastName}</div>
          ) : null}
          <Field className={style.formElements} placeholder="Phone number"  name="phoneNumber" />
          {errors.phoneNumber && touched.phoneNumber ? (
            <div className={style.err}>{errors.phoneNumber}</div>
          ) : null}
          <Field className={style.formElements} placeholder="Email"  name="email" type="email" />
          {errors.email && touched.email ? 
          <div className={style.err}>{errors.email}</div> : null}
          
          <Field className={style.formElements} placeholder="Password"  name="password" />
          {errors.password && touched.password ? (
            <div className={style.err}>{errors.password}</div>
          ) : null}
          <Field className={style.formElements} placeholder="Confirm password"  name="confirmPassword" />
          {errors.confirmPassword && touched.confirmPassword ? (
            <div className={style.err}>{errors.confirmPassword}</div>
          ) : null}
          <Field component='select' name='role' id='roles' placeholder='Choose your role'>
            <option disabled >Choose your role</option>
            <option value="User">User</option>
            <option value="Rider">Rider</option>
          </Field>
          {errors.role && touched.role ? (
            <div className={style.err}>{errors.role}</div>
          ) : null}
          
          <button type="submit" className={style.submitbtn}>Submit</button>
        </Form>
      )}
    </Formik>
  </div>
  <div className='footbar'>
    Don't have an account ? <Link href='/login'> &nbsp;<span className= 'reflink' >Sign in</span></Link>
  </div>
  </div>
  <Footer/>
   </>
 
 
);
          }
export default register;