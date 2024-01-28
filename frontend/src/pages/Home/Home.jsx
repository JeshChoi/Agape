import React, { useEffect, useState } from 'react';
import { Form, Image, Input, Button, Typography, Alert, Spin, Space, Table } from 'antd';
import styles from './Home.module.css';
import './Home.css';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useBackend } from '../../contexts/BackendContext';


export default function Home() {
  const { backend } = useBackend();
  const [dataSource, setDataSource] = useState([]);
  const [likeVisible, setLikeVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userUID = location.state && location.state.uid;

  useEffect(() => {
    const getData = async () => {
      try {
        const profile_data = await backend.get(`/profile/${userUID}`);
        const friends = profile_data.data[0].friends || [];
        //console.log(friends);

        const friendPromises = friends.map(async (friendId) => {
          try {
            const friendData = await backend.get(`/profile/user/${friendId}`);
          
            const { id, name, mood, last_checked } = friendData.data[0];
           
            
            const formattedLastOnline = new Date(last_checked).toLocaleString();
            
          
            // Add a unique key and name property to the friendData
            return { key: id, name, mood, formattedLastOnline };
          } catch (error) {
            console.error(`Error fetching data for friend with ID ${friendId}:`, error);
            return null;
          }
        });


        // Wait for all friend data requests to complete
        const friendDataArray = await Promise.all(friendPromises);
        //console.log(friendDataArray);
        setDataSource(friendDataArray.filter((friendData) => friendData !== null));

        //console.log(profile_data.data);
        
      } catch (error) {
        console.log(error);
        console.error('Error fetching data:', error);
      }
    };
    getData();

  }, []);

  function exitPage() {
     navigate('/');
  }
  
  function refreshPage() {
    window.location.reload();
  }

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/profile/${record.key}`}>{text}</Link>,
  },
  {
    title: 'Mood',
    dataIndex: 'mood',
    key: 'mood',
  },
  {
    title: 'Last Online',
    dataIndex: 'formattedLastOnline',
    key: 'last_checked',
  },
];

const MyTable = () => {
  return <Table dataSource={dataSource} columns={columns} onRow={(record) => ({ onClick: () => handleUserClick(record.key) })} />;
};

const handleUserClick = (userId) => {
  navigate(`/profile/${userId}`, { state: { UID: userId  } });
};

return (<>
  <div className="the-box">
    <div className='main-box'>
      <div className={styles.home}> 
        <div className='centerText'>
          <p className='subtleText'>AGAPE</p>
        </div>
        <MyTable> </MyTable>
        <Button className={styles.exit} onClick={exitPage}>Exit</Button>
      </div>
    </div>
    
    <div className='right-bar'>
      <p className='right-title'>Mental Health Resources</p>
      <ul>
          <li><a href="https://988lifeline.org" target="_blank" >Suicide and Crisis Lifeline</a></li>
          <li><a href="https://www.orangecountygov.com/1796/Crisis-Call-Center#:~:text=The%20Orange%20County%20Crisis%20Call%20Center%20is%20co%2Dlocated%20with,texting%20845%2D391%2D1000." target="_blank">Orange County Crisis Call Center</a></li>
          <li><a href="https://focus.senate.ca.gov/mentalhealth/suicide" target="_blank">National Sucidie Prevention Lifeline</a></li>
          <li><a href="https://www.cityofirvine.org/seek-assistance/mental-health-resources" target="_blank">Resources</a></li>
      </ul>
    </div>
    {/* Footer */}
    <footer className={styles.footer}>
        Made with Love by Students
      </footer>
  </div>
  
    
  </>
  )
};