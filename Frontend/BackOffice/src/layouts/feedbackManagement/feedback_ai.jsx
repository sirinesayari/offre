/* eslint-disable */
import React from 'react';
import {
  Box,
  Grid,
} from '@mui/material';
import 'react-voice-recorder/dist/index.css';
import { useState, useEffect } from 'react';
import { Recorder } from 'react-voice-recorder';
import axios from 'axios';
import Status from './Status';
import Result from './Result';


const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization : process.env.REACT_APP_ASSEMBLY_API_KEY,
    'Content-type': 'application/json',
  },
})

const initialState = {
  url: null,
  blob: null,
  chunks: null,
  duration: {
    h: 0,
    m: 0,
    s: 0.
  },
}

function FeedBack({ interviewId }) {
  const[audioDetails, setAudioDetails] = useState(initialState);
  const [transcript, setTranscript] = useState({id: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');


  const saveTranscriptionToDatabase = async (text) => {
    try {
      await axios.post('http://localhost:5000/feedbacks/save', { text: text, interviewId: interviewId });
      console.log('Transcription enregistrée dans la base de données avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la transcription dans la base de données :', error);
    }
  };


  useEffect(() => {
    const fetchTranscription = async () => {
      if (transcript.id && transcript.status !== 'completed' && isLoading){
        try{
          const {data : transcriptData} = await assemblyApi.get(
            `/transcript/${transcript.id}`
          );
          setTranscript({ ...transcript, ...transcriptData });

          if (transcriptData.text) {
            saveTranscriptionToDatabase(transcriptData.text);
          }

        }catch (err){
          console.error(err);
        }
    }
};

fetchTranscription();

return () => {};
}, [transcript, isLoading , interviewId]);

  const handleAudioStop = (data) => {
    setAudioDetails(data);
  };

  const handleReset = () => {
    setAudioDetails({...initialState});
    setTranscript({id : ''});
  }

  const handleAudioUpload = async (audioFile) => {
    setIsLoading(true);
     
    const {data: uploadResponse } = await assemblyApi.post('/upload', audioFile);

    const {data} =await assemblyApi.post('/transcript' , {
      audio_url: uploadResponse.upload_url,
      sentiment_analysis : true,
      entity_detection: true ,
      iab_categories : true,
    });

    setTranscript({ id: data.id });

  };

  return (
      <Box textAlign="center" fontSize="xl">
        <Grid>
            <Box>
              {transcript.text && transcript.status === 'completed'
              ? (<Result transcript={transcript}/>) : (<Status isLoading={isLoading} status={transcript.status} /> )}
            </Box>
            <Box width={400} style={{marginLeft:"20%"}}>
            <Recorder 
              record={true}
              audioURL={audioDetails.url}
              handleAudioStop = {handleAudioStop}
              handleAudioUpload = {handleAudioUpload}
              handleReset = {handleReset}
            />
             </Box>
        </Grid>
      </Box>

  );
}

export default FeedBack;
