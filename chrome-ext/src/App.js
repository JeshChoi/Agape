import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

function App(){
  const [chatLog, setChatLog] = useState(null); // State to store the chat log
  const [chatGPTResponse, setChatGPTResponse] = useState(null); // State to store ChatGPT response
  async function startScrape(){
    
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
          {chatGPTResponse ? <ResponseOptions data={chatGPTResponse}/> : <img src='/paul.png'></img> }
        </div>
        <div className='the-box-footer'>
          <Button onClick={startScrape} size='lg' bg='#FAAC74' _active={{ bg: '#c47f5a' }} _hover={{ bg: '#e69565' }} colorScheme='blue'>Help Me!</Button>
          <Button onClick={openInNewTab} size='lg' bg='#FAAC74' _active={{ bg: '#c47f5a' }} _hover={{ bg: '#e69565' }} colorScheme='blue'>Dashboard</Button>
        </div>
      </div>   
    </div>
  )
}
const ResponseOptions = ({ data }) => {
  return (
    <div className='gpt-response'>
      <Text fontSize='sm'>{data.message}</Text>
      <Stack direction='column' spacing={4} size='xs' align='left'>
        {data.options.map((option, index) => (
          <Button 
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
      <div className='clipboard-text'>
      <Text fontSize='sm'>Select one to copy to clipboard</Text>
      </div>
      

    </div>
  );
};
export default App
