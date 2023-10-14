"use client"
import React from 'react';
import { Formik, Form, Field ,resetForm} from 'formik';
import * as Yup from 'yup';
import style from '../../styles/form.module.css';
import { useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserDetails } from '@/redux/reducerSlices/userSlice';

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
  email: Yup.string().email('Invalid email').required('Required')
});


const UserForm = () => {
 const {userDetails} = useSelector (state=>state.user);
 const dispatch = useDispatch();
 const toast = useToast()

 const fetchUserDetails = async()=>{
    const res = await fetch('http://localhost:3005/users/' + userDetails._id);
    const data = await res.json();
     if(data){
      dispatch(changeUserDetails(data.userDetails));
     }
   }
 const editUsersDetails = async (values) =>{
  const res = await fetch('http://localhost:3005/account/'+userDetails._id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)  
  })
  const data = await res.json();
  if(res.status == 200){
    fetchUserDetails();
  }
}

 return (
  
  <div >
 <div className={style.container} style={{width:'27vw'}}>
    <h1 style={{fontSize:'30px',textAlign:'center',fontWeight:'bolder',color:'white'}}>Type below to edit </h1>
    <Formik
      initialValues={{firstName: '',
        lastName: '',
        phoneNumber:'',
        email: ''}}
      validationSchema={SignupSchema}
      onSubmit={(values,{resetForm}) => {
        editUsersDetails(values);
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
          <button type="submit" className={style.submitbtn}>Submit</button>
        </Form>
      )}
    </Formik>
  </div>
  </div>
 
);
}



          
export default UserForm;