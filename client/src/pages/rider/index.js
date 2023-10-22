import React , {useEffect, useState} from 'react'
import { io } from "socket.io-client";
const socket = io("http://localhost:3005/");
import { Heading,Text,Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { useSelector , useDispatch  } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/redux/reducerSlices/userSlice';
import { GoogleMap, useJsApiLoader ,MarkerF ,Autocomplete} from '@react-google-maps/api';
import { Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider} from '@chakra-ui/react';
import axios from 'axios';
import { Footer } from '..';

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

const index = () => {
    const router = useRouter();
    const [availableRides , setAvailableRides] = useState([]);
    const [selectedCard , setSelectedCard] = useState({});
    const [acceptRide , setAcceptRide] = useState(false);
    const {token , isLoggedIn} = useSelector(state=> state.user);
    const {userDetails} = useSelector(state=>state.user)
    const { isLoaded, loadError } = useJsApiLoader({
      libraries: ['places'],
      googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" 
    })
    const containerStyle = {
      width: '800px',
      height: '400px'
    };
     const fetchExistingRides = async()=>{
      const {data} = await axios.get('http://localhost:3005/rides?status=pending');
     if(data) 
     {
       setAvailableRides(data.rideList);
     }
     }

    useEffect(()=>{
         fetchExistingRides();
        socket.on('rides',(rides)=>{
            setAvailableRides(rides);
        })
    })

 


   const accRide =(rideId) =>{
          socket.emit('accRide',{rideId , riderId : userDetails._id}); 
   }
   
  return (
    <div>
    <div style={{backgroundColor:"rgb(255, 94, 0)",minHeight:"100vh"}}>
       <div  >
       <main className='container' >
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
      {
        acceptRide ? (<p style={{textAlign:'center',fontWeight:'bolder',margin:'20px auto'}}>You have accepted the ride.Please call your customer.</p>
                      ) 
                       :
         (<p style={{textAlign:'center',fontWeight:'bolder',margin:'20px auto'}}>Hello Rider , Here are your ride requests </p>
          )               
      }
        <div  style={{backgroundColor:"rgb(255, 94, 0)" ,width:'100%' ,gap:"0px 50px",margin:'auto',display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>

        {availableRides.length>0 && availableRides.map((item,index) =>{
       return (
           !acceptRide &&
           
        <Card maxW='sm' className='m-5 '  variant={"filled"}>
         <CardHeader>
         <Heading size='md'>{'From :'}{(item.pickInputAddress).substring(0,20) + '...'} </Heading>
         <Heading size='md'>{"To :"} {(item.destinationAddress).substring(0,20) + '...'} </Heading>
         
         </CardHeader>
        <CardBody>
        <Text style={{fontWeight:'bold'}}>Customer contact Number:{item.phoneNumber || item.user.phoneNumber}</Text>
        <Text>Estimated Price:{item.estPrice}</Text>
        <Text>Final Price:{item.finalPrice || item.estPrice}</Text>
         <button
           onClick={()=>{setSelectedCard(item)
           setAcceptRide(true)
           accRide(item._id)
                  }}
          style={{backgroundColor:'yellowgreen' ,padding:'7px' ,borderRadius:'5px'}}>
          Accept ride
         </button>
        </CardBody>
       </Card>)
        })}

        {
          (
           acceptRide &&
        <Card  maxW='sm' className='m-10'  variant={"filled"} >
         <CardHeader>
         <Heading size='md'>{'From :'}{(selectedCard.pickInputAddress).substring(0,20) + '...'} </Heading>
         <Heading size='md'>{"To :"} {(selectedCard.destinationAddress).substring(0,20) + '...'} </Heading>
         
         </CardHeader>
        <CardBody>
        <Text style={{fontWeight:'bold'}}>Customer contact Number:{selectedCard.phoneNumber ||selectedCard.user?.phoneumber}</Text>
        <Text>Estimated Price:{selectedCard.estPrice}</Text>
        <Text>Final Price:{selectedCard.finalPrice}</Text>
        <div style={{display:'flex',justifyContent:'space-between'}}>
        <button
          style={{backgroundColor:'yellowgreen' ,padding:'7px' ,borderRadius:'5px',cursor:'default'}} >
          Ride accepted
         </button>
        <button
          onClick={()=>window.location.href = "/rider"}
          style={{backgroundColor:'red' ,padding:'7px' ,borderRadius:'5px',cursor:'cursor'}} >
          Take another ride
         </button>
        </div>
        
        </CardBody>
       </Card>
        )
        }
        {
          <div className='map' style={{margin:'30px 30px'}}>
          {(isLoaded && acceptRide) && 
            <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedCard.currentPos.lat ? selectedCard.currentPos : center}
          zoom={10}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <>
          <MarkerF position={selectedCard.currentPos} />
          <MarkerF position={selectedCard.currentDestinationPos} />
          </>
        </GoogleMap>}
        
         </div>
        } 
    </div>
  </div>
</div>
    <Footer/>
    </div>
    
    
  )
}

export default index