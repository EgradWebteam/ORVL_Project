// Bookmark.js
import React from 'react';

const Bookmark = ({ bookmarkedVideos, allVideos }) => {
    return (
        <div>
            <h2>Bookmarked Videos</h2>
            <ul>
                {bookmarkedVideos.map(videoId => {
                    const video = allVideos.find(v => v.video_id === videoId);
                    return video ? (
                        <li key={video.video_id}>{video.video_name}</li>
                    ) : null;
                })}
            </ul>
        </div>
    );
};

export default Bookmark;
