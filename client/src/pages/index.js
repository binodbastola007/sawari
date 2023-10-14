import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
const inter = Inter({ subsets: ['latin'] })
import { Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider} from '@chakra-ui/react';
import { HamburgerIcon ,AddIcon , IconButton,ExternalLinkIcon } from '@chakra-ui/icons';
import { logout } from '@/redux/reducerSlices/userSlice';
import { useRouter } from 'next/router';
import { GoogleMap, useJsApiLoader ,MarkerF ,Autocomplete} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { Tooltip } from '@chakra-ui/react'
import styles from '@/styles/map.module.css';
import { getDistance } from 'geolib';
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
import { io } from "socket.io-client";
import index from '@/components/Map';
const socket = io("http://localhost:3005/");


const CustomModal = (props) =>{
  return (
    <Modal isOpen={props.isOpen} onClose={()=>{props.onClose()
    }}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Enter your phone number</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
           <input onChange={(e)=>props.setPhoneInput(e.target.value)} placeholder='Entert your phone number '/>
      </ModalBody>
      <button onClick={()=>{props.onClose()}}>Save</button>
    </ModalContent>
  </Modal>
  )
}
export const Footer =()=>{
  return(
    <div className='navbar'>
      <p style={{textAlign:'center',color:'white',fontSize:'27px'}}>
        &copy; 2023 Sawari Technologies Inc. Request your ride anywhere and anytime 
      </p> 
    </div>
  )
}
const CustomMenu = () => {
   const dispatch = useDispatch();
   const router = useRouter();
   const {userDetails} = useSelector(state=>state.user)
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
                      { userDetails.role == 'Rider' &&
                        ( 
                          <button className='buttonnav' onClick={()=> router.push('/rider')} >Ride requests</button>
                        )
                      }
                      <button className='buttonnav' onClick={()=> router.push('/')} >Home</button>
                      <button className='buttonnav' onClick={()=> dispatch(logout())} >Logout</button>
                    </div>
                  </MenuList>
                </Menu>
              </>
  )
  
}
const Placescard =(props) =>{
  if(props.searchedPlaceList?.length == 0 ){
    return "No places found"
  }
   return(
      <div className={styles.autocompleteBox}
       onMouseLeave={()=>{props.setIsSelectionOngoing(false)}}
       onMouseOver={()=>{props.setIsSelectionOngoing(true)}}
      >
        {(props.searchedPlaceList.length>0) && props.searchedPlaceList.map((item)=>{
          return <div className={styles.autocompleteList}
          onClick={()=> {
               props.setZoom(14);
             if(props.input1On){
              props.setPickInputAddress(item.formatted)
              props.setCurrentPos({
              lat:item.lat,
              lng:item.lon
            })
            }
            if(props.input2On){
              props.setDestinationInputAddress(item.formatted)
              props.setCurrentDestinationPos({
              lat:item.lat,
              lng:item.lon
            })
            }
            props.setPickUpOpen(false)
          }}>
           {item.formatted.length>15 ? item.formatted.substring(0,80) + '....' : item.formatted}
                </div>
        })}
      </div>
    )
  }



export default function Home() {

  useEffect(()=>{
    socket.on("connnection");
  },[])
  const [rideAcceptDetails ,setRideAcceptDetails] = useState({});
 
  useEffect(()=>{
    socket.on("accRide" , (rideAcceptDetails) =>{
       if(rideAcceptDetails.user == userDetails._id){
       setRideAcceptDetails(rideAcceptDetails);
           
       }
    })
  },[socket])

  const {userDetails} = useSelector(state=>state.user)
  const position = {
    lat: 27.700769,
    lng: 85.300140
  }
  
  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['places'],
    googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" 
  })
  const router = useRouter();
  const [phoneInput, setPhoneInput] = useState('');
  const [isSelectionOngoing,setIsSelectionOngoing] = useState(false);
  const [pickInputAddress , setPickInputAddress] = useState('');
  const [destinationAddress,setDestinationInputAddress] = useState('');
  const [pickUpOpen , setPickUpOpen] = useState(false);
  const [zoom , setZoom] = useState(13);
  const [ currentPos , setCurrentPos ]=useState({
    lat: 27.6758528,
    lng: 84.4365824
  });
  const [ currentDestinationPos , setCurrentDestinationPos ]=useState({
    lat: 27.6758528,
    lng: 84.4365824
  });
  const [input1On,setInput1On] = useState(false);
  const [input2On,setInput2On] = useState(false);
  const [vehicleInfoList,setVehicleInfoList] = useState([]);
  const [selectedVehicle,setSelectedVehicle] = useState({});
  const {token , isLoggedIn} = useSelector(state=> state.user);
  const[searchedPlaceList , setSearchedPlaceList] = useState([]);
  const [priceChangeCount , setPriceChangeCount] = useState(0);
  const [phoneValidationOpen , setPhoneValidationOpen] = useState(false);
  

  const getVehicleInfo = async() =>{
    const res = await fetch('http://localhost:3005/vehicle-info', {
      method: "GET",
    });
    const data = await  res.json();
    if(data){
      setVehicleInfoList(data);
    }
  }

  useEffect(()=>{
    getVehicleInfo();
    navigator.geolocation.getCurrentPosition(async(latlan)=>{
      const {latitude,longitude } = latlan.coords
      setCurrentPos({lat:latitude,lng:longitude})
      const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=2f0ba47327124778869bc4fec53fae04`)
      const data = await res.json();
      if(data.results){
      setPickInputAddress(data.results[0].formatted);
     }
      
    })
  },[])
  const generatePlaces = async(text) => {
    setPickUpOpen(true);
    setPickInputAddress(text);
    const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&format=json&apiKey=2f0ba47327124778869bc4fec53fae04`);
    const data = await res.json();
   if(data.results){
    setSearchedPlaceList(data.results);
 }
  }
  const changePickupAddress = async(e) => {
     setCurrentPos({
      lat:e.latLng.lat(),
      lng:e.latLng.lng()
     })
     
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${e.latLng.lat()}&lon=${e.latLng.lng()}&format=json&apiKey=2f0ba47327124778869bc4fec53fae04`)
     const data = await res.json();
     if(data.results){
      setPickInputAddress(data.results[0].formatted);
     }
    }
  const changeDestinationAddress = async(e) => {
     setCurrentDestinationPos({
      lat:e.latLng.lat(),
      lng:e.latLng.lng()
     })
     
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${e.latLng.lat()}&lon=${e.latLng.lng()}&format=json&apiKey=2f0ba47327124778869bc4fec53fae04`)
     const data = await res.json();
     if(data.results){
      setDestinationInputAddress(data.results[0].formatted);
     }
    }
  
  const generateDestinationPlaces = async(text) => {
    setPickUpOpen(true);
    setDestinationInputAddress(text);
    const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&format=json&apiKey=2f0ba47327124778869bc4fec53fae04`);
    const data = await res.json();
   if(data.results){
    setSearchedPlaceList(data.results);
 }
  }
  
  

  const containerStyle = {
    width: '800px',
    height: '400px'
  };
  
  const center = {
    lat: 27.700769,
    lng: 84.300140
  };
  const estPrice = Math.ceil((getDistance(currentPos, currentDestinationPos)/1000) * selectedVehicle.pricePerUnitKm);
  const [finalPrice , setFinalPrice] = useState(0);
  const [submittedReq , setSubmittedReq] = useState(false);

 
  const handleSubmitRequest = () =>{
    setSubmittedReq(!submittedReq);
    if(!submittedReq){
      const rideDetails = {
        phoneNumber : phoneInput || userDetails.phoneNumber,
        currentPos,
        currentDestinationPos,
        priceChangeCount,
        pickInputAddress,
        destinationAddress,
        selectedVehicle,
        estPrice,
        finalPrice,
        user : userDetails._id
      }
      socket.emit('rides',rideDetails);
    }
    else{
     
      alert("Your ride has been cancelled");   
    }
  }

 
  return (
     
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
      <body className='body'>
      {JSON.stringify(rideAcceptDetails) != '{}'  && 
        (
          <div className='acceptedCard'>
         <h1>Rider name : {rideAcceptDetails.rider?.firstName +''+rideAcceptDetails.rider?.lastName}</h1>
         <br/>
         <p>Pickup address : {rideAcceptDetails?.pickInputAddress?.substring(0,30)+ '...'}</p>
         <p>Destination address : {rideAcceptDetails?.destinationAddress?.substring(0,30)+ '...'}</p>
         <p>Estimated price : {rideAcceptDetails?.estPrice}</p>
         <p>Final price : {rideAcceptDetails?.finalPrice}</p>
         <div style={{display:'flex',justifyContent:'space-between'}}>
         <button
          style={{backgroundColor:'yellowgreen' ,padding:'7px' ,borderRadius:'5px',cursor:'default'}} >
          Ride accepted
         </button>
         <button
          onClick={()=>window.location.href = "/"}
          style={{backgroundColor:'red' ,padding:'7px' ,borderRadius:'5px',cursor:'pointer'}} >
          Take next ride
         </button>
         </div>
        
       </div>
         )
      }
     
      
      <div className='map'>
          {isLoaded && 
            <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPos.lat ? currentPos : center}
          zoom={10}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <>
          <MarkerF  position={currentPos} onDragEnd={changePickupAddress} draggable={true} />
          <MarkerF position={currentDestinationPos} onDragEnd={changeDestinationAddress} draggable={true} />
          </>
        </GoogleMap>}
         </div>
        
         {JSON.stringify(rideAcceptDetails)== '{}' &&

         (
          <div style={{backgroundColor:'rgba(0,0,0,0.2)' , width:'52%',
         padding:'5px 15px'}}>
             <h1 style={{textAlign:'center',fontWeight:'bold'}}>Choose your vehicle</h1>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            {vehicleInfoList.length>0 && vehicleInfoList.map((item)=>{
            return(
              <button style={{ margin:'0px auto',
               cursor:'pointer',backgroundColor:'white',margin:'3px 7px',padding:'5px',
              borderRadius:'4px'}} onClick={()=> setSelectedVehicle(item)}>

              <img src={item.iconUrl} height={50} width={50} />

              </button>
            )
           })}
            </div>
          
        </div>
         )

         }  
       
         
           {JSON.stringify(rideAcceptDetails) == '{}' &&
            (
              <div style={{width:'52%'}}>
              <div className='input'>
           <input value={pickInputAddress}
            onChange={e=>generatePlaces(e.target.value)}
            onClick={()=>{
              setInput1On(true)
              setInput2On(false)
            }} 
            onBlur={()=>{ 
              if(!isSelectionOngoing){
              setPickUpOpen(false)
            }
            }}
            type='text' placeholder='Enter your pickup'></input>

            <input value={destinationAddress}
            onChange={e=>generateDestinationPlaces(e.target.value)}
            onClick={()=>{
              setInput2On(true)
              setInput1On(false)
            }} 
            onBlur={()=>{ 
              if(!isSelectionOngoing){
              setPickUpOpen(false)
              
            }
            }}
            type='text' placeholder='Enter your destination'></input>
            
           
         {  isLoggedIn || phoneInput ?
           (<button type='submit'
            onClick={()=>{handleSubmitRequest()
            }}
            className='submitbtn'>
           {submittedReq ? "Cancell ride" : "Submit request"}
            </button>)
            :
           (<button type='submit'
            onClick={()=>{setPhoneValidationOpen(true)}}
            className='submitbtn'>Enter your details</button>)
         }  
         </div>
         
         <div style={{position:'relative'}}>
         <div style={{position:'absolute',width:'80%',margin:'0px auto',zIndex:'9'}}>
         {pickUpOpen && 
           <Placescard 
           setPickUpOpen={setPickUpOpen}  
           setIsSelectionOngoing={setIsSelectionOngoing}
           searchedPlaceList={searchedPlaceList}
           setDestinationInputAddress={setDestinationInputAddress}
           setPickInputAddress={setPickInputAddress}
           setZoom={setZoom}
           setCurrentPos={setCurrentPos}
           setCurrentDestinationPos={setCurrentDestinationPos}
           input1On={input1On}
           input2On={input2On}
           />}
         </div>
         
          <div style={{backgroundColor:'rgba(0,0,0,0.2)', padding:'5px 15px',
          display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center', position:'absolute',top:'0px',width:'100%'}}>
           
            <h1 style={{textAlign:'center',fontWeight:'bold'}}>Bargain the ride</h1>
           <div className='buttons' style={{width:'22%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          
           <button style={{backgroundColor:'yellowgreen'}} className='w-10 m-2' onClick={()=>setFinalPrice(finalPrice ? finalPrice + priceChangeCount : estPrice + priceChangeCount)} 
         >+</button>

         <input style={{textAlign:'center',width:'100px'}} value={priceChangeCount} onChange={(e)=> setPriceChangeCount(Number(e.target.value))}
         ></input> 

            
         <button style={{backgroundColor:'yellowgreen'}} className='w-10 m-2' onClick={()=>setFinalPrice(finalPrice ? finalPrice - priceChangeCount : estPrice - priceChangeCount)} 
         >-</button>
          
           </div>

        <div style={{width:'100%' ,height:'100%',display:'flex',flexDirection:'column',flexWrap:'wrap',
        backgroundColor:'yellowgreen', padding:'5px',border:'2px solid white'}}>
            <p style={{padding:'7px'}}>Selected vehicle : {selectedVehicle.vehicle}</p> 
           <p style={{padding:'7px'}}>Estimated price : Rs. {estPrice || ''} </p> 
           <p style={{padding:'7px'}}>Final price : Rs. {finalPrice || estPrice || ''}</p>
           </div>
        
          </div>
         </div>
         
              </div>
            )
           }
     <CustomModal isOpen={phoneValidationOpen} onClose={()=>{setPhoneValidationOpen(false)}}
           setPhoneInput={setPhoneInput}  />        
      </body>
      <Footer/>
    </main>
  )
}

