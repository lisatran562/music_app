import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
    const CLIENT_ID = '33bccc55613d450fa0989687179fff2d';
    const REDIRECT_URI = 'http://localhost:3000/';
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';

    const [token, setToken] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('token');

        if (!token && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

            window.location.hash = '';
            window.localStorage.setItem('token', token);
        }

        setToken(token);

        // Automatically fetch playlists when the component mounts
        searchPlaylists(token);
    }, []);

    const searchPlaylists = async (accessToken) => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setPlaylists(response.data.playlists.items);
        } catch (err) {
            setError(err.message);
        }
    };


    const logout = () => {
        setToken('');
        window.localStorage.removeItem('token');
    };

    return (
        <div className="App">
            <header className="App-header text-center">
                <h1>Music App</h1>
                {!token ? (
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
                ) : (
                    <button onClick={logout}>Logout</button>
                )}

                {token ? (
                    <div>
                        <div className="mt-5">
                            {error ? (
                                <p>Error: {error}</p>
                            ) :
                                (
                                    <div className='text-center'>
                                        <h2 className='text-info'>Recommendations</h2>
                                        {playlists ? (
                                            playlists.map((playlist, i) => (
                                                <p key={i}>
                                                    <h3>{playlist.name}</h3>
                                                    <p>{playlist.description}</p>
                                                    <p><a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                        Listen on Spotify
                                                    </a></p>
                                                    {playlist.images && playlist.images.length > 0 && (
                                                        <img src={playlist.images[0].url} alt={playlist.name} />
                                                    )}
                                                </p>
                                            ))

                                        ) : (
                                            <p>Nothing is mapping out</p>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <h2>Please login</h2>
                )}
            </header>
        </div>
    );
};

export default Recommendations;
