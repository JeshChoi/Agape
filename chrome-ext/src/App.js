import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react'

import logo from './logo.svg';
import './App.css';

function App(){
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      // Check for the specific message
      if (message.chatGPTResponse) {
        setIsLoading(false)
        setChatGPTResponse(JSON.parse(message.chatGPTResponse));
      }
    };

    // Register the listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup function to unregister the listener
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  async function startScrape(){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    setIsLoading(true)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/contentScript.js'] // Make sure this is the path to your content script
    });
  }
  function openInNewTab() {
    window.open('https://youtu.be/eBGIQ7ZuuiU');
  }
  return (
    <div className='the-box'>
      <div className='h-holder'>
        <Heading as='h3' size='lg'>
          Agape - Mental Health
        </Heading>
      </div>
      <div className='divider'>
      <Divider />
      </div>
      
      <div className='the-actual-content'>
        <div className='box-content'>
        {isLoading ? (
          <div className='fidget-spinner'>
            <Spinner />
          </div>
            
          ) : chatGPTResponse ? (
            <ResponseOptions data={chatGPTResponse} />
          ) : (
            <img src='/paul.png' alt='Paul' />
          )}
        </div>
        <div className='the-box-footer'>
          <Button onClick={startScrape} size='lg' bg='#FAAC74' _active={{ bg: '#c47f5a' }} _hover={{ bg: '#e69565' }} colorScheme='blue'>Help Me!</Button>
          <Button onClick={openInNewTab} size='lg' bg='#FAAC74' _active={{ bg: '#c47f5a' }} _hover={{ bg: '#e69565' }} colorScheme='blue'>Dashboard</Button>
        </div>
      </div>   
    </div>
  )
}
const copyToClipboard = text => {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Text copied to clipboard");
  }).catch(err => {
    console.error('Error in copying text: ', err);
  });
};
const ResponseOptions = ({ data }) => {
  return (
    <div className='gpt-response'>
      <Text fontSize='sm'>{data.message}</Text>
      {data.options && data.options.length > 0 ? (
        <Stack direction='column' spacing={4} size='xs' align='left'>
          {data.options.map((option, index) => (
            <Button 
              onClick={() => {copyToClipboard(option)}}
              colorScheme='teal' 
              variant='solid' 
              color='#5F2A1A'
              bg='#FFFFFF'
              _hover={{ bg: '#ebedf0' }}
              _active={{ bg: '#7f3d2a' }}
              fontSize='sm' // Adjust font size as needed
              whiteSpace="normal" // Allow the text to wrap
              h="auto" // Height will adjust to content
              minH="50px" // Minimum height for consistency
              px={4} // Horizontal padding
              py={2} // Vertical padding, adjust as needed
            >
              {option}
            </Button>
          ))}
        </Stack>
      ) : (
        <Text fontSize='sm'>No response options available.</Text>
      )}
      {data.options && data.options.length > 0 && (
        <div className='clipboard-text'>
          <Text fontSize='sm'>Select one to copy to clipboard</Text>
        </div>
      )}
    </div>
  );
};

export default App
