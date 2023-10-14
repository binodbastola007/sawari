import React from 'react'
import style from '@/styles/form.module.css'
import styles from '@/styles/admin.module.css'
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Formik, Form, Field ,resetForm} from 'formik';
import Link from 'next/link';


const CustomMenu = () => {
  const dispatch = useDispatch();
  const router = useRouter();
 return (
   <>
               <Menu width={'0px'} height={'50px'}>
                 <MenuButton
                   transition='all 0.1s'
                   borderRadius='full'
                   borderWidth='none'
                 >
                   <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ring-2 ring-gray-300 dark:ring-gray-500">
                     <svg className="absolute w-10 h-10 text-gray-400 -left-1" focusable="flase" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                   </div>
                 </MenuButton>
                 <MenuList >
                   <div className='flex flex-col justify-center '>
                     <button className='buttonnav' onClick={()=> router.push('/account')} >My Account</button>
                     <button className='buttonnav' onClick={()=> router.push('/')} >Home</button>
                     <button className='buttonnav' onClick={()=> dispatch(logout())} >Logout</button>
                   </div>
                 </MenuList>
               </Menu>
             </>
 )
 
}




const Admin = () => {
  
  const router = useRouter();
  const {token , isLoggedIn} = useSelector(state=> state.user);
  const toast = useToast()
  const registerVehicle = async (values) => {
    const res = await fetch('http://localhost:3005/vehicle-info', {
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
      <div className='navbar'>
      <Image className='logo'
              src="/logo.jpg"
              alt="Vercel Logo"
              width={100}
              height={24}
            />
        <p className='title'>
          Welcome to Sawari
        </p>
        <div >
          {isLoggedIn ? (<CustomMenu/>) : (<div className='btn'>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>)}
        </div>
        
      </div>
      </main>

      <div className={styles.container}>
      <button onClick={()=>router.push('/dashboard')} className={styles.btn}>Dashboard</button>
       <div className={styles.box}>
       <Formik
      initialValues={{
        vehicle: '',
        pricePerUnitKm: ''
      }}
   
      onSubmit={(values,{resetForm}) => {
        registerVehicle(values);
        resetForm();
        
      }}
    >
      {({ errors, touched }) => (
        <Form className={style.form}>
        <h1 className={styles.heading}>Vehicle Information</h1>
          <Field className={style.formElements} placeholder="Vehicle type(car or bike)" name="vehicle" />
          {errors.vehicle && touched.vehicle ? (
            <div className={style.err}>{errors.vehicle}</div>
          ) : null}
          <Field className={style.formElements} placeholder="Price per unit kilometre(in Rs)" name="pricePerUnitKm" />
          {errors.pricePerUnitKm && touched.pricePerUnitKm ? (
            <div className={style.err}>{errors.pricePerUnitKm}</div>
          ) : null}
          <button type="submit" className={style.submitbtn}>Add vehicle</button>
        </Form>
      )}
    </Formik>
       </div>
       
       
    </div>
    </>
    
  )
}

export default Admin