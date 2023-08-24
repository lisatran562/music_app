import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import Recommendations from '../components/Recommendations'
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

const Dashboard = () => {
    const [loggedInUser, setLoggedInUser] = useState({})
    const [listRecs, setListRecs] = useState([])
    const navigate = useNavigate();
    const [{ token }, dispatch] = useStateProvider();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/getloggedinuser`, {withCredentials:true})
            .then(res => {
                console.log('res when getting logged in user')
                if(res.data.results){
                    // this means the user is logged in and can access this page
                    setLoggedInUser(res.data.results)
                }
                
            })
            .catch(err => {               
                // this means someone who is not logged tried to access the dashboard
                console.log('error when getting logged in user')
                navigate('/')
            })
    }, [])

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists`, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            })
            .then(res => {
                console.log(res.data.playlists.items.description)
                setListRecs(res.data.playlists.items.description)
            })
            .catch(err => {
                console.log(err)
            })
        }
        fetchData()
    }, [dispatch, token])

    return (
        <div>
            test
            <Recommendations listRecs={listRecs}/>
        </div>
    )
}

export default Dashboard