import React, { useState } from 'react';
import axios from 'axios';

const MintNFT = () => {
  const [prompt, setPrompt] = useState('');
  const [musicURL, setMusicURL] = useState('');

  const generateMusic = async () => {
    const response = await axios.post('http://127.0.0.1:5000/generate-music', { prompt });
    setMusicURL(response.data.music_url);
  };

  return (
    <div>
      <h2>Generate AI Music</h2>
      <input type="text" placeholder="Enter music prompt" onChange={e => setPrompt(e.target.value)} />
      <button onClick={generateMusic}>Generate</button>
      {musicURL && <p>Music URL: {musicURL}</p>}
    </div>
  );
};

export default MintNFT;
