import React from 'react';
import {useSelector ,useDispatch }  from 'react-redux';
import { Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Footer } from '..';
import Link from 'next/link';
import { logout } from '@/redux/reducerSlices/userSlice';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    onOpen,
    isOpen,
    onClose,
    useDisclosure
  } from '@chakra-ui/react';
import UserForm from '@/components/UserForm';
import styles from '@/styles/account.module.css';

const index = () => {
    const {token , isLoggedIn} = useSelector(state=> state.user);
    const {userDetails} = useSelector(state => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const uploadImage = async(file) =>{
      const formData = new FormData();
      formData.append('avatar',file)
      const res = await fetch('http://localhost:3005/users-image/'+userDetails._id, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
    }
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

    return (
      <div>
       <div className={styles.container} >
      <main   className='container'>
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
       <div className={styles.box}>
       <div className={styles.account}>
        <h1 className={styles.heading}> Account </h1>
         <Image className={styles.img} src={  'http://localhost:3005/users-image/'+userDetails._id || '/profile.png' } 
         key={Math.random()} width={'100'} height={'100'} alt='' />
     

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change your details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
               <UserForm/>
          </ModalBody>
        </ModalContent>
      </Modal>
    <span>General information</span>
    <hr className={styles.line}/>
    <div className={styles.basicinfo}>
    <p>First name : {userDetails.firstName}</p>
    <p>Last name : {userDetails.lastName}</p>
    <p>Phone number :+977 {userDetails.phoneNumber}</p>
    <p>Email address : {userDetails.email}</p>
    <p>Role : {userDetails.role}</p>
    </div>
   
  </div>
     <div className={styles.settings}>
      <h1 className={styles.heading}>Settings</h1>
      <hr className={styles.line}/>
     <div ><Button onClick={onOpen} style={{backgroundColor:'yellowgreen'}}>Edit your personal information</Button></div>
    <span style={{color:'black',textAlign:'center'}}>Change your profile picture :</span>
    <div style={{width:'auto'}}><input style={{color:'black',backgroundColor:'yellowgreen',borderRadius:'20px'}}type='file' onChange={(e) => uploadImage(e.target.files[0])}/></div>
     </div>
       </div>
       
    </div>
    <Footer/>
      </div>
   
  )
}

export default index