import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import { useBackend } from '../../contexts/BackendContext';

import { sadWordsSet } from '../misc/sadWords.js';


// Styled components for better styling
const ProfileContainer = styled.div`
  margin: 0 40px;
  padding: 20px 0;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const ProfileHeader = styled.h2`
margin-left: 20px;

  color: #333;
`;

const UserData = styled.p`
margin-left: 20px;

  font-size: 1.2em;
  margin: 12px 0;
  color: #555;
`;

const LoadingText = styled.p`
  font-size: 1.2em;
  color: #888;
`;

// Styled components for metrics
const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const MetricBox = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  text-align: center;
`;

const MetricTitle = styled.h3`
  
  color: #555;
`;

const MetricValue = styled.p`
  font-size: 1.4em;
  color: #333;
`;

// Styled components for graphs
const GraphContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const GraphBox = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const GraphTitle = styled.h3`
  color: #555;
`;

// Back button styling
const BackButton = styled.button`
  position: absolute;
  top: 20px;
  right: 70px;
  padding: 10px 15px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
`;

const ScrollableList = styled.div`
  max-height: 50px;
  overflow-y: auto;
  margin-top: -15px;
`;

const ScrollableItemList = styled.div`
  margin-top: 10px;

  div {
    cursor: pointer;
    font-size: 1.2em; /* Adjust the font size to match other words */
    color: #333; /* Adjust the color to match other words */
    margin: 5px 0;
    padding: 5px;
    &:hover {
      background-color: #f0f0f0; /* Adjust hover background color if needed */
    }
  }
`;


const ScrollableProfileList = ({ items, onItemClick }) => {
  return (
    <ScrollableList>
      <ScrollableItemList>
        {items.map((item, index) => (
          <div key={index} onClick={() => onItemClick(item)}>
            {item}
          </div>
        ))}
      </ScrollableItemList>
    </ScrollableList>
  );
};


const Profile = () => {
  const history = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const [basicInfo, setBasicInfo] = useState(null);
  const [metricData, setMetricData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const userId = location.state && location.state.UID;
  const { backend } = useBackend();
  const [wordGraphData, setWordGraphData] = useState(null);
  const [chat, setChatData] = useState(null);
  const [illnessesArray, setIllnessesArray] = useState(null);
  const [selectedIllness, setSelectedIllness] = useState(null);
  const [mood, setMood] = useState(null);
  const [numSadWords, setNumSadWords] = useState(0);

  const handleIllnessSelect = (selectedIllness) => {
    setSelectedIllness(selectedIllness);
  };



  
  // Sample user data (replace with actual data fetching logic)
  
  // Use useParams to get the profile ID from the URL
  const { id } = useParams();
  

  function convertDateFormat(inputDate) {
    const dateObject = new Date(inputDate);
    
    // Extracting components of the date
    const year = dateObject.getFullYear().toString().slice(-2); // Extracting last two digits of the year
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding leading zero if needed
    const day = dateObject.getDate().toString().padStart(2, '0'); // Adding leading zero if needed
  
    // Combining components in MM/DD/YY format
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const profileData = await backend.get(`/profile/profile/${userId}`);
        setUserData(profileData.data[0]);
        setChatData(profileData.data[0]['chat']);

        const x = {
          id: profileData.data[0]['id'],
          name: profileData.data[0]['name'],
        };
        setBasicInfo(x);
        const z = profileData.data[0]['illnesses']
        const cleanedString = z.replace(/[{"]+/g, '').replace(/[}"]+/g, '');
  
  // Split the cleaned string based on commas
        setIllnessesArray(cleanedString.split(','));

        

        //const chat = setChat(chatResponse);
        

        const jsonArrayString = '[' + profileData.data[0]['date_score_info'].slice(1, -1) + ']';
        const jsonArrayStringWithArrays = jsonArrayString.replace(/\("\d{4}-\d{2}-\d{2}",\d{2}"\)/g, match => `[${match.slice(1, -1)}]`);
        const iterableObject = JSON.parse(jsonArrayStringWithArrays);
        
        const convertStringToTuple = (str) => {
          const [date, value] = str
            .replace('(', '')
            .replace(')', '')
            .split(',');
      
          return [String(date), parseInt(value)];
        };
      
        const tupleList = iterableObject.map((str) => convertStringToTuple(str));
        const y = {
          score: tupleList[0][1],
          sad_words: 0, // hard coded for now. will need to do some machine learning or smth or categorize words
          last_check_in: tupleList[0][0],
        };

        setMetricData(y);

        const labels = tupleList.map(item => convertDateFormat(item[0]));
        const data = tupleList.map(item => item[1]);

        setGraphData({
          data: data,
          labels: labels
        });

      } catch (err) {
        console.error(err);
      }

      

      /*--
  const analyzeSentiment = async () => {
    try {
      const response = await fetch('http://localhost:5000/analyze_sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_content: chat }),
      });

      console.log(1);
      const data = await response.json();
      console.log(data);
      const sentimentScore = data.sentiment_score;
      console.log(data);
      console.log(1);
      
      // Implement your convert_to_emotion_label logic here
      // This is just a placeholder example
      const emotionLabel = sentimentScore > 0 ? 'Positive' : 'Negative';

      setEmotionLabel(emotionLabel);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };
  analyzeSentiment();
  --*/

    };
      getData();
  }, []);


  // in charge of getting mood
  useEffect(() => {
    const getData = async () => {
    const user_prompt = "Given this chat, give me a one word to best describe the emotions of what is contained. Limit the response to 1 word! " + chat;
    const response = await backend.post(`/profile/openai/mood/${id}`, {
      user_prompt,
    });
    setMood(response['data']['gpt_response']['choices'][0]['message']['content']);
    }
    getData();

    
  }, [chat])



  useEffect(() => {
    const countSadWords = (text) => {
      if (text) {
      const words = text.split(/\s+/); // Split text into words
      const numSadWords = words.filter((word) => sadWordsSet.has(word.toLowerCase())).length;
      setNumSadWords(numSadWords);
      };
    };
  
    countSadWords(chat);

  }, [chat]);

  // useEffect to create graphs once the component is mounted
  useEffect(() => {
    // Ensure userData is not null before creating charts
      if (userData) {
        // Check if charts already exist, and delete them if they do
        const existingFollowersChart = Chart.getChart("followersChart");
        const existingPostsChart = Chart.getChart("postsChart");

        if (existingFollowersChart) {
          existingFollowersChart.destroy();
          history(-1);
        }

        if (metricData['score'] > 75)
          setMood("Happy");
        else if (metricData['score'] > 25)
          setMood("Okay");
        else 
          setMood("Sad");

        if (existingPostsChart) {
          existingPostsChart.destroy();
        }
        // Sample code to create a line chart using Chart.js
        const ctx1 = document.getElementById('followersChart');
        const followersChart = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: graphData.labels,
            datasets: [
              {
                label: 'Mood Score',
                data: graphData.data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
              },
            ],
          },
        });

        const ctx2 = document.getElementById('postsChart');
        const postsChart = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: ["Happy Words" , "Sad Words"],
            datasets: [
              {
                label: 'Happy',
                data: [userData['word_counts']['happy'], 0], // Assuming word_counts contains happy word count
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
              {
                label: 'Sad',
                data: [0, userData['word_counts']['sad']], // Assuming word_counts contains sad word count
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
              },
              
            ],
          },
        });
      }
    }, [metricData]);

  const handleBack = () => {
    history(-1);
  };

  return (
    <ProfileContainer>
      <BackButton onClick={handleBack}>Back</BackButton>
      {userData? (
        <>
          <ProfileHeader>{userData.name}'s Profile</ProfileHeader>
          {/* Add more user details as needed */}

          {/* Metrics */}
          <MetricsContainer>
            <MetricBox>
              <MetricTitle>Current Mood Score</MetricTitle>
              <MetricValue>{metricData.score}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricTitle>Depressive Words</MetricTitle>
              <MetricValue>{numSadWords}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricTitle>Most Recent Check-in</MetricTitle>
              <MetricValue>{metricData.last_check_in}</MetricValue>
            </MetricBox>
            {/* Fourth Box */}
            <MetricBox>
              <MetricTitle>Possible Illnesses</MetricTitle>
              {illnessesArray && (
                <ScrollableProfileList
                  items={illnessesArray}
                  onItemClick={handleIllnessSelect}
                />
              )}
            </MetricBox>
            <MetricBox>
              <MetricTitle>Mood</MetricTitle>
              <MetricValue>{mood}</MetricValue>
            </MetricBox>
          </MetricsContainer>

          {/* Graphs */}
          <GraphContainer>
            <GraphBox>
              <GraphTitle>Mood Score</GraphTitle>
              <canvas id="followersChart"></canvas>
            </GraphBox>
            <GraphBox>
              <GraphTitle>Depressive Word Count</GraphTitle>
              
              <canvas id="postsChart"></canvas>
            </GraphBox>
          </GraphContainer>
        </>
      ) : (
        <LoadingText>Loading...</LoadingText>
      )}
    </ProfileContainer>
  );
};

export default Profile;